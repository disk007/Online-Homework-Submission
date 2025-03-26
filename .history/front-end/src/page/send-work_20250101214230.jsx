import React,{useState} from "react";
import withAuthorization from "../components/with-authorization";
import SidebarClassroom from "../components/sidebar-classroom";

const Send_work = () => {
    const [sidebar,setSidebar] = useState(false)
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
        </>
    )
}

export default withAuthorization(Send_work);