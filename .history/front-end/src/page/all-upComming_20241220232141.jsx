import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import {Navigate } from "react-router-dom";
import axios from "axios";
const All_upComming = ({isLogin}) => {
    const [assignment,setAssignment] = useState([])
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    const upComming = async () => {
        try{
            const response = await axios.get(`/up-comming/${isLogin.id}`)
            const responseData = response.data
            setAssignment(responseData)
        }
        catch (error) {
            console.log("Error "+error.message)
        }
    }
    return(
        <>
        <Assignments />  
        <div className="md:ml-32 ml-[6rem] md:py-5 py-2 bg-white">
            {assignment.length == 0 && (
                <div className="flex justify-center items-center flex-col">
                    <div className="w-48 md:w-72"><img src={supplies} alt="" /></div>
                    <div className="mt-1 text-xs md:text-base">No upcomming assignments right now.</div>
                </div>
            )}
            
        </div>
            
        </>
    )
}

export default All_upComming