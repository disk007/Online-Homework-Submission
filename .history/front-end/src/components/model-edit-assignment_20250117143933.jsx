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
import { Link,useLocation,useParams } from "react-router-dom";
import "../../node_modules/flatpickr/dist/themes/dark.css";
import ReactQuill from 'react-quill';
import '../../node_modules/react-quill/dist/quill.snow.css';


const ModelEditAssignment = ({assignmentId,isLogin,open,OnClose}) => {
    const [formData,setFormData] = useState({
        title: '',
        instructions: '',
        points: '',
        name: '',
        // dueDate: new Date(),
        // dueTime:new Date(),
        // dateClose: new Date(),
        // timeClose: new Date(),
        // typeWork:'All students',
        // members:[]
    })
    const [dataAssignment,setDataAssignment] = useState({})
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
        } catch (error) {
            console.log(error)
        }
    }
    console.log('formData.colses_time'+formData.title,assignmentId)
    useEffect(() =>{
        fetchdataAssignment()
    },[])
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
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
            while (fileNames.some((f) => f.name === fileName)) {
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
    const handleCancle = () =>{
        setFileNames([])
        // setOpenWork(false)
        // setTypeWork(null)
        // setSelectStudy([selectStudy[0]])
        // setDataGroup([])
        // setDataIndividual([])
        // setSaveSelectedStudents([]) // ของ individuals
        // setSelectedStudents([]) // ของ individuals
        // setStateGroup(!stateGroup)
        // setErrors({})
        // setIsChecked(false)
        // setFormData((prev)=>({
        //     ...prev,
        //     title: '',
        //     instructions: '',
        //     points: '',
        //     dueDate: new Date(),
        //     dueTime: new Date(),
        //     dateClose: new Date(),
        //     timeClose: new Date(),
        //     typeWork:'All students',
        //     members:[]
        // }))
        
        OnClose()

    }
    const handleCloseTimee = (e) => {
        setIsChecked(e.target.checked)
    }
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const handleQuillChange = (value) => {
        setFormData({
            ...formData,
            instructions: value, // อัปเดตเฉพาะ instructions
        });
    };
    // const handleAssignment = async (e) => {
    //     e.preventDefault()
    //     const dueDate = new Date(formData.dueDate);
    //     const checkDate = new Date()
    //     const dueTime = new Date(formData.dueDate);
    //     const hours = formData.dueTime.getHours()
    //     const minutes = formData.dueTime.getMinutes()
    //     dueTime.setHours(hours, minutes,0,0)

    //     const timeClose = new Date(formData.dateClose)
    //     const hoursClose = formData.timeClose.getHours()
    //     const minutesClose = formData.timeClose.getMinutes()
    //     timeClose.setHours(hoursClose, minutesClose,0,0)
    //     const dateClose = new Date(formData.dateClose)
    //     let sizeFiles = 0
    //     const MAX_FILE_SIZE = 10 * 1024 * 1024;
        
    //     let isValid = true
    //     let validation = {}

    //     if(!formData.title.trim()){
    //         isValid = false
    //         validation.title = 'Title is required.'
    //     }
    //     if (formData.points !== '' && !/^[0-9]+$/.test(formData.points)) {
    //         isValid = false;
    //         validation.points = "Points must be a positive number.";
    //     }
    //     if (
    //         checkDate.getFullYear() > dueDate.getFullYear() || // ปีปัจจุบัน > ปีที่กำหนด
    //         (checkDate.getFullYear() === dueDate.getFullYear() && checkDate.getMonth() > dueDate.getMonth()) || // ปีเดียวกัน แต่เดือนปัจจุบัน > เดือนที่กำหนด
    //         (checkDate.getFullYear() === dueDate.getFullYear() && checkDate.getMonth() === dueDate.getMonth() && checkDate.getDate() > dueDate.getDate()) // ปีและเดือนเดียวกัน แต่วันที่ปัจจุบัน > วันที่ที่กำหนด
    //     ) 
    //     {
    //         isValid = false;
    //         validation.dueDate = "Due date must not be before the current date.";
    //     }
    //     if(dueTime <= new Date()){
    //         isValid = false;
    //         validation.dueTime = 'Due time must not be before the current time.'
    //     }
    //     if(isChecked){
    //         if (
    //             dueDate.getFullYear() > dateClose.getFullYear() || // ปีปัจจุบัน > ปีที่กำหนด
    //             (dueDate.getFullYear() === dateClose.getFullYear() && dueDate.getMonth() > dateClose.getMonth()) || // ปีเดียวกัน แต่เดือนปัจจุบัน > เดือนที่กำหนด
    //             (dueDate.getFullYear() === dateClose.getFullYear() && dueDate.getMonth() === dateClose.getMonth() && dueDate.getDate() > dateClose.getDate()) // ปีและเดือนเดียวกัน แต่วันที่ปัจจุบัน > วันที่ที่กำหนด
    //         ){
    //             isValid = false;
    //             validation.dateClose = "Close date must not be before the due date.";
    //         }
    //         if(timeClose < dueTime){
    //             isValid = false;
    //             validation.timeClose = 'Close time must not be before the due time.'
    //         }

    //     }
    //     if(typeWork.includes('students') && !typeWork.includes('All students') && dataIndividual.length === 0){
    //         isValid = false;
    //         validation.typeWork = 'Individual must have at least one.'
    //     }
    //     else if(typeWork.includes('groups') && dataGroup.length === 0){
    //         isValid = false;
    //         validation.typeWork = 'Group must have at least one'
    //     }
    //     const data = new FormData()
    //     data.append('title', formData.title); 
    //     data.append('instructions', formData.instructions);
    //     data.append('points', formData.points);
    //     data.append('dueDate', formData.dueDate);
    //     data.append('dueTime', formData.dueTime);
    //     data.append('idClassroom', selectStudy);
    //     data.append('typeWork', typeWork.includes('students') && !typeWork.includes('All students')
    //         ? 'Individual students'
    //         : typeWork.includes('groups')
    //         ?'groups'
    //         :'All students'

    //     )
    //     data.append('members', typeWork.includes('students') && !typeWork.includes('All students')
    //         ? dataIndividual
    //         : typeWork.includes('groups')
    //         ? JSON.stringify(dataGroup)
    //         : []
    //     )
    //     data.append('dateClose', isChecked ? formData.dateClose : '')
    //     data.append('timeClose', isChecked ? formData.timeClose : '')
    //     if(fileNames.length > 0){
    //         fileNames.forEach((f,index)=>{
    //             data.append(`file[${index}]`,f.file)
    //             data.append(`fileName[${index}]`,f.name)
    //             sizeFiles += f.file.size
    //         })
    //     }
    //     if(sizeFiles > MAX_FILE_SIZE){
    //         isValid = false
    //         validation.file = 'File size is too large. Maximum 10MB.'
    //     }

    //     if (isValid) {
    //         try {
    //             setErrors({});
    //             const response = await axios.post('/add-assignment', data, {
    //                 headers: {
    //                     "Content-Type": "multipart/form-data",
    //                 },
    //             });
    
    //             const responseData = response.data;
    //             if (responseData.status === 'success') {
    //                 toast.success(responseData.message, {
    //                     position: "bottom-right",
    //                     autoClose: 2000,
    //                     hideProgressBar: false,
    //                     closeOnClick: true,
    //                     pauseOnHover: true,
    //                     draggable: true,
    //                     progress: undefined,
    //                     theme: "light",
    //                     transition: Slide,
    //                 });
    //                 handleCancle();
    //             }
    //         } catch (error) {
    //             console.error('Error submitting assignment:', error);
    //             toast.error("An error occurred while submitting the assignment. Please try again.", {
    //                 position: "bottom-right",
    //                 autoClose: 3000,
    //                 hideProgressBar: false,
    //                 closeOnClick: true,
    //                 pauseOnHover: true,
    //                 draggable: true,
    //                 progress: undefined,
    //                 theme: "light",
    //                 transition: Slide,
    //             });
    //         }
    //     } else {
    //         setErrors(validation);
    //     }
    // }
    return(
        <>
            <ToastContainer />
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
                    <form>
                    <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                        <div className="flex items-center"><GoChecklist /><div className="ml-1">Assignment</div></div>
                        <div onClick={handleCancle} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                    </div>
                    <div className="px-4 py-2">
                        <div className="mb-3">
                            <div>Title :</div>
                            <input type="text" className="border-2 w-full py-2 px-2 mt-1" name="title" value={dataAssignment.title} onChange={handleChange}  />
                            <div className={`${errors.title && "text-red-500 text-xs"} `}>{errors.title}</div>
                        </div>
                        <div >
                            <div>Instructions :</div>
                            <ReactQuill 
                                theme="snow" 
                                value={dataAssignment.instructions} 
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
                                name="points"
                                placeholder="No points"
                                value={formData.points}
                                onChange={handleChange}
                                />
                                <div className={`h-2 ${errors.points && "text-red-500 text-xs"} `}>{errors.points}</div>
                            </div>
                            <div className={`w-full ml-2 relative `}>
                                <div className="border-2 py-2 px-2 hover:bg-gray-200 cursor-pointer flex items-center justify-between toggle-type-work" >{formData.assignment_type}<FaUserPlus/></div>
                                 <div className={`h-2`}></div>
                            </div>
                           
                        </div>

                        <div className="mb-3 mt-3 flex">
                            <div className="w-full mr-1">
                                <div>Due date:</div>
                                <Flatpickr
                                    value={formData.due_time}
                                    name="DueDate"
                                    className="border-2 w-full py-2 px-2 mt-1"
                                    onChange={(selectedDates) => {
                                        setFormData({ ...formData, dueDate: selectedDates[0] });
                                    }}
                                    options={{
                                        enableTime: false,
                                        dateFormat: "d-m-Y",
                                        minDate: "today",
                                    }}           

                                />
                                <div className={`${errors.dueDate && "text-red-500 text-xs"} `}>{errors.dueDate}</div>
                            </div>
                            
                            <div className="w-full ml-1">
                                <div>Due time:</div>
                                <Flatpickr
                                    value={formData.due_time}
                                    className="border-2 w-full py-2 px-2 mt-1"
                                    onChange={(selectedDates) => {
                                        setFormData({ ...formData, dueTime: selectedDates[0] });
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
                                        value={formData.colses_time}
                                        className={`border-2 w-full py-2 px-2 mt-1 `}
                                        onChange={(selectedDates) => {
                                            setFormData({...formData, dateClose: selectedDates[0] })
                                        }}
                                        options={{
                                            enableTime: false,
                                            dateFormat: "d-m-Y",
                                            minDate: "today",
                                        }}
                                        disabled={!isChecked}           

                                    />
                                    <div className={`${errors.dateClose && "text-red-500 text-xs"} `}>{errors.dateClose}</div>
                                </div>
                                <div className="w-full ml-1">
                                    <div>Close time:</div>
                                    <Flatpickr
                                        value={formData.colses_time}
                                        className="border-2 w-full py-2 px-2 mt-1"
                                        onChange={(selectedDates)=>{
                                            setFormData({...formData, timeClose: selectedDates[0]})
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
                            <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150">Create</button></div>
                            
                        </div>
                    </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ModelEditAssignment;