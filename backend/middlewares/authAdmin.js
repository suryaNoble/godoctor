import jwt from 'jsonwebtoken'

//middleware for admin auth before adding doctoror doing any privilaged operation
const authAdmin = async (req,res,next)=>{
    try {

        // let token = req.header("Authorization")
        const {atoken} = req.headers
        console.log(atoken)
        console.log('authAdmin lo unnam')
        console.log(atoken)
        if(!atoken) return res.json({success:false,message:"Invalid Authentication authAdmin firslo"})
            // if (token.startsWith("Bearer ")) {
            //     token = token.split(" ")[1]; 
            // }
        const decoded = jwt.verify(atoken,process.env.JWT_SECRET)
        console.log('deoded token:',decoded)

        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(400).json({message:"Invalid Authentication because of admin email or pass"})
        }

        console.log('calling next function')

        next()

        //5 hours 47 minutes wrking fine storing data from hopscotch but not form 
            
        
    } catch (error) {
        console.log('mana munde unnaaru mana subhash')
        console.log(error)
        res.status(500).json({message:"Admin authentication poindi"})
        
    }

}

export default authAdmin