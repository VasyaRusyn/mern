const {Router} = require('express')
const router = Router()
const User = require('../modals/User')
const brypter = require('bcryptjs')
const {check,validationResult} = require("express-validator")
const jwt = require('jsonwebtoken')


router.post('/registration', 
[
    check('email','Не коректный emeil').isEmail(),
    check('password','Не коректный password').isLength({min:6})
]
,

async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                erors: errors.array(),
                message:"Не коректные данные"
            })
        }
        const{email,password} = req.body;

        const isUsed = await User.findOne({email})

        if(isUsed){
            return res.status(300).json({message:'Такого email занят'})
        }

      const hashedPass = await brypter.hash(password,12)

        const user = new User({
            email,password:hashedPass
        })
        await user.save()

            res.status(201).json({message:'Пользователь создан'})

    } catch (e){
        console.error(e);
    }
})



router.post('/login', 
[
    check('email','Не коректный emeil').isEmail(),
    check('password','Не коректный password').exists()
]
,

async (req,res)=>{
    try{
        const errors = validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({
                erors: errors.array(),
                message:"Не коректные данные"
            })
        }
        const{email,password} = req.body;

        const user = await User.findOne({email,password})

        if(!user){
            return res.status(400).json({message:'Такого email не найдено'})
        }

        const isMatch = brypter.compare(password,user.password)

        
        if(!isMatch){
            return res.status(400).json({message:'Такого password не найдено'})
        }
        console.log(user.password);
        const jwtSecret = 'sdwie234jk23k3h4jk23hj4kh4jk2jk2h34jkqq'

        const token = jwt.sign(
            {userId : user.id},
            jwtSecret,
            {expiresIn:'1h'}
        )
            res.json({token,userId:user.id})

    } catch (e){
        console.error(e);
    }
})


module.exports = router;