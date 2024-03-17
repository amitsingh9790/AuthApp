const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// signup route handler
exports.signup = async (req,res) => {
    try{
        // get data
        const{ name, email, password, role} = req.body;
        // check if user already exist
        const existingUser = await User.findOne({email});

        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            })
        }
        // Secure password
        let hashedPassword;
        try{
            hashedPassword = await bcrypt.hash(password, 10);
        }
        catch(err) {
            return res.status(500).json({
                success:false,
                message:'Error in hashing Password',
            });
        }

        // create entry for User
        const user = await User.create({
            name,email,password:hashedPassword,role
        })

        return res.status(200).json({
            success:true,
            message: 'User Created Successfully',
        });

    }
    catch(error) {
        console.error(error);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        });
    }
}

// login route handler
exports.login = async(req,res) =>{
    try{
        // data fetch
        const {email, password} = req.body;
        // validation on email and password
        if(!email || !password){
            return res.status(400).json({
                success:false,
                message:'Please fill all the detail carefully',
            });
        }
        // Checking for registered user
        let user = await User.findOne({email});
        // if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            })
        }
        // payload is a piece of data
        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        };
        // verify password and generate a JWT token 
        if(await bcrypt.compare(password,user.password)){  //bcrypt.compare function is used to compare the user password and
            // password matched                              already stored in database password is matched on not. 
            let token = jwt.sign(payload,                // JWT sign method is used to creating a token the take are three
                                process.env.JWT_SECRET,  // arguments one is a data(objext), and the second one is a secret
                                {                        // key and the last one is an options object for better use of the token.
                                    expiresIn:"2h",
                                })
            user = user.toObject();
            user.token = token;
            user.password = undefined; // we have removed password form user object not from database because we
                                       // don't want to share password in response because of hackers
            const options = {
                // expires: new Date( Date.now() + 3 * 24 * 60 * 60 * 1000),
                expires: new Date( Date.now() + 10* 1000),                
                httpOnly:true, //httpOnly enabled means It can't access at client site

            }
            // Passing cookie as a response
            res.cookie('token', token, options).status(200).json({
                success:true,
                token,
                user,
                message:'User Logged in successfully',
            })
            // Without passing cookies as a reponse
            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:'User Logged in successfully',
            // })
        }
        else{
            // password not matched
            return res.status(403).json({
                success:false,
                message:' Password Incorrect',
            })
        }


    }
    catch{
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Login Failure",
        })

    }
}