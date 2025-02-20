import React,{useState} from "react";
import withAuthorization from "../components/with-authorization";
import SidebarClassroom from "../components/sidebar-classroom";
import { useParams,useNavigate } from "react-router-dom";
import Work_sheet from "../components/work-sheet";

const Send_work = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const { workId } = useParams()
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
            <Work_sheet isLogin={isLogin} workId={workId} sidebar={sidebar} setSidebar={setSidebar} />
        </>
    )
}

export default withAuthorization(Send_work);