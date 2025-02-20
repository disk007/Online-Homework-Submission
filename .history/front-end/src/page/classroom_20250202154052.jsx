import React from "react";
import Room from "../components/room";
import {Navigate } from "react-router-dom";
import {RoomProvider} from "../components/fetchRoom";
const Classroom = ({isLogin}) =>{
    
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <RoomProvider userId={isLogin.id} role={isLogin.role}>
                <Room data={isLogin} />
            </RoomProvider>
            
        </>
    )
}

export default Classroom