import express from 'express';
import contactController from '../controllers/contact-controllers.js'

const router = express.Router();

router.use("/", contactController);

export default router;