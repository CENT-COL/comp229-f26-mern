import express from 'express';
import {
   createUser,
   updateUser,
   deleteUser,
   getAllUsers, 
   getUserById,
   loginUser
} from '../controllers/user-controllers.js';

const router = express.Router();

// REST API simulate CRUD

// READs
router.get("/", getAllUsers);
router.get("/:id", getUserById);

// CREATE
router.post("/", createUser);

// UPDATE
router.put("/:id", updateUser);

// DELETE
router.delete("/:id", deleteUser);

router.post('/login', loginUser);

export default router;