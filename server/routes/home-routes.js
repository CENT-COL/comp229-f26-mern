import express from 'express';
import homeController from '../controllers/home-controllers.js';

const router = express.Router();

router.use("/", homeController);

export default router;