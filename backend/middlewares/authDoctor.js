import jwt from 'jsonwebtoken'


//doctor authentiation middleware
const authDoctor = async (req,res,next)=>{
    try {

        // let token = req.header("Authorization")
        const {dtoken} = req.headers

        if(!dtoken){
            return res.json({success:false,message:"Invalid Authentication for Doctor in authDoctor"})
        }

        const decoded = jwt.verify(dtoken,process.env.JWT_SECRET)

        req.body.docId = decoded.id  


        next()

            
        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"doctor authentication poindi"})
        
    }

}

export default authDoctor