import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        name: String,
        descriptition: String,
        startDate: Date,
        endDate: Date,
    }
);

export default mongoose.model("Project", projectSchema);

