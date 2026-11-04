import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        startDate: Date,
        endDate: Date,
    }
);

export default mongoose.model("Project", projectSchema);

