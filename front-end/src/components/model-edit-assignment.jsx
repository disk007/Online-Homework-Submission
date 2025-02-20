import React,{useState,useEffect} from "react";
import IndividualStudent from "./individualStudent";
import GroupStudents from "./Group-students";
import ModelFile from "./model-file";
import { RxCross2 } from "react-icons/rx";
import { GoChecklist } from "react-icons/go";
import { MdOutlineFileUpload } from "react-icons/md";
import {FaFileAlt,FaUserPlus } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
import { ToastContainer, toast,Slide } from 'react-toastify';
import axios from "axios";
import Flatpickr from "react-flatpickr";
import { Link,useLocation,useParams,useNavigate } from "react-router-dom";
import "../../node_modules/flatpickr/dist/themes/dark.css";
import ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css';


const ModelEditAssignment = ({assignmentId,isLogin,open,OnClose}) => {
    const {classroomId} = useParams()
    const [formData,setFormData] = useState({
        title: '',
        instructions: '',
        score: '',
        name: '',
        assignment_type:'',
        dueDate: null,
        dueTime:null,
        dateClose: null,
        timeClose: null,
    })
    const navigate = useNavigate();
    const [dataAssignment,setDataAssignment] = useState({})
    const [totalSizeFiles,setTotalSizeFiles] = useState(0)
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    const [errors,setErrors] = useState({})
    const [fileNames,setFileNames] = useState([])
    const [selectFile,setSelectFile] = useState(null)
    const [openFile,setOpenFile] = useState(false)
    const [isChecked, setIsChecked] = useState(false)

    const fetchdataAssignment = async() => {
        try {
            const response = await axios.get(`/data-assignment/${assignmentId}`)
            const responseData = response.data
            setDataAssignment({...responseData})
            if(responseData.colses_time !== null){
                setIsChecked(true)
            }
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() =>{
        fetchdataAssignment()
    },[])
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map((file) => {
            let fileName = file.name;
            let baseName = fileName;
            let extension = '';
            // const existingFileNames = dataAssignment.some(f => f.id == dataAssignment.id && f.reference_files !== null)
            // ? JSON.parse(dataAssignment.find(f => f.id == reference_files.id).reference_files)
            // : [];
            const existingFileNames = dataAssignment.reference_files ? JSON.parse(dataAssignment.reference_files) :[]
            const dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > -1) {
                baseName = fileName.substring(0, dotIndex);
                extension = fileName.substring(dotIndex);
            }
            let count = 1;
            while (fileNames.some((f) => f.name === fileName) || existingFileNames.some((f) => f === fileName)) {
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
    const handleDelete = (fileName) => {
        setFileNames(prevFileNames => prevFileNames.filter(file => file.name !== fileName))
    }
    const handleCancle = async() =>{
        setFileNames([])
        await fetchdataAssignment()
        setErrors({})
        OnClose()

    }
    const handleCloseTimee = (e) => {
        setIsChecked(e.target.checked)
    }
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
        setDataAssignment({...dataAssignment,[e.target.name]:e.target.value})
    }
    const deleteFile = async (name,id_work) => {
        try {
            const data = new FormData()
            data.append('id_work',id_work)
            data.append('fileName',name)
            data.append('id_assignment',assignmentId)
            const response = await axios.post('/delete-sheet',data,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                await fetchdataAssignment()
                await fetchSizesFile()
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleQuillChange = (value) => {
        if (formData.instructions !== value) {
            const sanitizedContent = value === "<p><br></p>" ? "" : value;
            setFormData({
                ...formData,
                instructions: sanitizedContent,
            });
            setDataAssignment({...dataAssignment,instructions: sanitizedContent})
        }
    };
    const selectFileName = async (n,workId) => {
        // setFileName(n)
        try {
            const encodedFileName = encodeURIComponent(n);
            // setFileName(pathFile)
            const response = await axios.get(`/assignments/${assignmentId}/${workId}/file/${encodedFileName}`, { 
              responseType: 'arraybuffer'
            });
        
            const mimeType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: mimeType });
            const blobWithName = { blob, name: n};
            handleSelectFileWork(blobWithName,mimeType)
          } catch (error) {
            console.error('Error fetching file:', error);
          }
    }
    const handleSelectFileWork = (file,type) => {
        const { blob, name } = file;
        setSelectFile({ url: blob, type: type, name: name });
    }
    const handleEditAssignment = async (e) => {
        e.preventDefault()
        const checkDate = new Date()
        const dueDate = new Date(dataAssignment.due_time)
        const dueTime = new Date(dataAssignment.due_time)
        let sizeFiles = totalSizeFiles
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        
        let isValid = true
        let validation = {}

        if(!dataAssignment.title.trim()){
            isValid = false
            validation.title = 'Title is required.'
        }
        if (dataAssignment.score !== '' && !/^[0-9]+$/.test(dataAssignment.score)) {
            isValid = false;
            validation.score = "Points must be a positive number.";
        }
        if(formData.dueDate !== null){
            if (
                checkDate.getFullYear() > dueDate.getFullYear() || // ปีปัจจุบัน > ปีที่กำหนด
                (checkDate.getFullYear() === dueDate.getFullYear() && checkDate.getMonth() > dueDate.getMonth()) || // ปีเดียวกัน แต่เดือนปัจจุบัน > เดือนที่กำหนด
                (checkDate.getFullYear() === dueDate.getFullYear() && checkDate.getMonth() === dueDate.getMonth() && checkDate.getDate() > dueDate.getDate()) // ปีและเดือนเดียวกัน แต่วันที่ปัจจุบัน > วันที่ที่กำหนด
            ) 
            {
                isValid = false;
                validation.dueDate = "Due date must not be before the current date.";
            }
            
            if(dueTime <= new Date()){
                isValid = false;
                validation.dueTime = 'Due time must not be before the current time.'
            }
        }
        if(isChecked){
            const timeClose = new Date(dataAssignment.colses_time)
            const dateClose = new Date(dataAssignment.colses_time)
            if (
                dueDate.getFullYear() > dateClose.getFullYear() || // ปีปัจจุบัน > ปีที่กำหนด
                (dueDate.getFullYear() === dateClose.getFullYear() && dueDate.getMonth() > dateClose.getMonth()) || // ปีเดียวกัน แต่เดือนปัจจุบัน > เดือนที่กำหนด
                (dueDate.getFullYear() === dateClose.getFullYear() && dueDate.getMonth() === dateClose.getMonth() && dueDate.getDate() > dateClose.getDate()) // ปีและเดือนเดียวกัน แต่วันที่ปัจจุบัน > วันที่ที่กำหนด
            ){
                isValid = false;
                validation.dateClose = "Close date must not be before the due date.";
            }
            if(timeClose < dueTime){
                isValid = false;
                validation.timeClose = 'Close time must not be before the due time.'
            }

        }
        const data = new FormData()
        data.append('title',dataAssignment.title)
        data.append('instructions',dataAssignment.instructions)
        data.append('score',dataAssignment.score)
        data.append('due_time',dataAssignment.due_time)
        data.append('colses_time',dataAssignment.colses_time)
        data.append('assignmentId',assignmentId)
        data.append('workId',dataAssignment.id)
        if(fileNames.length > 0){
            fileNames.forEach((f,index)=>{
                data.append(`file[${index}]`,f.file)
                data.append(`fileName[${index}]`,f.name)
                sizeFiles += f.file.size
            })
        }
        if(sizeFiles > MAX_FILE_SIZE){
            isValid = false
            validation.file = 'File size is too large. Maximum 10MB.'
        }

        if (isValid) {
            try {
                setErrors({});
                const response = await axios.post('/update-assignment', data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
    
                const responseData = response.data;
                if (responseData.status === 'success') {
                    navigate(`/detail-classroom/list-assignments/${classroomId}`)
                }
            } catch (error) {
                console.error('Error submitting assignment:', error);
            }
        } else {
            setErrors(validation);
        }
    }
    const fetchSizesFile = async() => {
        try {
            if(dataAssignment.id){
                const response = await axios.get(`/size-files-assignments/${assignmentId}/${dataAssignment.id}`)
                const responseData = response.data
                setTotalSizeFiles(responseData.size)
            }
            
            
        } catch (error) {
            console.error(error)
            
        }
    }
    console.log("dataAssignment.length",dataAssignment.id)
    useEffect(()=>{
        fetchSizesFile()
    },[dataAssignment.id])
    return(
        <>
            {/* <ToastContainer /> */}
            { selectFile && 
            (
                <ModelFile
                    open={openFile}
                    onClose={() => setOpenFile(false)}
                    file={selectFile?.url} // ใช้ URL ที่สร้างไว้
                    type={selectFile?.type}
                />
            )
            }
            
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
                <div className="bg-white rounded-md w-[600px] max-h-screen overflow-y-auto ">
                    {/* <form> */}
                    <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                        <div className="flex items-center"><GoChecklist /><div className="ml-1">Assignment</div></div>
                        <div onClick={handleCancle} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="mb-3">
                            <div>Title :</div>
                            <input type="text" className="border-2 w-full py-2 px-2 mt-1" name="title" value={dataAssignment?.title}  onChange={handleChange} />
                            <div className={`${errors.title && "text-red-500 text-xs"} `}>{errors.title}</div>
                        </div>
                        <div >
                            <div>Instructions :</div>
                            <ReactQuill 
                                theme="snow" 
                                value={dataAssignment?.instructions} 
                                onChange={handleQuillChange} 
                                modules={modules} 
                                placeholder="Add a personal opinion"
                                name="instructions"
                                    
                            />
                            {/* <input type="text" className="border-2 w-full py-2 px-2 mt-1" name="instructions" value={formData.instructions} onChange={handleChange} /> */}
                            <div className=" inline-block p-1 hover:bg-gray-200 mt-2">
                                <input type="file" className="hidden" id="file" multiple onChange={handleFileChange} accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/png,image/jpeg"  />
                                <label htmlFor="file" className="cursor-pointer flex items-center"><MdOutlineFileUpload className="w-6 h-6" /><div className="ml-1">Upload files</div></label>
                            </div>
                            <div className="mt-2 ">
                                {fileNames.length > 0 && (
                                    <div className="flex flex-wrap text-xs">
                                        {fileNames.map((f, index) => (
                                            <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f.name}>
                                                <button
                                                    className="px-2 py-2 flex flex-1"
                                                    onClick={() => {setOpenFile(!openFile); handleSelectFile(f.url,f.type)}}
                                                >
                                                    <div>
                                                        <FaFileAlt className="w-4 h-4" />
                                                    </div>
                                                    <div>
                                                        <span className="pl-1">
                                                            {f.name.length > 20 ? f.name.substring(0, 20) + "..." : f.name}
                                                        </span>
                                                    </div>
                                                </button>
                                                <div className="flex">
                                                    <button className="pr-1" onClick={() => handleDelete(f.name)}>
                                                        <RxCross2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                )}
                            </div>
                            {dataAssignment.reference_files && (
                                <div className="flex flex-wrap text-xs">
                                    {JSON.parse(dataAssignment.reference_files).map((f, index) => (
                                        <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f}>
                                            <button
                                                className="px-2 py-2 flex flex-1"
                                                onClick={() => {setOpenFile(!openFile); selectFileName(f,dataAssignment.id)}}
                                            >
                                                <div>
                                                    <FaFileAlt className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <span className="pl-1">
                                                    {f.length > 20  ? f.substring(0, 20) + '...' : f}
                                                    </span>
                                                </div>
                                            </button>
                                            <div className="flex">
                                                <button className="pr-1" onClick={() => deleteFile(f,dataAssignment.id)}>
                                                    <RxCross2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                                
                            <div className={`${errors.file && "text-red-500 text-xs"} `}>{errors.file}</div>
                        </div>
                        <div>
                            <div className="mt-2 mb-3">
                                <div>Group study </div>
                                <div className="w-full relative">
                                    <div className="border-2 py-2 px-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between toggle-study">
                                    <div>{dataAssignment.name}</div>
                                        <SiGoogleclassroom/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-end">
                            <div className="w-full mr-1">
                                <div>Points : </div>
                                <input
                                type="text"
                                className="border-2 w-full py-2 px-2 mt-1"
                                name="score"
                                placeholder="No points"
                                value={dataAssignment?.score}
                                onChange={handleChange}
                                />
                                <div className={`h-2 ${errors.score && "text-red-500 text-xs"} `}>{errors.score}</div>
                            </div>
                            <div className={`w-full ml-2 relative `}>
                                <div className="border-2 py-2 px-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between toggle-type-work" >{dataAssignment.assignment_type}<FaUserPlus/></div>
                                 <div className={`h-2`}></div>
                            </div>
                           
                        </div>

                        <div className="mb-3 mt-3 flex">
                            <div className="w-full mr-1">
                                <div>Due date:</div>
                                <Flatpickr
                                    value={new Date(dataAssignment.due_time)}
                                    name="DueDate"
                                    className="border-2 w-full py-2 px-2 mt-1"
                                    onChange={(selectedDates) => {
                                        setFormData({ ...formData, dueDate: selectedDates[0] });
                                        setDataAssignment({...dataAssignment, due_time: selectedDates[0]})
                                    }}
                                    options={{
                                        enableTime: false,
                                        dateFormat: "d-m-Y",
                                    }}           

                                />
                                <div className={`${errors.dueDate && "text-red-500 text-xs"} `}>{errors.dueDate}</div>
                            </div>
                            
                            <div className="w-full ml-1">
                                <div>Due time:</div>
                                <Flatpickr
                                    value={new Date(dataAssignment.due_time)}
                                    className="border-2 w-full py-2 px-2 mt-1"
                                    onChange={(selectedDates) => {
                                        setFormData({ ...formData, dueDate: selectedDates[0] });
                                        setDataAssignment({...dataAssignment, due_time: selectedDates[0]})
                                    }}
                                    options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                    }}
                                    step='any'  
                                             

                                />
                                <div className={`${errors.dueTime && "text-red-500 text-xs"} `}>{errors.dueTime}</div>
                            </div>
                            
                        </div>
                        <div className="mb-3">
                            <div className="flex items-center"><input type="checkbox" name="" id="closeDate" className="w-4 h-4" checked={isChecked} onChange={handleCloseTimee} /><label className="ml-1" htmlFor="closeDate">Close time</label></div>
                            <div className={`flex ${isChecked ?'text-black': 'text-gray-400'}`}>
                                <div className="w-full mr-1">
                                    <div>Close date:</div>
                                    <Flatpickr
                                        value={dataAssignment.colses_time ? new Date(dataAssignment.colses_time):null}
                                        className={`border-2 w-full py-2 px-2 mt-1 `}
                                        onChange={(selectedDates) => {
                                            setDataAssignment({...dataAssignment, colses_time: selectedDates[0]})
                                        }}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-m-Y",
                                        }}
                                        disabled={!isChecked}           

                                    />
                                    <div className={`${errors.dateClose && "text-red-500 text-xs"} `}>{errors.dateClose}</div>
                                </div>
                                <div className="w-full ml-1">
                                    <div>Close time:</div>
                                    <Flatpickr
                                        value={dataAssignment.colses_time ? new Date(dataAssignment.colses_time):null}
                                        className="border-2 w-full py-2 px-2 mt-1"
                                        onChange={(selectedDates)=>{
                                            setDataAssignment({...dataAssignment, colses_time: selectedDates[0]})
                                        }}
                                        options={{
                                            enableTime: true,
                                            noCalendar: true,
                                            dateFormat: "H:i",
                                            time_24hr: true,
                                        }}
                                        disabled={!isChecked}            
                                        
                                    />
                                    <div className={`${errors.timeClose && "text-red-500 text-xs"} `}>{errors.timeClose}</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <div className="mr-2"><div className="border-2 py-2 px-8 w-full mt-3 text-gray-400 hover:text-gray-500 mr-2 transition ease-in-out delay-150 cursor-pointer" onClick={handleCancle}>Cancel</div></div>
                            <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150" onClick={handleEditAssignment}>Create</button></div>
                            
                        </div>
                    </div>
                    {/* </form> */}
                </div>
            </div>
        </>
    )
}

export default ModelEditAssignment;