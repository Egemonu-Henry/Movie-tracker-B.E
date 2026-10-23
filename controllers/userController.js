import validator from 'validator'
import userModel from '../models/userModels.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'


const createToken = (id)=>{
    return jwt.sign({id}, process.env.JWT_SECRET)
}


// LOGIN CONTROLLER
const loginUser = async (req, res) =>{

    
    try{
        const {email, password} = req.body; 
        const user = await userModel.findOne({email})

        if(!email || !password){
            return res.status(400).json({message: "please fill all fields"})
        }

        if(!user){
             return res.status(401).json({message: "Incorrect email or Password",success: false})
        }
        
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Incorrect email or password",
            });
        }


        if (isPasswordValid) {
            const token = createToken(user._id)
            res.status(201).json({
                message: 'login successful',
                id: user._id,
                email: user.email,
                username: user.username,
                token,
            })
        }
       

    } catch (error) {
         res.status(500).
         json({message: "server error", 
            error: error.message,})
    }
}


// REGISTRATION CONTROLLER
const registerUser = async (req, res)=>{
    try {
        const { username, password, email, name } = req.body || {};

        if (!username || !email || !password || !name) {
            return res.status(400).json({
                message: 'Please fill all fields',
            });
        }

        const userExist = await userModel.findOne({ email });

        if (userExist) {
            return res.status(409).json({
                message: 'email already exists',
            });
        }

        if(!validator.isEmail(email)){
            return res.status(400).json({success: false, message: 'invalid email address'})
        }

        if(password.length < 8){
            return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters",
            });
        }

        const usernameExist = await userModel.findOne({ username });
        if(usernameExist){
            console.log("Username already exists");

            return res.status(409).json({
                success: false,
                message: "Username already exists",
            });
        }

        const newUser = new userModel({
            name,
            username,
            email,
            password
        })

        const user = await newUser.save()

        const token = createToken(user._id)

        return res.status(201).json({
            success: true,
            id: user._id,
            email: user.email,
            username: user.username,
            password: user.password,
            token,
            message: 'account created'
        });


        
       
    } catch (error) {
        console.error('Registration error:', error);
        console.log(error)

        return res.status(500).json({
            message: 'Registration failed', 
            success: false,
            error: error.message, 
        });
    }
}

const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

export {loginUser, registerUser, getMe}
