import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import SidebarClassroom from "../components/sidebar-classroom";
import supplies from '../picture/Supplies.jpg'
import {Navigate,useParams } from "react-router-dom";
import withAuthorization from "../components/with-authorization";
import axios from "axios";
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
    const formattedDate = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        return formatted;
    }
    if(isLogin === null){
        return <Navigate to="/login" />;
    }
    return(
        <>
        <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
        <Assignments sidebar={sidebar} setSidebar={setSidebar} />
        <div className={`flex mb-4 md:py-5 py-2 bg-white  ${sidebar ? 'opacity-10 pointer-events-none' : ''}`}>
            {assignment.map((data,i)=>(
                <div key={i} className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4 cursor-pointer hover:bg-gray-100 text-sm" >
                    <div className="flex-col mx-4 my-1 grow">
                        <div>{data.title} </div>
                        <div className="text-gray-500">Due {formattedDate(data.due_time)}</div>
                    </div>
                </div>
            ))}
            {assignment.length == 0 && (
                <>
                <div className="flex justify-center items-center flex-col">
                    <div className="w-32 md:w-48"><img src={supplies} alt="" /></div>
                    <div className="mt-1 text-xs md:text-base">No Upcomming assignments right now.</div>
                </div>
                
                </>
            )}
            
        </div>
            
        </>
    )
}

export default withAuthorization(UpComming)