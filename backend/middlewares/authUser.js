import jwt from 'jsonwebtoken'


//user authentiation middleware
const authUser = async (req,res,next)=>{
    try {

        // let token = req.header("Authorization")
        const {token} = req.headers

        if(!token) return res.json({success:false,message:"Invalid Authentication for user in authUser"})

        const decoded = jwt.verify(token,process.env.JWT_SECRET)
        console.log('authUserlo unnaam');
        console.log(decoded)
        req.body.userId = decoded.id  


        next()

        //5 hours 47 minutes wrking fine storing data from hopscotch but not form 
            
        
    } catch (error) {
        console.log('mana munde unnaaru mana subhash')
        console.log(error)
        res.status(500).json({message:"user authentication poindi"})
        
    }

}

export default authUser