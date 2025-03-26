import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import {Navigate } from "react-router-dom";
import axios from "axios";
const All_past_due = ({isLogin}) => {
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <Assignments />
            <div className="flex justify-center md:ml-32 ml-[6rem] md:py-5 py-2 bg-white items-center flex-col">
                <div className="w-48 md:w-72"><img src={supplies} alt="" /></div>
                <div className="mt-1 text-xs md:text-base">No past due assignments right now.</div>
            </div>
            
        </>
    )
}

export default All_past_due