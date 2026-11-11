import otplib from 'otplib';
import qrcode from 'qrcode';
import UserModel from '../models/user-model.js'
import generateToken from '../utils/jwt.js'

// CRUD - Create, Read, Update, Delete

// ES6 arrow function format
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    try {
        const newUser = new UserModel(req.body);
        const savedUser = await newUser.save();        

        res.status(201).json({ user: savedUser });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async (req, res) => {
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true } 
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        } // is not null or undefined

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findUserWithPassword = async ({email, password}) => {
    const user = await UserModel.findOne({email}).select('+password +otpSecret');
    if (!user) {
        return null;
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
        return null;
    }
    return user;
}


export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email }).select('+password');

        if(!user){
            return res.status(404).json({message: "User not found"})
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ is2FAEnabled: user.is2FAEnabled });
    } catch (error) {
       res.status(500).json({message: error.message}) 
    }
}

export const setup2FA = async (req, res) => {
    try {
        const user = await findUserWithPassword(req.body);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.is2FAEnabled) {
            return res.status(409).json({ message: '2FA is already enabled. Please log in.' });
        }

        const secret = otplib.authenticator.generateSecret();
        const otpauth = otplib.authenticator.keyuri(user.email, 'COMP229 MERN', secret);
        const imageUrl = await qrcode.toDataURL(otpauth);
        user.otpSecret = secret;
        await user.save();
        res.set('Cache-Control', 'no-store');
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verify2FASetup = async (req, res) => {
    try {
        const user = await findUserWithPassword(req.body);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        if (user.is2FAEnabled) {
            return res.status(409).json({ message: '2FA is already enabled. Please log in.' });
        }
        const { token } = req.body;
        if (!user.otpSecret) {
            return res.status(400).json({ message: 'Generate the QR code first' });
        }

        const isValid = otplib.authenticator.check(token, user.otpSecret);
        if (!isValid) {
            return res.status(400).json({ message: 'Invalid authenticator code' });
        }
        user.is2FAEnabled = true;
        await user.save();
        res.json({ message: '2FA setup is complete. You can now log in.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const user = await findUserWithPassword(req.body);
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const { token } = req.body;
        if (!user.is2FAEnabled || !user.otpSecret) {
            return res.status(400).json({ message: 'Set up your authenticator first' });
        }

        const isValid = otplib.authenticator.check(token, user.otpSecret);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid authenticator code' });
        }
        // This is the only endpoint that issues an access JWT on this branch.
        const accessToken = generateToken(user);
        res.status(200).json({ message: 'Login successful', token: accessToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
