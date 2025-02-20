import React,{useState} from "react";
import Work_sheet from "../components/work-sheet";
import {Navigate } from "react-router-dom";
import SidebarActivity from "../components/sidebar-activity";

const Activity = ({isLogin}) =>{
    const [sidebar,setSidebar] = useState(false)
    const [workId,setWorkId] = useState(null)
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            {/* <Navbar />
            <Sidebar /> */}
            <SidebarActivity sidebar={sidebar} setSidebar={setSidebar} isLogin={isLogin} setWorkId={setWorkId} />
            {isLogin.role === 'student' && 
                <Work_sheet isLogin={isLogin} workId={workId} sidebar={sidebar} setSidebar={setSidebar} />
            }
            
            
        </>
    )
}

export default Activity;