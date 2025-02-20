import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import CheckDetailAssignment from "../components/check-detail-assignment";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { FaCheck } from "react-icons/fa6";
import { AiOutlineStop } from "react-icons/ai";
import { BsChatRightText } from "react-icons/bs";
import { FaRegUserCircle,FaFileAlt} from "react-icons/fa";
import { FaSortUp,FaSortDown  } from "react-icons/fa6";
import { useParams,useNavigate} from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast,Slide } from 'react-toastify';

const Detali_assignment = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const [sortOrder, setSortOrder] = useState('desc');
    const [openFeed, setOpenFeed] = useState({});
    const { assignmentId } = useParams()
    const navigate = useNavigate();
    const [detailAssignments,setDetailAssignments] = useState([])
    const [assignmentType,setAssignmentType] = useState("")
    const [search,setSearch] = useState('')
    const [state, setState] = useState('')
    const [selectedId,setSelectedId] = useState([])
    const [isChecked, setIsChecked] = useState(false)
    const [feedbackData, setFeedbackData] = useState({});

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
    const handleSelectStudent = (id) => {
        if (selectedId.includes(id)) {
            setSelectedId(selectedId.filter(studentId => studentId !== id))
        } 
        else {
            setSelectedId([...selectedId, id])
        }
    }
    const handleSelectAll = () => {
        if (isChecked) {
            setSelectedId([]);
        } else {
            setSelectedId(filteredAssignments.map(student => assignmentType === 'group'? student.id_group : student.id_user))
        }
        setIsChecked(!isChecked)
    }
    // const columns = [
    //     {
    //         name: (
    //             <div className="flex">
    //                 <input type="checkbox" className="transform scale-150 mx-2" /> Name
    //             </div>
    //         ),
    //         selector: row => row.name,
    //         center: true
    //     },
    //     {
    //         name: 'Status',
    //         selector: row => row.status,
    //         center: true
    //     },
    //     {
    //         name: 'Files',
    //         selector: row => row.file,
    //         center: true,
    //     },
    //     {
    //         name: 'Feedback',
    //         selector: row => row.feedback,
    //         center: true
    //     },
        
    // ];

    // const data = detailAssignments.map((m,i) => (
    //     {
    //         name: (
    //             <div className="my-2">
    //                 <div className="flex">
                        
    //                     <div className="">
    //                         <div className="py-1 flex items-center justify-center">
    //                             <input type="checkbox" className="transform scale-150 mx-2" />
    //                                 { assignmentType === 'group' ? <span className="font-bold">{m.group_name}</span> : m.fname +' '+m.lname}
    //                         </div>
                            
    //                         { assignmentType === 'group' && 
    //                             m.group_members.split(',').map((g,key) => (
    //                             <div key={key} className="flex items-center justify-center my-2"><FaRegUserCircle className="w-4 h-4" /><div className="ml-1">{g}</div></div>
    //                         ))
    //                         } 
    //                     </div>
                        
    //                 </div>
    //             </div>
                
    //         ),
    //         status: (
    //             <div className="flex items-center text-sky-600">
    //                 {m.is_submitted == true  && 
    //                 <><FaCheck className="mr-2" /> Turned in</>
    //                 }
    //                 {m.is_submitted == false  && 
    //                 <>
    //                     <AiOutlineStop className="mr-2" /> Turned out
    //                 </>
    //                 }
    //             </div>
    //         ),
    //         feedback: (
    //             <div className="flex items-center text-sky-600 feedback cursor-pointer">
    //                 {openFeed ? (
    //                     <div className="flex items-center py-2">
    //                         <textarea name="" id="" className="border-2 text-black p-1" rows="5" cols="33"></textarea>
    //                     </div>
    //                 ):(
    //                     <BsChatRightText className="w-5 h-5"  onClick={()=>setOpenFeed(!openFeed)} />
    //                 )}
    //             </div>
                
    //         ),
    //         file:(
    //             <div className="text-xs w-full">
    //                 {m.work === null && <div className="text-sky-600">None</div>}
    //                 {m.work && JSON.parse(m.work).map((file) => (
                        
    //                     <div className="flex items-center mb-2 border-2 w-44" title={file}>
    //                         <div className="px-2 py-2 flex flex-1 cursor-pointer" >
    //                             <div className=""><FaFileAlt className="w-4 h-4" /></div>
    //                             <div className="">
    //                                 <span className="pl-1">{file.length > 30 ? file.substring(0, 25) + "..." : file}</span>
    //                             </div>
    //                         </div>
                            
    //                         {/* <div className="flex">
    //                             {data.is_submitted === false ?
    //                             <button className="pr-1" onClick={()=>deleteFile(file,workId,isLogin.id,data.id_assignment)}><RxCross2 className="w-4 h-4" /></button>
    //                             : null}
    //                         </div> */}
    //                     </div>
    //                 ))}
    //             </div>
    //         ),
    //     }
    // ))

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
    const filteredAssignments = detailAssignments.filter((assignment) => {
        if (assignmentType === "group") {
          return assignment.group_name.
          toLowerCase().includes(search.toLowerCase())
        } else {
          return (
            assignment.fname.toLowerCase().includes(search.toLowerCase()) 
          );
        }
      });
      useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".feedback")) {
                setOpenFeed({}); // ปิด feedback ทั้งหมด
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    

    const sortData = (state) => {
        setState(state)
        const sortedData = [...detailAssignments].sort((a, b) => {
            if(state === 'name'){
                if (assignmentType === 'group') {
                    if (sortOrder === 'asc') {
                        return a.group_name.localeCompare(b.group_name);
                    } else {
                        return b.group_name.localeCompare(a.group_name);
                    }
                } else{
                    if (sortOrder === 'asc') {
                        return a.fname.localeCompare(b.fname);
                    } else {
                        return b.fname.localeCompare(a.fname);
                    }
                }
            }
            else if (state === 'state') {
                const valueA = a.is_submitted ? 1 : 0; // แปลง true/false เป็นตัวเลข
                const valueB = b.is_submitted ? 1 : 0;
                
                if (sortOrder === 'asc') {
                    return valueA - valueB; // เรียงจาก false (0) ไป true (1)
                } else {
                    return valueB - valueA; // เรียงจาก true (1) ไป false (0)
                }
            }
            else if(state === 'file'){
                const parseWork = (work) => {
                    try {
                        const files = JSON.parse(work); // แปลง JSON string เป็น array
                        return Array.isArray(files) && files.length > 0 ? files[0] : ''; // ใช้ไฟล์แรกใน array
                    } catch {
                        return ''; // กรณี work ไม่สามารถแปลงเป็น JSON ได้
                    }
                };
                const fileA = parseWork(a.work);
                const fileB = parseWork(b.work);
            
                if (sortOrder === 'asc') {
                    return fileA.localeCompare(fileB);
                } else {
                    return fileB.localeCompare(fileA);
                }
            }
            else if(state === 'feedback') {
                const feedbackA = a.feedback || ''; // หาก feedback เป็น null ให้ใช้ค่า ''
                const feedbackB = b.feedback || ''; // หาก feedback เป็น null ให้ใช้ค่า ''
                
                if (sortOrder === 'asc') {
                    return feedbackA.localeCompare(feedbackB);
                } else {
                    return feedbackB.localeCompare(feedbackA);
                }
            }
            
        });
        setDetailAssignments(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    const handleFeedbackChange = (id,value) => {
        setFilteredAssignments((prevAssignments) =>
            prevAssignments.map((assignment) =>
                assignment.id_group === id
                    ? { ...assignment, feedback: value } // อัปเดต feedback ของรายการที่มี id ตรงกัน
                    : assignment
            )
        );
    }
    const handleFeedback = async() => {
        try {
            const formdata = new FormData()
            formdata.append('feedback', JSON.stringify(feedbackData))
            formdata.append('id',JSON.stringify(selectedId))
            formdata.append('id_work',filteredAssignments[0]?.id || '')
            formdata.append('assignment_type',assignmentType)
            const response = await axios.post('/update-feedback', formdata, {
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if (responseData.status === 'success') {
                toast.success(responseData.message, {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                });
            }
        } catch (error) {
            console.error('Error submitting assignment:', error);
            toast.error("An error occurred while submitting the assignment. Please try again.", {
                position: "bottom-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
                transition: Slide,
            });
        }
        
    }
    const handleToggleFeedback = (id) => {
        setOpenFeed((prev) => ({
            ...prev,
            [id]: !prev[id], // สลับสถานะของ id นั้นๆ
        }));
    };
    
    return (
        <>
            <ToastContainer />
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
                        <button 
                            className={`cursor-pointer text-white px-5 py-2 rounded transition ease-in-out delay-150 ${
                                selectedId.length === 0 ? 'bg-gray-300 ' : 'bg-sky-500 hover:bg-sky-600'
                            }`}
                            disabled={selectedId.length === 0} // Disable เมื่อไม่มีการเลือก
                            onClick={handleFeedback}
                        >
                            Return {selectedId.length === 0 ? '': `(${selectedId.length})`}
                        </button>
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
                    <input type="text" name="search" id="search" placeholder="Search by students" className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64" onChange={(e)=>setSearch(e.target.value)} />
                </div>
                <div class="overflow-x-auto">
                    <table class="table-fixed w-full border-collapse border-spacing-0">
                        <thead>
                        <tr class="border-t-2 border-b-2 text-sm">
                            <th class="py-2 text-center w-10 ">
                                <input type="checkbox" 
                                    className="transform scale-150 mx-2"
                                    checked={selectedId.length === filteredAssignments.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th class="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Name</span> <div className="flex cursor-pointer " onClick={()=>{sortData('name')}}>{state ==='name' && sortOrder === 'asc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                            <th class="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">State</span> <div className="flex cursor-pointer" onClick={()=>{sortData('state')}}>{state ==='state' && sortOrder === 'asc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                            <th class="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Files</span> <div className="flex cursor-pointer" onClick={()=>{sortData('file')}}>{state ==='file' && sortOrder === 'asc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                            <th class="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Feedback</span> <div className="flex cursor-pointer" onClick={()=>{sortData('feedback')}}>{state ==='feedback' && sortOrder === 'asc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="text-xs">
                        {filteredAssignments.map((m,i) => (
                            <tr class="border-t-2 border-b-2 text-xs" key={i}>
                            <td class="py-2 text-center w-10">
                                {assignmentType === 'group' ? (
                                    <>
                                    <input type="checkbox"
                                        name={m.id_group} 
                                        className="transform scale-150 mx-2"
                                        checked={selectedId.includes(m.id_group)}
                                        onChange={() => handleSelectStudent(m.id_group)} 
                                    />
                                    </>
                                ):
                                (
                                    <input type="checkbox"
                                        name={m.id_user} 
                                        className="transform scale-150 mx-2"
                                        checked={selectedId.includes(m.id_user)}
                                        onChange={() => handleSelectStudent(m.id_user)} 
                                    />
                                )
                                }
                                
                            </td>
                            <td class="px-4 py-2 text-center">
                            <div className="flex items-center justify-center">
                                <div className="">
                                    <div className="py-1 flex items-center justify-center">
                                            { assignmentType === 'group' ? <span className="font-bold">{m.group_name}</span> : <span>{m.fname +' '+m.lname}</span>}
                                    </div>
                                    { assignmentType === 'group' && 
                                    m.group_members.split(',').map((g,key) => (
                                        <div key={key} className="flex items-center justify-center my-2"><FaRegUserCircle className="w-4 h-4" /><div className="mx-1">{g}</div></div>
                                    ))
                                    } 
                                </div>
                            </div>
                            </td>
                            <td class="px-4 py-2 ">
                                <div className="flex items-center justify-center text-sky-600">
                                    {m.is_submitted == true  && 
                                    <><FaCheck className="mr-2" /> Turned in</>
                                    }
                                    {m.is_submitted == false  && 
                                    <>
                                        <AiOutlineStop className="mr-2" /> Turned out
                                    </>
                                    }
                                </div>
                            </td>
                            <td class="px-4 py-2 ">
                                <div className="text-xs w-full">
                                    {m.work === null && <div className="text-sky-600 text-center">None</div>}
                                    {m.work && JSON.parse(m.work).map((file) => (
                                        
                                        <div className="flex items-center justify-center mb-2 border-2 " title={file}>
                                            <div className="px-2 py-2 flex flex-1 cursor-pointer" >
                                                <div className=""><FaFileAlt className="w-4 h-4" /></div>
                                                <div className="">
                                                    <span className="pl-1">{file.length > 30 ? file.substring(0, 25) + "..." : file}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td class="px-4 py-2 overflow-x-auto">
                                <div className="flex items-center justify-center text-sky-600 feedback cursor-pointer">
                                {openFeed[m.id_user || m.id_group] ? (
                                        <div className="flex items-center py-2">
                                            {assignmentType === 'group' ? (
                                                <textarea name={m.id_group} id={m.id_group} className="border-2 text-black p-1" rows="5" cols="33" onChange={(e) => handleFeedbackChange(m.id_group, e.target.value)} value={feedbackData.feedback} />
                                            ):
                                            (
                                                <textarea name={m.id_user} id={m.id_user} className="border-2 text-black p-1" rows="5" cols="33" onChange={(e) => handleFeedbackChange(m.id_user, e.target.value)} value={feedbackData.feedback} />
                                            )}
                                            
                                        </div>
                                    ):(
                                        <BsChatRightText className="w-5 h-5"  onClick={() => handleToggleFeedback(m.id_user || m.id_group)} />
                                    )}
                                </div>
                            </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                    {/* <DataTable
                        columns={columns}
                        data={data}
                        
                    /> */}
                {/* <hr /> */}

                
            </div>
        </>
    )
}

export default CheckDetailAssignment(Detali_assignment);