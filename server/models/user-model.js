import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
    {
        name: String,
        email: String,
        password: String
    }
);

userSchema.pre("save", async function(){
    if(this.isModified("password") || this.isNew){
        this.password = await bcrypt.hash(this.password, 10);
    }
}
)

userSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
} 

export default mongoose.model("User", userSchema);