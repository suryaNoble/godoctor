import jwt from 'jsonwebtoken'

//middleware for admin auth before adding doctoror doing any privilaged operation
const authAdmin = async (req,res,next)=>{
    try {

        const token = req.header("Authorization")
        console.log('authAdmin lo unnam')
        console.log(token)
        if(!token) return res.status(400).json({message:"Invalid Authentication"})

        const decoded = jwt.verify(token,process.env.JWT_SECRET)

        if(decoded !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD){
            return res.status(400).json({message:"Invalid Authentication because of admin email or pass"})
        }

        next()

            
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"Admin authentication poindi"})
        
    }

}

export default authAdmin