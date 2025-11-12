const {UserController} = require('../../controllers');
const express = require('express');


const router = express.Router();


router.post('/create', UserController.createUser);
router.post('/signin', UserController.signIn);
router.post('/signout', UserController.signOut);


router.get('/:id', UserController.getUserById);


module.exports = router;