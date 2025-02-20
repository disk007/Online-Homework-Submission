import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import withAuthorization from "../components/with-authorization";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineStop } from "react-icons/ai";
import { BsChatRightText } from "react-icons/bs";
import DataTable from 'react-data-table-component';
import { FaRegUserCircle } from "react-icons/fa";
import { useParams,useNavigate} from "react-router-dom";
import axios from "axios";

const Detali_assignment = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const [openFeed,setOpenFeed] = useState(false)
    const { assignmentId } = useParams()
    const navigate = useNavigate();
    const [detailAssignments,setDetailAssignments] = useState([])
    const [assignmentType,setAssignmentType] = useState("")

    const DetailAssignment = async () => {
        try {
            const response = await axios.get(`/detail-assignment/${assignmentId}`)
            const responseData = response.data
            setDetailAssignments(responseData.data)
            setAssignmentType(responseData.assignment_type)
        } catch (error) {
            console.log("Error "+error.message)
        }
    }
    const columns = [
        {
            name: (
                <div className="flex">
                    <input type="checkbox" className="transform scale-150 mx-2" /> Name
                </div>
            ),
            selector: row => row.name,
            // center: true
        },
        {
            name: 'Status',
            selector: row => row.status,
            center: true
        },
        {
            name: 'Feedback',
            selector: row => row.feedback,
            right: true
        },
    ];

    const data = detailAssignments.map((m,i) => (
        {
            name: (
                <div className="my-2">
                    <div className="flex items-start">
                        <div className="py-1">
                            <input type="checkbox" className="transform scale-150 mx-2" />
                        </div>
                        
                        <div>
                            <div>
                                { assignmentType === 'group' ? m.groupname : m.fname +' '+m.lname}
                            </div>
                            { assignmentType === 'group' && 
                                m.group_members.split(',').map((g,key) => (
                                <div key={key} className="">{g}</div>
                            ))
                            } 
                        </div>
                        
                    </div>
                </div>
                
            ),
            status: (
                <div className="flex items-center text-sky-600">
                    {m.is_submitted == true  && 
                    <><FaCheck className="mr-2" /> Turned in</>
                    }
                    {m.is_submitted == false  && 
                    <>
                        <AiOutlineStop className="mr-2" /> Turned out
                    </>
                    }
                </div>
            ),
            feedback: (
                <div className="flex items-center text-sky-600 feedback cursor-pointer">
                    {openFeed ? (
                        <div className="flex items-center py-2">
                            <textarea name="" id="" className="border-2 text-black p-1" rows="5" cols="33"></textarea>
                        </div>
                    ):(
                        <BsChatRightText className="w-5 h-5"  onClick={()=>setOpenFeed(!openFeed)} />
                    )}
                </div>
                
            ),
        }
    ))
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
    useEffect(()=>{
        DetailAssignment()
    },[])
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".feedback") && openFeed ){
                setOpenFeed(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[openFeed])
    return (
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
            <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><GoChecklist  className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Detail assignment</div>
                </div>
                <div className="py-3 px-5 mt-2 flex flex-wrap items-center justify-center">
                    <div className="flex items-center md:grow">
                        <div className="flex items-center  hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={() => navigate(-1)}><IoChevronBackOutline className="h-7 w-7"/>Back</div>
                        <div className=" mx-5 hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150">Edit assignment </div>
                    </div>
                    <div className="flex items-center md:mt-0 mt-1">
                        <div className="flex items-center hover:text-green-600 text-green-500 cursor-pointer transition ease-in-out delay-150"><PiMicrosoftExcelLogoFill className="h-7 w-7 text-green-800"/>Export to Excel</div>
                        <div className="ml-5 ">
                            <button className=" bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded transition ease-in-out delay-150">Return</button>
                        </div>
                    </div>
                </div>
                <div className="text-2xl  pt-2 px-6 mt-3">{detailAssignments[0]?.title}</div>
                <div className="text-gray-500 flex px-6 mb-5">
                    <div className="mr-2">{formattedDate(detailAssignments[0]?.due_time)}</div>
                    <div className="ml-2">{detailAssignments[0]?.colses_time ? 'Close : '+formattedDate(detailAssignments[0]?.colses_time):''}</div>
                </div>
                <hr />
                <div className="py-2 px-6 flex justify-center md:justify-end">
                    <input type="text" name="search" id="search" placeholder="Search by students" className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64" />
                </div>
                <hr  />
                    <DataTable
                        columns={columns}
                        data={data}
                        conditionalRowStyles={conditionalRowStyles}
                    />
                    
                <hr />
            </div>
        </>
    )
}

export default withAuthorization(Detali_assignment);