import React,{useEffect, useState} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import CreateAssignments from "../components/create-assignments";
import withAuthorization from "../components/with-authorization";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { useParams,useNavigate } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import axios from '../components/axios-instance';
const List_assignments = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const [loadPage,setLoadPage] = useState(false)
    const { classroomId } = useParams()
    const navigate = useNavigate()
    const [assignment,setAssignment] = useState([])
    const handleLinkClick = (classroomId,id) =>{
        navigate(`/detail-classroom/detail-assignment/${classroomId}/${id}`);
    }
    const listAssignments = async() => {
        try {
            setLoadPage(true)
            const response = await axios.get(`/list-assignments/${classroomId}`)
            const responseData = response.data
            setAssignment(responseData)
            setLoadPage(false)
        } catch (error) {
            console.log("Error "+error.message)
        }
        

    }
    useEffect(() => {
        listAssignments()
    },[])
    const formattedDate = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
            timeZone: 'Asia/Bangkok'
        });
        return formatted;
    }
    return(
        <>
        <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
        <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
            <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><GoChecklist  className="h-5 w-5 text-white"/></div></div>
                <div className="px-1">List assignments</div>
            </div>
            {loadPage ? (
                <div className="flex items-center justify-center pt-5">
                    <ClipLoader size={20} />
                </div>
                    
            ): 
            assignment.map((data,i)=>(
                <div key={i} className="flex flex-wrap border-2 rounded mt-5 lg:mx-18 md:mx-10 mx-8 shadow py-2 items-center cursor-pointer hover:bg-gray-100 text-sm" onClick={()=>handleLinkClick(classroomId,data.id_assignment)}>
                    <div className="flex-col mx-4 my-1 grow">
                        <div>{data.title} </div>
                        <div className="text-gray-500 md:text-sm text-xs">Due {formattedDate(data.due_time)}</div>
                    </div>
                    <div className="mx-4 text-gray-500 md:text-sm text-xs">{data.true_count+' / '+data.all_count }  turned in</div>
                </div>
            ))}
            
            <CreateAssignments isLogin={isLogin} listAssignments={listAssignments} />
        </div>
        </>
    )
}

export default withAuthorization(List_assignments);