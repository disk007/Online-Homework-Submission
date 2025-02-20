import React,{useState} from "react";
import Assignments from "../components/assignments";
import SidebarClassroom from "../components/sidebar-classroom";
import supplies from '../picture/Supplies.jpg'
import {Navigate,useParams } from "react-router-dom";
import withAuthorization from "../components/with-authorization";
const UpComming = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const { classroomId } = useParams()
    const [assignment,setAssignment] = useState([])
    const listAssignments = async() => {
        try {
            const response = await axios.get(`/list-assignments/${classroomId}`)
            const responseData = response.data
            setAssignment(responseData)
        } catch (error) {
            console.log("Error "+error.message)
        }
        

    }
    useEffect(() => {
        listAssignments()
    },[assignment])
    if(isLogin === null){
        return <Navigate to="/login" />;
    }
    return(
        <>
        <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
        <Assignments sidebar={sidebar} setSidebar={setSidebar} />
        <div className={`flex justify-center ml-[6rem] md:ml-[8rem] lg:ml-[26rem] md:py-5 py-2 bg-white items-center flex-col ${sidebar ? 'opacity-10 pointer-events-none' : ''}`}>
            {assignment.map((data,i)=>(
                <div key={i} className="flex border-2 rounded mt-5 lg:mx-18 md:mx-10 mx-8 shadow py-2 items-center cursor-pointer hover:bg-gray-100 text-sm" >
                    <div className="flex-col mx-4 my-1 grow">
                        <div>{data.title} </div>
                        <div className="text-gray-500">Due {formattedDate(data.due_time)}</div>
                    </div>
                    <div className="mx-4 text-gray-500">{data.true_count+' / '+data.false_count }  turned in</div>
                </div>
            ))}
            <div className="w-32 md:w-48"><img src={supplies} alt="" /></div>
            <div className="mt-1 text-xs md:text-base">No Upcomming assignments right now.</div>
        </div>
            
        </>
    )
}

export default withAuthorization(UpComming)