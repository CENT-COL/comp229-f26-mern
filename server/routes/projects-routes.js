import express from 'express';
import projectsController from '../controllers/projects-controllers.js';

const router = express.Router();

router.use("/", projectsController);

export default router;