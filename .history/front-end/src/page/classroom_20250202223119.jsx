import React from "react";
import Room from "../components/room";
import {Navigate } from "react-router-dom";
import {RoomProvider} from "../components/fetchRoom";
import ModelJoin from "../components/model-join";
const Classroom = ({isLogin}) =>{
    
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <RoomProvider userId={isLogin.id} role={isLogin.role}>
                <Room data={isLogin} />
                <ModelJoin />
            </RoomProvider>
            
        </>
    )
}

export default Classroom