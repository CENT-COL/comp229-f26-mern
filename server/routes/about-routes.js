import express from 'express';
import aboutController from '../controllers/about-controllers.js';

const router = express.Router();

router.use("/", aboutController);

export default router;