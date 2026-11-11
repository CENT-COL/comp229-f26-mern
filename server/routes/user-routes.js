import express from 'express';
import {
   createUser,
   updateUser,
   deleteUser,
   getAllUsers, 
   getUserById,
   loginUser,
   setup2FA,
   verify2FASetup,
   verifyOTP
} from '../controllers/user-controllers.js';

const router = express.Router();

// REST API simulate CRUD

// READs
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// CREATE
router.post("/", createUser);

// UPDATE
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

router.post('/login', loginUser);

router.post('/setup-2fa', setup2FA);
router.post('/verify-2fa-setup', verify2FASetup);
router.post('/verify-otp', verifyOTP);

export default router;