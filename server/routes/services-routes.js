import express from 'express';
import servicesController from '../controllers/services-controller.js'; 

const router = express.Router();

router.use("/", servicesController);

export default router;