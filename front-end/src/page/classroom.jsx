import React,{useState} from "react";
import Room from "../components/room";
import {Navigate } from "react-router-dom";
import {RoomProvider} from "../components/fetchRoom";
import ModelJoin from "../components/model-join";
const Classroom = ({isLogin}) =>{
    console.log('isLogin',isLogin)
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <Room data={isLogin}  />
            
        </>
    )
}

export default Classroom