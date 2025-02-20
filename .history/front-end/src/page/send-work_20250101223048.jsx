import React,{useState} from "react";
import withAuthorization from "../components/with-authorization";
import SidebarClassroom from "../components/sidebar-classroom";

const Send_work = () => {
    const [sidebar,setSidebar] = useState(false)
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
            <div>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quae id magni debitis cum libero, impedit quam, alias in ullam voluptatem vitae molestias, laudantium maiores dolores? Sunt, odio. Velit, quibusdam vero?</div>
        </>
    )
}

export default Send_work;