import express from 'express';
import{userLogin,userSignup, getUsers, getMessages, saveMessage} from "../controller/userAuth.js"
const router= express.Router();

router.post("/login",userLogin)
router.post("/signup",userSignup)
router.get("/users", getUsers)
router.get("/messages", getMessages)
router.post("/messages", saveMessage)

export default router;
