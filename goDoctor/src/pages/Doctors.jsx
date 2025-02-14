import  { useContext,useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
const Doctors = () => {

  const {speciality} = useParams()
  const {doctors} = useContext(AppContext)
  const [filterDoc,setFilterDoc] = useState([])
  const [showFilter,setShowFilter] = useState(false)

  const navigate = useNavigate()

  const applyFilter = () => {
    if(speciality){
      const filteredDoc = doctors.filter(doc=>doc.speciality===speciality)
      setFilterDoc(filteredDoc)
    }else{
      setFilterDoc(doctors)
    }
  }

  useEffect(()=>{
    applyFilter()
  },[doctors,speciality])

  return (
    <div>
      <p className='text-gray-600' >Browse through our Magicians.</p>
      <div className='flex flex-col sm:flex-row items-start gap-5 mt-5' >
        <button className={`py-1 px-7 border rounded text-sm transition-all sm:hidden ${showFilter?'bg-primary text-white':''}`} onClick={()=>{setShowFilter(!showFilter)}} >filters</button>
        <div className={`flex flex-col gap-4 text-sm text-gray-600 ${showFilter?'flex':'hidden sm:flex'} `} >
          <p onClick={()=>{speciality=='General physician'?navigate('/doctors'):navigate('/doctors/General physician')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='General physician'?"bg-indigo-50 text-black" : ""}`} >General Physician</p>
          <p onClick={()=>{speciality=='Gynecologist'?navigate('/doctors'):navigate('/doctors/Gynecologist')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='Gynecologist'?"bg-indigo-50 text-black" : ""}`}>Gynecologist</p>
          <p onClick={()=>{speciality=='Dermatologist'?navigate('/doctors'):navigate('/doctors/Dermatologist')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='Dermatologist'?"bg-indigo-50 text-black" : ""}`}>Dermatologist</p>
          <p onClick={()=>{speciality=='Pediatrician'?navigate('/doctors'):navigate('/doctors/Pediatrician')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='Pediatrician'?"bg-indigo-50 text-black" : ""}`}>Pediatrician</p>
          <p onClick={()=>{speciality=='Neurologist'?navigate('/doctors'):navigate('/doctors/Neurologist')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='Neurologist'?"bg-indigo-50 text-black" : ""}`}>Neurologist</p>
          <p onClick={()=>{speciality=='Gastroenterologist'?navigate('/doctors'):navigate('/doctors/Gastroenterologist')}} className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality=='Gastroenterologist'?"bg-indigo-50 text-black" : ""}`}>Gastroenterologist</p>
        </div>
        <div className='w-full grid grid-cols-auto gap-4 gap-y-6' >
          {
            (filterDoc.length===0)? <div className='text-center  p-10 text-gray-900 font-bold text-3xl' >No Result Found</div>:
            filterDoc.map((item,index)=>(
              <div key={index} onClick={()=>{navigate(`/appointment/${item._id}`)}} className="border border-blue-200 rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-300 ">
                  <img className="bg-blue-50" src={item.image} alt="" />
                  <div className="p-4">
                      <div className="flex items-center gap-2 text-sm text-center">
                      <p className={`w-2 h-2 ${item.available?'bg-green-500':'bg-gray-500'}  rounded-full`}></p>
                      <p className={`${item.available?'text-green-600':'text-gray-600'}`} >{item.available?'Available':"Unavaiable"}</p>
                      </div>
                      <p className="text-gray-900 text-lg font-medium" >{item.name}</p>
                      <p className="text-gray-600 text-sm ">{item.speciality}</p>
                  </div>
              </div>
          ))
          }
        </div>
      </div>
    </div>
  )
}

export default Doctors