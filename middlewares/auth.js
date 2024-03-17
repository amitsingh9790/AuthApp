// auth, isStudent, isAdmin

const jwt = require('jsonwebtoken');
require('dotenv').config(); 

exports.auth = (req,res, next) => {
    try{
        // Extract JWT token
        // Three ways to fetch token 1) cookies, 2) body and 3) header (more secure than 1 and 2)
        console.log("cookie", req.cookies.token);
        console.log("body", req.body.token);
        console.log("header", req.header("Authorization"));
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", ""); //Explaination for header method: 
                                                            //request ke ander, header ke ander authorization key nikal kar le aaoo,le aaye nikal kar, kya value aa rahi hai, bearer
                                                           //space token , ab Jaha par bearar space likha hai na usse empty string se replace kar do, ab sirf token bcha
        
        if(!token || token === undefined) {
            return res.status(401).json({
                success:false,
                message:'Token Missing',
            });
        }

        // verify the token
        try{
            const payload = jwt.verify(token, process.env.JWT_SECRET); //JWT verify method is used for verify the token. It's take 
            //two arguments  one is token string value, and second one is secret key for matching the token is valid or not. The 
            //validation method returns a decode object that we stored the token in.
            console.log(payload);                                      

            req.user = payload;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:'Token is invalid',
            });
        }
        next();
    }
    catch(error) {
        return res.status(401).json({
            success:false,
            message:'Something went wrong, while verifying the token',
        });
    }
}

exports.isStudent = (req,res, next) => {
    try {
            if(req.user.role !== "Student") {
                return res.status(401).json({
                    success:false,
                    message:'This is a protected route for students',
                });
            }
            next();
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'User Role is not matching',
        })
    }         
}

exports.isAdmin = (req, res, next) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin',
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'User Role is not matching',
        })
    }
}