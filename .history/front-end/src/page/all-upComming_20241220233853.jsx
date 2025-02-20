import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import {Navigate } from "react-router-dom";
import axios from "axios";
const All_upComming = ({isLogin}) => {
    const [assignment,setAssignment] = useState([])
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
    useEffect(()=>{
        upComming()
    },[])
    const formattedDate = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        return formatted;
    }
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
        <Assignments />  
        <div className="md:ml-32 ml-[6rem] md:py-5 py-2 bg-white">
            {assignment.map((data,i)=>(
                <div key={i} className=" border-2 rounded-lg mt-2 md:mx-12 mx-2 shadow py-4 cursor-pointer hover:bg-gray-100 text-sm" >
                    <div className="flex-col mx-4 my-1 grow">
                        <div>{data.title} </div>
                        <div className="text-gray-500">Due {formattedDate(data.due_time)}</div>
                    </div>
                </div>
            ))}
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