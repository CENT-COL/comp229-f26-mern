import express from 'express';
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from '../controllers/projects-controllers.js';

const router = express.Router();

// REST API simulate CRUD

// READs
router.get("/", getAllProjects);
router.get("/:id", getProjectById);

// CREATE
router.post("/", createProject);

// UPDATE
router.put("/:id", updateProject);

// DELETE
router.delete("/:id", deleteProject);

export default router;