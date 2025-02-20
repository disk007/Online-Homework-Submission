import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import Assignments from "../components/assignments";
import supplies from '../picture/Supplies.jpg'
import CreateAssignments from "../components/create-assignments";
import {Navigate,useNavigate,useParams } from "react-router-dom";
import { FaCheck } from "react-icons/fa6";
import withAuthorization from "../components/with-authorization";
import axios from "axios";
const Completed = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const { classroomId } = useParams()
    const [assignment,setAssignment] = useState([])
    const shownMonths = new Set();
    const navigate = useNavigate()
    const handleLinkClick = (workId) =>{
        navigate(`/send-work/${workId}/${isLogin.id}`);
    }
    const upComming = async () => {
        try{
            const response = await axios.get(`/completed/${isLogin.id}/${classroomId}`)
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
    if(isLogin === null){
        return <Navigate to="/login" />;
    }
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
            <Assignments sidebar={sidebar} setSidebar={setSidebar} />
            <div className={`flex justify-center ml-[6rem] md:ml-[8rem] lg:ml-[26rem] md:py-5 py-2 bg-white items-center flex-col ${sidebar ? 'opacity-10 pointer-events-none' : ''}`}>
                {assignment.length > 0 ? (
                assignment.map((data, index) => {
                    const showHeader = shouldShowYearMonth(data.due_time); // เช็คว่าแสดงหัวข้อเดือนและปีนี้หรือไม่
                    return (
                        <div className="w-full mb-5" key={index}>
                            {showHeader && (
                                    <div className={`mx-5 mb-3 ${index > 0 && 'mt-5'}`}>
                                        {formattedYearMonth(data.due_time)}
                                    </div>
                            )}
                            <div className="flex justify-center items-start border-2 py-2 px-4 mx-5 rounded-md shadow cursor-pointer hover:bg-gray-100" onClick={()=>handleLinkClick(data.id)}>
                                <div className="bg-fuchsia-500 text-white p-2 flex items-center justify-center w-8 h-8 rounded-md text-sm mr-3">
                                    {extractFirstChars(data.name)}
                                </div>
                                <div className="flex flex-col grow">
                                    <div>{data.title}</div>
                                    <div className="text-gray-500 text-sm">Submitted {formattedTime(data.sent_date)}</div>
                                    <div className="text-gray-500 text-sm">{data.name}</div>
                                </div>
                                <div className="flex justify-center bg-green-100 md:p-2 p-1 items-center">
                                    <FaCheck className="md:h-4 md:w-4 text-green-500 hidden md:block" />
                                    <div className="md:text-sm text-xs text-green-600">Complete</div>
                                </div>
                            </div>
                        </div>
                    );
                })):
                (
                    <>
                        <div className="w-32 md:w-48"><img src={supplies} alt="" /></div>
                        <div className="mt-1 text-xs md:text-base">No completed assignments right now.</div>
                    </>
                )}
                
            </div>
            
        </>
    )
}

export default withAuthorization(Completed)