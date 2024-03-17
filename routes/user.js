const express = require('express');
const router = express.Router();

const{ login, signup} = require('../Controllers/Auth');
const{auth, isStudent, isAdmin} = require('../middlewares/auth');

router.post("/login",login);
router.post("/signup",signup);

// Testing protected routes for single middleware
router.get("/test", auth, (req,res) => {                //middleware for checking authorization
    res.json({
        success:true,
        message:'Welcome to the Protected route for Tests',
    });
})

// protected Route
router.get("/student", auth, isStudent, (req,res) => {  //middleware for checking authentication
    res.json({
        success:true,
        message:'Welcome to the Protected route for Students',
    });
});

router.get("/admin", auth, isAdmin, (req,res) => {     //middleware for checking authentication
    res.json({
        success:true,
        message:'Welcome to the Protected route for Admin',
    });
});

module.exports = router;