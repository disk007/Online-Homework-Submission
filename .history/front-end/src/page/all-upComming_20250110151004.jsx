import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import {Navigate,useNavigate } from "react-router-dom";
import axios from "axios";
const All_upComming = ({isLogin}) => {
    const [assignment,setAssignment] = useState([])
    const shownMonths = new Set();
    const navigate = useNavigate()
    const handleLinkClick = (workId) =>{
        navigate(`/assignments/send-work/${workId}`);
    }
    const upComming = async () => {
        try{
            const response = await axios.get(`/all-up-comming/${isLogin.id}`)
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
    const formattedTime = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hourCycle: 'h23',
        });
        return formatted;
    }
    const formattedYearMonth = (date) => {
        const formatted = new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        return formatted;
    }
    const shouldShowYearMonth = (date) => {
        const currentYearMonth = formattedYearMonth(date);
        const showHeader = !shownMonths.has(currentYearMonth); // เช็คว่าแสดงเดือนและปีนี้ไปแล้วหรือยัง

        if (showHeader) {
            shownMonths.add(currentYearMonth); // ถ้ายังไม่เคยแสดง, เก็บเดือนและปีนี้
        }

        return showHeader; // คืนค่าว่าจะแสดงเดือนและปีนี้หรือไม่
    };
    const extractFirstChars = (name) => {
        let firstEncounter = true;
        return name.split(/[\s.,-/]+/).map((part, index) => {
          if (index > 0 && !firstEncounter) {
            return ''; // ถ้าเจอครั้งที่ 2 ไม่ต้องแสดง
          } else if (index > 0) {
            firstEncounter = false; // หลังจากเจอครั้งแรกให้หยุดแสดงครั้งถัดไป
          }
          return part[0]; // แสดงตัวอักษรตัวแรกของแต่ละคำที่เจอ
        }).join('');
    }
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    return(
        <>
        <Assignments /> 
        <div className="md:ml-32 ml-[6rem] md:py-2 py-2 bg-white">
            {assignment.map((data,index)=>{
                const showHeader = shouldShowYearMonth(data.due_time)
                return(
                <div className="w-full mb-8" key={index}>
                    {showHeader && (
                        <div className={`mx-5 mb-3 ${index > 0 && 'mt-5'}`}>
                            {formattedYearMonth(data.due_time)}
                        </div>
                    )}
                    <div className="flex justifly-center items-start border-2 py-2 px-4 mx-5 rounded-md shadow cursor-pointer hover:bg-gray-100" onClick={()=>handleLinkClick(data.id)}>
                        <div className="bg-fuchsia-500 text-white p-2 flex items-center justify-center w-8 h-8 rounded-md text-sm mr-3">{extractFirstChars(data.name)}</div>
                        <div className="flex flex-col grow">
                            <div>{data.title}</div>
                            <div className="text-gray-500 text-sm">Due at {formattedTime(data.due_time)}</div>
                            <div className="text-gray-500 text-sm">{data.name}</div>
                        </div>
                    </div>
                </div>
                )
            })}
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