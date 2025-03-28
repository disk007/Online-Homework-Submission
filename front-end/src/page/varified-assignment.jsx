import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import CheckDetailAssignment from "../components/check-detail-assignment";
import { GiHamburgerMenu } from "react-icons/gi";
import { GoChecklist } from "react-icons/go";
import { IoChevronBackOutline } from "react-icons/io5";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { BsChatRightText } from "react-icons/bs";
import { FaRegUserCircle,FaFileAlt} from "react-icons/fa";
import { FaSortUp,FaSortDown  } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { useParams,useNavigate,useLocation} from "react-router-dom";
import axios from "axios";
import ModelFile from "../components/model-file";
import ModelEditAssignment from "../components/model-edit-assignment";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import ClipLoader from "react-spinners/ClipLoader";

const Detali_assignment = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const [sortOrder, setSortOrder] = useState('desc');
    const [openFeed, setOpenFeed] = useState({});
    const [openFile,setOpenFile] = useState(false)
    const [openEdit,setOpenEdit] = useState(false)
    const [Opendelete,setOpenDelete] = useState(false)
    const [selectFile,setSelectFile] = useState(null)
    const [dataExcel, setDataExcel] = useState([])
    const { assignmentId,classroomId } = useParams()
    const path = useLocation()
    
    const navigate = useNavigate();
    const [detailAssignments,setDetailAssignments] = useState([])
    const [assignmentType,setAssignmentType] = useState("")
    const [search,setSearch] = useState('')
    const [state, setState] = useState('')
    const [sideClass,SetSideClass] = useState('')
    const [loadPage,setLoadPage] = useState(false)
    const handleLinkToretrun = () =>{
        navigate(`/detail-classroom/detail-assignment/${classroomId}/${assignmentId}`);
    }
    const handleLinkRetruned = () =>{
        navigate(`/detail-classroom/verified-assignment/${classroomId}/${assignmentId}`);
    }
    useEffect(()=>{
        SetSideClass(path.pathname)
    },[path])

    const handleSelectFileWork = (file,type) => {
        const { blob, name } = file;
        setSelectFile({ url: blob, type: type, name: name });
    }
    const selectFileWork = async (n,workId,type,id) => {
        // setFileName(n)
        try {
            const encodedFileName = encodeURIComponent(n);
            // setFileName(pathFile)
            let response
            if(type === null){
                response = await axios.get(`/assignments/${assignmentId}/${workId}/${id}/${encodedFileName}`, { 
                    responseType: 'arraybuffer' // ต้องตั้ง responseType เพื่อให้สามารถตรวจสอบ Content-Type ได้
                });
            }
            else{
                response = await axios.get(`/assignments/${assignmentId}/${workId}/${id}/${encodedFileName}`, { 
                    responseType: 'arraybuffer' // ต้องตั้ง responseType เพื่อให้สามารถตรวจสอบ Content-Type ได้
                });
            }
            
        
            const mimeType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: mimeType });
            const blobWithName = { blob, name: n};
            handleSelectFileWork(blobWithName,mimeType)
          } catch (error) {
            console.error('Error fetching file:', error);
          }
    }
    const DetailAssignment = async () => {
        try {
            const response = await axios.get(`/verified-assignment/${assignmentId}`)
            const responseData = response.data
            setDetailAssignments(responseData.data)
            setAssignmentType(responseData.assignment_type)
        } catch (error) {
            console.log("Error "+error.message)
        }
    }
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
                    if (sortOrder === 'desc') {
                        return a.group_name.localeCompare(b.group_name);
                    } else {
                        return b.group_name.localeCompare(a.group_name);
                    }
                } else{
                    if (sortOrder === 'desc') {
                        return a.fname.localeCompare(b.fname);
                    } else {
                        return b.fname.localeCompare(a.fname);
                    }
                }
            }
            else if (state === 'state') {
                const valueA = a.is_submitted ? 1 : 0; // แปลง true/false เป็นตัวเลข
                const valueB = b.is_submitted ? 1 : 0;
                
                if (sortOrder === 'desc') {
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
            
                if (sortOrder === 'desc') {
                    return fileA.localeCompare(fileB);
                } else {
                    return fileB.localeCompare(fileA);
                }
            }
            else if(state === 'feedback') {
                const feedbackA = a.feedback || ''; // หาก feedback เป็น null ให้ใช้ค่า ''
                const feedbackB = b.feedback || ''; // หาก feedback เป็น null ให้ใช้ค่า ''
                
                if (sortOrder === 'desc') {
                    return feedbackA.localeCompare(feedbackB);
                } else {
                    return feedbackB.localeCompare(feedbackA);
                }
            }
            
        });
        setDetailAssignments(sortedData);
        setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    };
    
    const handleToggleFeedback = (id) => {
        setOpenFeed((prev) => ({
            ...prev,
            [id]: !prev[id], // สลับสถานะของ id นั้นๆ
        }));
    };
    const getScores = async () => {
        try {
            setLoadPage(true)
            const response = await axios.get(`/get-scores/${assignmentId}`)
            const responseData = response.data
            setDataExcel(responseData); 
            setLoadPage(false)

        } catch (error) {
            console.log("Error "+error.message)
        }
    }
    useEffect(()=>{
        getScores()
    },[])
    const handleDeleteAssignment = async() => {
        try {
            const data = new FormData()
            data.append('assignmentId',assignmentId)
            data.append('assignment_type',assignmentType)
            const response = await axios.post('/delete-assignment',data,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if (responseData.status ==='success') {
                navigate(`/detail-classroom/list-assignments/${classroomId}`)
            }
        } catch (error) {
            console.error(error);
        }
    }
    const handleExport = () => {
        // สร้าง Worksheet จากข้อมูล
        const header = [["Name", `Score = ${dataExcel[0].ascore!== '' ? dataExcel[0].ascore : 'N/A'}`]];

    // แปลงข้อมูลเป็นรูปแบบ Array of Arrays (AOA)
    const dataWithHeader = dataExcel.map(item => [
        item.name || "ไม่ระบุชื่อ",
        item.wscore !== null && item.wscore !== '' ? item.wscore : "N/A",
    ]);

    // เพิ่ม Header เข้าไปในข้อมูล
    const worksheetData = [...header, ...dataWithHeader];

    // สร้าง Worksheet จากข้อมูล
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    
        // สร้าง Workbook
        const workbook = XLSX.utils.book_new();
        worksheet["!cols"] = [{ wpx: 150 }, { wpx: 100 }];
        XLSX.utils.book_append_sheet(workbook, worksheet, dataExcel[0].title);
    
        // แปลง Workbook เป็นไฟล์ Excel
        const excelBuffer = XLSX.write(workbook, {
            bookType: "xlsx",
            type: "array",
        });
    
        // สร้าง Blob และดาวน์โหลดไฟล์
        const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
        saveAs(blob, `${dataExcel[0].title}.xlsx`);
    };
    
    return (
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
            <ModelEditAssignment assignmentId={assignmentId}  isLogin={isLogin} open={openEdit} OnClose={()=>setOpenEdit(false)} />
            { selectFile && 
                (
                    <ModelFile
                        open={openFile}
                        onClose={() => setOpenFile(false)}
                        file={selectFile?.url} // ใช้ URL ที่สร้างไว้
                        type={selectFile?.type}
                        download={selectFile?.name}
                    />
                )
            }
            <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><GoChecklist  className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Detail assignment</div>
                </div>
                {loadPage ? (
                    <div className="flex items-center justify-center pt-5">
                        <ClipLoader size={20} />
                    </div>
                        
                ):
                <>
                <div className="py-3 px-5 mt-2 flex flex-wrap items-center justify-center lg:justify-between md:text-base text-xs">
                    <div className="flex items-center flex-wrap justify-center space-x-4 mr-2">
                        <div className="flex items-center  hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={() => navigate(`/detail-classroom/list-assignments/${classroomId}`)}><IoChevronBackOutline className="h-7 w-7"/>Back</div>
                        <div className=" hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={()=>setOpenEdit(!false)}>Edit assignment </div>
                        <div className=" hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={()=>{setOpenDelete(!Opendelete)}}>Delete assignment </div>
                    </div>
                    <div className="flex items-center flex-wrap justify-center ml-2 md:mt-0 mt-2 space-x-4">
                        <div className="flex items-center hover:text-green-600 text-green-500 cursor-pointer transition ease-in-out delay-150" onClick={handleExport}><PiMicrosoftExcelLogoFill className="h-7 w-7 text-green-800"/>Export to Excel</div>
                    </div>
                </div>
                <div className="md:text-2xl text-base text-center md:text-left pt-2 px-6 mt-3">{detailAssignments[0]?.title}</div>
                <div className="text-gray-500 flex flex-wrap md:justify-start justify-center px-6 mb-5 md:text-base text-sm">
                    <div className="mr-2">{formattedDate(detailAssignments[0]?.due_time)}</div>
                    <div className="ml-2">{detailAssignments[0]?.colses_time ? 'Close : '+formattedDate(detailAssignments[0]?.colses_time):''}</div>
                </div>
                <hr />
                <div>
                    <div className="flex md:flex-row flex-col justify-center md:justify-between items-center px-6 py-2 ">
                        <div className="flex justify-center md:mb-0 mb-2">
                            <div className={`inline-block mr-3 cursor-pointer hover:font-bold ${sideClass.includes('detail-assignment')?'font-bold' :''}`} onClick={handleLinkToretrun}>
                                <div className="">To returns</div>
                                <div className={`${sideClass.includes('detail-assignment')? 'bg-sky-500 rounded':''} h-1 `}></div>
                            </div>
                            <div className={`inline-block mr-3 cursor-pointer hover:font-bold ${sideClass.includes('verified-assignment')?'font-bold' :''}`} onClick={handleLinkRetruned}>
                                <div className="">Returned</div>
                                <div className={`${sideClass.includes('verified-assignment')? 'bg-sky-500 rounded':''} h-1 `}></div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <input type="text" name="search" id="search" placeholder="Search by students" className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64" onChange={(e)=>setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                
                <div class="overflow-x-auto">
                    <table class="table-auto w-full border-collapse border-spacing-0">
                        <thead>
                        <tr class="border-t-2 border-b-2 text-sm">
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
                            <th class="px-4 py-2 text-center w-56">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Files</span>
                                </div>
                            </th>
                            <th class="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Feedback</span> 
                                </div>
                            </th>
                            {filteredAssignments[0]?.ascore !== '' && 
                                <th class="px-4 py-2 text-center w-28">
                                    <div className="flex items-center justify-center">
                                        <div className="mr-1">
                                        </div>
                                        <div>{filteredAssignments[0]?.ascore}</div>
                                    </div>
                                </th>
                            } 
                        </tr>
                        </thead>
                        <tbody className="text-xs">
                        {filteredAssignments.map((m,i) => (
                            <tr class="border-t-2 border-b-2 text-xs" key={i}>
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
                                    Returned
                                </div>
                            </td>
                            <td class="px-4 py-2 ">
                                <div className={`text-[10px] h-32 ${m.work !== null ? 'h-20 overflow-y-auto' : 'h-auto'}`}>
                                    {m.work === null && <div className="text-sky-600 text-center">None</div>}
                                    {m.work && JSON.parse(m.work).map((file) => (
                                        
                                        <div className="flex items-center justify-center mb-2 border-2" title={file}>
                                            <div className="px-2 py-2 flex flex-1 cursor-pointer" onClick={()=>{setOpenFile(!openFile);selectFileWork(file,m.id,m.assignment_type === 'group'?'group':null,m.assignment_type === 'group'? m.id_group : m.id_user)}}>
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
                                                <textarea name={m.id_group} id={m.id_group} className="border-2 text-black p-1" rows="5" cols="33"  value={m.feedback} disabled={true}/>
                                            ):
                                            (
                                                <textarea name={m.id_user} id={m.id_user} className="border-2 text-black p-1" rows="5" cols="33" value={m.feedback}  disabled={true}/>
                                            )}
                                            
                                        </div>
                                    ):(
                                        <BsChatRightText className="w-5 h-5"  onClick={() => handleToggleFeedback(m.id_user || m.id_group)} />
                                    )}
                                </div>
                            </td>
                            {filteredAssignments[0]?.ascore !== '' &&
                                <td className="px-4 py-2 text-center w-28 ">
                                    {assignmentType === 'group' ? (
                                        <div className="mr-1">
                                            <input type="text" name="" id="" 
                                                className="text-center w-8 border-2 font-normal text-sm"
                                                value={m.wscore}
                                                disabled={true}
                                            />
                                        </div>  
                                    ):
                                    (
                                        <div className="mr-1">
                                            <input type="text" name="" id="" 
                                                className="text-center w-8 border-2 font-normal text-sm"
                                                value={m.wscore}
                                                disabled={true}
                                            />
                                        </div>  
                                    )}
                                </td>
                            }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
                </>
                }
            </div>
            {
                Opendelete && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setOpenDelete(!Opendelete)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to delete assignment ?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setOpenDelete(!Opendelete)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handleDeleteAssignment}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default CheckDetailAssignment(Detali_assignment);