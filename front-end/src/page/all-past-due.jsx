import React,{useState,useEffect} from "react";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import {Navigate,useNavigate } from "react-router-dom";
import axios from "axios";
import { AiOutlineStop } from "react-icons/ai";
import ClipLoader from "react-spinners/ClipLoader";
const All_past_due = ({isLogin}) => {
    const [assignment,setAssignment] = useState([])
    const [loadPage,setLoadPage] = useState(false)
    const navigate = useNavigate()
    const handleLinkClick = (workId) =>{
        navigate(`/assignments/send-work/${workId}`);
    }
    const shownMonths = new Set();
    const upComming = async () => {
        try{
            setLoadPage(true)
            const response = await axios.get(`/all-past-due/${isLogin.id}`)
            const responseData = response.data
            setAssignment(responseData)
            setLoadPage(false)
        }
        catch (error) {
            console.log("Error "+error.message)
        }
    }
    useEffect(()=>{
        upComming()
    },[])
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
            {loadPage ?(
                <div className="md:ml-32 ml-[6rem] flex justify-center items-center fixed inset-0">
                    <ClipLoader color="#1D7AE5"  size={50} />
                </div>
            )
            :
            <div className="flex justify-center md:ml-32 ml-[6rem] md:py-5 py-2 bg-white items-center flex-col">
                {assignment.map((data,index) => {
                    const showHeader = shouldShowYearMonth(data.due_time);
                    return(
                    <div className="w-full mb-5" key={index}>
                        {showHeader && (
                            <div className={`mx-5 mb-3 ${index > 0 && 'mt-5'}`}>
                                {formattedYearMonth(data.due_time)}
                            </div>
                        )}
                        <div className="flex justifly-center items-start border-2 py-2 px-4 mx-5 rounded-md shadow cursor-pointer hover:bg-gray-100" onClick={()=>handleLinkClick(data.id)}>
                            <div className="bg-fuchsia-500 text-white p-2 flex items-center justify-center w-8 h-8 rounded-md text-sm mr-3">{extractFirstChars(data.name)}</div>
                            <div className="flex flex-col grow">
                                <div>{data.title}</div>
                                {data.colses_time === null && (
                                    <div className={`${new Date() > new Date(data.due_time) ? 'text-red-500 ': 'text-gray-500'} text-sm`}>Due at {formattedTime(data.due_time)}</div>
                                )}
                                
                                <div className="text-gray-500 text-sm">{data.name}</div>
                            </div>
                            {data.colses_time !== null && new Date() > new Date(data.colses_time) && (
                                <div className="flex justifly-center bg-gray-100 md:p-2 p-1 items-center">
                                    <AiOutlineStop className="md:h-4 md:w-4 text-gray-500 hidden md:block" />
                                    <div className="md:text-sm text-xs text-gray-600">Not Submitted</div>
                                </div>
                            )}
                        </div>
                    </div>
                    )
                })}
                {assignment.length == 0 && (
                    <div className="flex justify-center items-center flex-col">
                        <div className="w-48 md:w-72"><img src={supplies} alt="" /></div>
                        <div className="mt-1 text-xs md:text-base">No past due assignments right now.</div>
                    </div>
                )}
            </div>
            }
            
        </>
    )
}

export default All_past_due