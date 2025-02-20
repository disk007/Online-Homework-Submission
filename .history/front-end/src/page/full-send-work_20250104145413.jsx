import React,{useState,useEffect} from "react";
import ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css';
import { FaBook,FaPlus,FaRegUser,FaFileAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { IoIosSend } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import '../css/react_quill.css'
import ModelFile from "../components/model-file";
import clipboard from "../picture/clipboard.jpg"
import { ToastContainer, toast,Slide } from 'react-toastify';
import axios from "axios";
import { LuCheck } from "react-icons/lu";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate,useParams } from 'react-router-dom';
import checkFullWorkAccess from "../components/check-full-work-access";

const Full_send_work = ({isLogin}) => {
    const { workId } = useParams()
    const [value, setValue] = useState('')
    const [fileNames,setFileNames] = useState([])
    const [errorComment,setErrorComment] = useState('')
    const [selectFile,setSelectFile] = useState(null)
    // const [sidebar,setSidebar] = useState(false)
    const [open,setOpen] = useState(false)
    const [mimeType,setMimeType] = useState(null)
    const [openFile,setOpenFile] = useState(false)
    // const [workId,setWorkId] = useState(null)
    const [work,setWork] = useState([])
    const [myWork,setMyWork] = useState([])
    const [errors,setErrors] = useState({})
    const [cancleWork,setCancleWork] = useState(false)
    const navigate = useNavigate();


    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    useEffect(() => {
        if (open) {
            document.body.classList.add('overflow-hidden');
        } else {
            document.body.classList.remove('overflow-hidden');
        }
    }, [open]);
    
    const handleDelete = (fileName) => {
        setFileNames(prevFileNames => prevFileNames.filter(file => file.name !== fileName))
    }
    
    const submitComment = (e) => {
        e.preventDefault()
        if(!value.trim()){
            setErrorComment('Comment is requiredเหมื่อนค่าว่างแต่ไม่แจ้งเตือน.')
        }
        else{
            setErrorComment('')
            setValue('')
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
    const fetchwork = async () => {
        try {
            const response = await axios.get(`/detail-work/${isLogin.id}`)
            const responseData = response.data
            setWork(responseData)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchwork()
    },[])
    const fetchMywork = async () => {
        try {
            const response = await axios.get(`/my-work/${isLogin.id}`)
            const responseData = response.data
            setMyWork(responseData)
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchMywork()
    },[])
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const existingFileNames = JSON.parse(myWork.filter(f => f.id === workId).map((data => data.work)))
        const newFiles = files.map((file) => {
            let fileName = file.name;
            let baseName = fileName;
            let extension = '';
            const dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > -1) {
                baseName = fileName.substring(0, dotIndex);
                extension = fileName.substring(dotIndex);
            }
            let count = 1;
            while (fileNames.some((f) => f.name === fileName) || existingFileNames.includes(fileName)) {
                fileName = `${baseName}(${count})${extension}`;
                count++;
            }
            const mimeType = file.type
            return {
                file,
                name: fileName,
                url: file, // สร้าง URL ที่นี่
                type:mimeType
            };
        });
    
        setFileNames((prevFiles) => [...prevFiles, ...newFiles]);
        e.target.value = '';
    };
    const handleSelectFile = (file,type) => {
        setSelectFile({url:file, type:type});
    }
    // const selectFileName = async (n,id_assignment) => {
    //     // setFileName(n)
    //     try {
    //         const encodedFileName = encodeURIComponent(n);
    //         const pathFile = `http://localhost:4444/assignments/${id_assignment}/${workId}/file/${encodedFileName}`
    //         // setFileName(pathFile)
    //         // const response = await axios.get(`/assignments/${id_assignment}/${workId}/file/${encodedFileName}`, { 
    //         //   responseType: 'arraybuffer' // ต้องตั้ง responseType เพื่อให้สามารถตรวจสอบ Content-Type ได้
    //         // });
        
    //         // const mimeType = response.headers['content-type'];
    //         // const blob = new Blob([response.data], { type: mimeType });
    //         // const objectURL = URL.createObjectURL(blob);
    //         // const fileContent = "Hello, world!";
    //         // const file = new Blob([fileContent], { type: "text/plain" });
    //         setFileName(new File([pathFile],n,{ type: "application/pdf" }));
    //         setMimeType("application/pdf")
    //       } catch (error) {
    //         console.error('Error fetching file:', error);
    //       }
    // }
    // console.log("setWorkId" +workId)
    const checkDate = (date,close) => {
        const dateObject = new Date(date);
        const closeObject = new Date(close);
        let compare = null
        if (dateObject < closeObject) {
            compare = true
        } else if (dateObject >= closeObject) {
            compare = false
        }
        return compare;
    }
    const sendWork =  async () => {
        let sizeFiles = 0
        const currentDate = new Date()
        currentDate.setSeconds(0,0)
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        const data  = new FormData()
        data.append('id_user',isLogin.id)
        data.append('id_work',workId)
        data.append('send_date',currentDate)
        let isValid = true
        let validation = {}
        if(fileNames.length > 0){
            fileNames.forEach((f,index)=>{
                data.append(`file[${index}]`,f.file)
                data.append(`fileName[${index}]`,f.name)
                sizeFiles += f.file.size
            })
        }
        else{
            data.append('fileName',null)
        }
        if(sizeFiles > MAX_FILE_SIZE){
            isValid = false
            validation.file = 'File size is too large. Maximum 10MB.'
        }
        if(isValid){
            try {
                setErrors({});
                const response = await axios.post('/send-work', data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                const responseData = response.data;
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
                    // handleCancle();
                    setFileNames([])
                    await fetchMywork()
                    // await fetchwork()
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
        else{
            setErrors(validation);
        }

    }
    const handleCancelWork = async () => {
        try {
            const data = new FormData()
            data.append('id_user',isLogin.id)
            data.append('id_work',workId)
            const response = await axios.post('/cancel-work',data,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                console.log(responseData.message)
                console.log("fileNames "+fileNames)
                await fetchMywork();
                
            }
            setCancleWork(!cancleWork)
        } catch (error) {
            console.log(error)
        }
        

    }
    const deleteFile = async (name,id_work,id_user,id_assignment) => {
        try {
            const data = new FormData()
            data.append('id_user',id_user)
            data.append('id_work',id_work)
            data.append('fileName',name)
            data.append('id_assignment',id_assignment)
            const response = await axios.post('/delete-work',data,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                await fetchMywork();
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        setFileNames([]);
    }, [workId]);
    return(
        <>
            <ToastContainer />
            {/* <SidebarActivity sidebar={sidebar} setSidebar={setSidebar} isLogin={isLogin} setWorkId={setWorkId} /> */}
            { selectFile && 
                (
                    <ModelFile
                        open={open}
                        onClose={() => setOpen(false)}
                        file={selectFile?.url} // ใช้ URL ที่สร้างไว้
                        type={selectFile?.type}
                    />
                )
            }
            
            <div className={`md:ml-32 ml-[6rem] `}>
                {workId ? (
                <>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                <div className="lg:mx-1 mx-0 block lg:hidden"><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaBook className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Assignments</div>
                </div>
                {work.filter(f => f.id == workId).map((data, i)=>(
                <div className={`py-5 px-8  flex xl:flex-row flex-col`} key={i}>
                    <div className="flex xl:flex-row flex-col xl:basis-3/4">
                        <div className="xl:basis-2/3">
                        <div className=" flex items-center hover:text-sky-600 text-gray-500 cursor-pointer mb-5" onClick={() => navigate(-1)}><IoChevronBackOutline className="h-7 w-7"/>Back</div>
                            <div className="lg:text-2xl text-xl">{data.title}</div>
                                <div className="text-sm text-gray-500">Due {formattedDate(data.due_time)}</div>
                                {data.colses_time ? <div className="text-sm text-gray-500">Closes {formattedDate(data.colses_time)}</div> :''}
                                <div className="mt-8 lg:text-sm text-xs">Instructions</div>
                                <div className="text-sm text-gray-500">{data.instructions !== '' ? data.instructions: 'None'}</div>

                                <div className="mt-8 lg:text-sm text-xs">Reference files</div>
                                <div className="mt-2">
                                    {data.reference_files ? (
                                    JSON.parse(data.reference_files).map((file) => (
                                    <div className="cursor-pointer text-sm border-[2px] rounded-sm flex w-[350px] items-center p-1 mb-2" title={file}>
                                        <FaFileAlt className="w-4 h-4 text-sky-500" />
                                        <div className="ml-2 ">{file.length > 30  ? file.substring(0, 25) + '...' : file}</div>
                                    </div>
                                    ))):
                                    <div className="text-sm text-gray-500">None</div>
                                    }
                                </div>
                        </div>
                        {myWork.filter(f => f.id == workId).map((data,i) => (
                            data.sent_date !== null && (
                            <div className="flex md:justify-center text-sm text-gray-500 xl:basis-1/3">
                                <div className="flex"><LuCheck className="w-5 h-5" /><div className="ml-1">{formattedDate(data.sent_date)}</div></div>
                            </div>
                            )
                        ))}
                        
                        
                    </div>
                        
                <div className={`xl:basis-1/4 xl:mt-0 mt-3 `}>
                {myWork.filter(f => f.id == workId).map((data,i) => (
                    <div className={`rounded-md p-2 px-5 shadow-md border-2 `} key={i}>
                        <div className="text-center lg:text-xl text-lg my-4">
                            My work
                        </div>
                            {fileNames.length > 0 && (
                                <div className="text-xs">
                                    {fileNames.map((f,index)=>(
                                        <>
                                        <div key={index} className="flex items-center mb-2 border-2" title={f.name}>
                                            <div className="px-2 py-2 flex flex-1 cursor-pointer" onClick={()=>{setOpen(!open); handleSelectFile(f.url,f.type)}}>
                                                <div className=""><FaFileAlt className="w-4 h-4" /></div>
                                                <div className="">
                                                    <span className="pl-1">{f.name.length > 30 ? f.name.substring(0, 25) + "..." : f.name}</span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex">
                                                <button className="pr-1" onClick={() => handleDelete(f.name)}><RxCross2 className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        </>
                                    ))}
                                </div>
                            )}
                            <div className="text-xs">
                            {data.work && JSON.parse(data.work).map((file) => (
                                
                                <div className="flex items-center mb-2 border-2" title={file}>
                                    <div className="px-2 py-2 flex flex-1 cursor-pointer" >
                                        <div className=""><FaFileAlt className="w-4 h-4" /></div>
                                        <div className="">
                                            <span className="pl-1">{file.length > 30 ? file.substring(0, 25) + "..." : file}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="flex">
                                        {data.is_submitted === false ?
                                        <button className="pr-1" onClick={()=>deleteFile(file,workId,isLogin.id,data.id_assignment)}><RxCross2 className="w-4 h-4" /></button>
                                        : null}
                                    </div>
                                </div>
                            ))}
                            </div>
                        <div className={`${errors.file && "text-red-500 text-xs"} `}>{errors.file}</div>
                            <div className="mb-4 flex items-center">
                                <input type="file" className="hidden" id="file" multiple onChange={handleFileChange} accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/png,image/jpeg"/>
                                <label htmlFor="file" className={`${data.colses_time && checkDate(data.due_time,data.colses_time) === false || data.is_submitted === true ? 'bg-gray-200 text-gray-500 pointer-events-none' : ' bg-white text-sky-500 hover:text-sky-600 hover:bg-gray-100'} md:text-base text-sm inline-block py-2 w-full rounded flex items-center justify-center cursor-pointer transition ease-in-out delay-150 text-base border-2 `}><FaPlus /><span>Add file</span></label>
                            </div>
                            <div className="mb-4">
                                {data.is_submitted === true ? (
                                    <button className={`${data.colses_time && checkDate(data.due_time,data.colses_time) === false ? 'bg-gray-200 ' : 'bg-sky-500 hover:bg-sky-600 text-white'}md:text-base text-sm  w-full rounded p-2 flex items-center justify-center transition ease-in-out delay-150 border-2`}  onClick={()=>setCancleWork(!cancleWork)}>
                                        <span className={` ${data.colses_time && checkDate(data.due_time,data.colses_time) === false ? 'text-gray-500' : 'text-white'}`}>
                                            Cancel submission
                                        </span>
                                    </button>
                                ): (
                                    <button className={`${data.colses_time && checkDate(data.due_time,data.colses_time) === false ? 'bg-gray-200 pointer-events-none' : 'bg-sky-500 hover:bg-sky-600 text-white'}md:text-base text-sm  w-full rounded p-2 flex items-center justify-center transition ease-in-out delay-150 border-2`} onClick={sendWork}>
                                        <IoIosSend className={` ${data.colses_time && checkDate(data.due_time,data.colses_time) === false ? 'text-gray-500' : 'text-white'}`} />
                                        <span className={` ${data.colses_time && checkDate(data.due_time,data.colses_time) === false ? 'text-gray-500' : 'text-white'}`}>
                                            Send
                                        </span>
                                    </button>
                                )}
                            </div>
                        
                        
                    </div>
                ))}
                
                    <div className={` rounded-md p-2 px-5 shadow-md mt-12 lg:text-base text-sm border-2`}>
                        <div className="my-4 flex items-center justify-center ">
                            <FaRegUser /><span className="pl-1">personal opinion</span>
                        </div>
                        <form onSubmit={submitComment}>
                            <div className="my-4 flex justify-center flex-col items-center">
                                <div className="w-full">
                                    <ReactQuill 
                                            theme="snow" 
                                            value={value} 
                                            onChange={setValue} 
                                            modules={modules} 
                                            placeholder="Add a personal opinion"
                                            
                                        />
                                    {errorComment && <div className="text-sm text-red-500 text-center">{errorComment}</div>} 
                                </div>
                                <div className="w-full mt-3"><button className="w-full hover:bg-sky-600 text-white bg-sky-500 py-1 transition ease-in-out delay-150 rounded">Post</button></div>
                            </div>    
                        </form>
                        
                    </div>
                </div>

                </div>
                ))}
                </>
                ): (
                    <>  
                        <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                        <div className="lg:mx-1 mx-0 block lg:hidden"><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                            <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaBook className="h-5 w-5 text-white"/></div></div>
                            <div className="px-1">Assignments</div>
                        </div>
                        <div className="flex justify-center mt-8"><img className="w-32 md:w-48" src={clipboard} alt="" /></div>
                        <div className="text-sm text-center text-gray-500">Please select an activity</div>
                       
                    </>
                        
                )}
            </div>
            {
                cancleWork && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setCancleWork(!cancleWork)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to cancel the submission?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setCancleWork(!cancleWork)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handleCancelWork}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default checkFullWorkAccess(Full_send_work);