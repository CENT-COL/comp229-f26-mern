import express from 'express';
import {
    createProject,
    deleteProject,
    getAllProjects,
    getProjectById,
    updateProject
} from '../controllers/projects-controllers.js';

import authMiddleware from '../middlewares/auth.js';

const router = express.Router();

// REST API simulate CRUD

// READs
router.get("/", authMiddleware, getAllProjects);
router.get("/:id", authMiddleware,getProjectById);

// CREATE
router.post("/", authMiddleware,createProject);

// UPDATE
router.put("/:id", authMiddleware,updateProject);

// DELETE
router.delete("/:id", authMiddleware,deleteProject);

export default router;