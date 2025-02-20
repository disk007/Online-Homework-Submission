import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import SidebarClassroom from "../components/sidebar-classroom";
import supplies from '../picture/Supplies.jpg'
import CreateAssignments from "../components/create-assignments";
import {Navigate,useParams } from "react-router-dom";
import withAuthorization from "../components/with-authorization";
import axios from "axios";
const Past_due = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const { classroomId } = useParams()
    const [assignment,setAssignment] = useState([])
    const shownMonths = new Set();
    const upComming = async () => {
        try{
            const response = await axios.get(`/past-due/${isLogin.id}/${classroomId}`)
            const responseData = response.data
            setAssignment(responseData)
        }
        catch (error) {
            console.log("Error "+error.message)
        }
    }
    useEffect(()=>{
        upComming()
    },[])
    if(isLogin === null){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
            <Assignments sidebar={sidebar} setSidebar={setSidebar} />
            <div className={`flex justify-center ml-[6rem] md:ml-[8rem] lg:ml-[26rem] md:py-5 py-2 bg-white items-center flex-col ${sidebar ? 'opacity-10 pointer-events-none' : ''}`}>
                {assignment.length === 0 && (
                    
                )}
                <div className="w-32 md:w-48"><img src={supplies} alt="" /></div>
                <div className="mt-1 text-xs md:text-base">No past due assignments right now.</div>
                
            </div>
            
        </>
    )
}

export default withAuthorization(Past_due)