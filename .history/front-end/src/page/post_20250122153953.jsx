import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaComment } from "react-icons/fa";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import '../css/react_quill.css'
import '../../node_modules/react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { FaUser } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineFileUpload } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import ModelImg from "../components/model-img";
import {Navigate,useParams } from "react-router-dom";
import withAuthorization from "../components/with-authorization";
import ModelFile from "../components/model-file";
import axios from "axios";


const DetailClassroom = ({isLogin}) =>{
    const [post,setPost] = useState(false)
    const [sidebar,setSidebar] = useState(false)
    const [comment,setComment] = useState(false)
    const [imgModel, setImgModel] = useState(false)
    const [nameImg, setNameImg] = useState('')
    const [selectFile,setSelectFile] = useState(null)
    const [fileNames,setFileNames] = useState([])
    const [dataPost,setDataPost] = useState([])
    const [valuePost,setValuePost] = useState('')
    const [errorPost,setErrorpost] = useState('')
    const [openFile,setOpenFile] = useState(false)
    const { classroomId } = useParams()
    const [assignment,setAssignment] = useState([])
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    const addPost = async() => {
        let sizeFiles = 0
        let isValid = true
        const data = new FormData()
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if(!isContentValid(valuePost)) {
            setErrorpost('Post is required.')
            isValid = false
        }
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
            setErrorpost('File size is too large. Maximum 10MB.')
        }
        if(isValid){
            data.append('date',new Date())
            data.append('id_user',isLogin.id)
            data.append('id_classroom',classroomId)
            data.append('message',valuePost)
            const response = await axios.post('/add-post',data,{
                headers: {'Content-Type': 'multipart/form-data'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                setErrorpost('')
                setValuePost('')
                setFileNames([])
            }
            
        }
    }
    const isContentValid = (value) => {
        const plainText = value.replace(/<[^>]+>/g, '').trim(); // ลบ HTML tags และ trim ช่องว่าง
        return plainText !== ""; // ตรวจสอบว่าไม่ใช่ข้อความว่าง
    };
    const fetchPost = async() => {
        try {
            const response = await axios.get(`/get-post/${classroomId}`)
            const responseData = response.data
            setDataPost(responseData)
        } catch (error) {
            console.error(error)
        }
        
    }
    useEffect(()=>{
        fetchPost()
    },[])
    useEffect(()=>{
        const handleClickOutside = (e) =>{
            if(!e.target.closest(".comment")){
                setComment(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return ()=> document.removeEventListener("mousedown", handleClickOutside)
    },[comment])

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
    const handleDelete = (fileName) => {
        setFileNames(prevFileNames => prevFileNames.filter(file => file.name !== fileName))
    }
    const handleCancle = () =>{
        setPost(!post)
        setValuePost('')
        setErrorpost('')
        setFileNames([])
    }
    const handleSelectFile = (file,type) => {
        setSelectFile({url:file, type:type});
    }
    const listAssignments = async() => {
        try {
            const response = await axios.get(`/list-assignments/${classroomId}`)
            const responseData = response.data
            setAssignment(responseData)
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
    useEffect(() => {
        listAssignments()
    },[])
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
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
            <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><FaComment className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Post</div>
                    {/* <div>{isLogin.fname}</div> */}
                </div>

                {
                    post ? (
                        <div className="my-4 flex  flex-col lg:mx-24 md:mx-16 mx-10 border-2 p-2 rounded-lg">
                            <div className="flex justify-end w-full"><div className="cursor-pointer" onClick={handleCancle}><RxCross2 className="w-6 h-6 hover:bg-gray-200" /></div></div>
                            <div className="w-full">
                                <ReactQuill 
                                    theme="snow" 
                                    value={valuePost} 
                                    onChange={setValuePost} 
                                    modules={modules} 
                                    placeholder="Add a personal opinion"
                                    
                                />
                            </div>

                            <div className="mt-3">
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
                            <div className="mt-2 flex justify-between items-center">
                                <div className="border-2 inline-block p-1 rounded-full hover:bg-gray-300">
                                    <input type="file" className="hidden" id="file" multiple onChange={handleFileChange}  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/png,image/jpeg"/>
                                    <label htmlFor="file" className="cursor-pointer"><MdOutlineFileUpload className="w-8 h-8" /></label>
                                </div>
                                <div><button className="hover:bg-sky-600 text-white bg-sky-500 py-1 transition ease-in-out delay-150 rounded px-7" onClick={addPost}>Post</button></div>
                            </div>
                            {errorPost && <div className="mt-1 text-sm text-red-500">{errorPost}</div>}
                        </div>
                        ) : (
                            <div className="flex border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-2 items-center cursor-pointer hover:bg-gray-100" onClick={()=>setPost(!post)}>
                                <div className="p-1 px-3"><FaRegCommentAlt className="lg:h-10 lg:w-10 w-7 h-7 text-sky-500"/></div>
                                <div className="text-base md:text-lg text-gray-500 px-1">Express your opinions in class</div>
                            </div>
                        )
                }
                {dataPost.length > 0 && dataPost.map((data,index) =>(
                <div className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4">
                    <div className="flex ">
                        <div className="mx-4"><div className="rounded-full border-2 p-3"><FaUser className="md:h-8 md:w-8 h-7 w-7" /></div></div>
                        <div className="mx-2 grow">
                            <div >{data.name}<span className="text-red-500">{` (${data.role === 'teacher' ? data.role :null})`}</span></div>
                            <div className="text-sm text-gray-500">{formattedDate(data.create_at)}</div>
                        </div>
                        <div className="mx-2 cursor-pointer ">
                            <BsThreeDotsVertical className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mx-4 mt-4 text-sm ">
                        <div className={`list-inside ${data.message.includes("<ol>") || data.message.includes("<ul>") ? "pl-4" : "pl-1"}`} dangerouslySetInnerHTML={{ __html: data.message }} />
                    </div>
                    <div className="border-t-2">
                        <div className="text-gray-500 mx-4 mt-3">2 comments</div>
                        <div className="flex mt-5">
                            <div className="mx-2"><div className="rounded-full border-2 p-2"><FaUser className="w-6 h-6" /></div></div>
                            <div className="mx-1 grow text-gray-500 text-sm">
                                <div >Witchaphon seanthawisuk</div>
                                <div className="text-xs">18:15</div>
                            </div>
                            <div className="mx-2 cursor-pointer ">
                                <BsThreeDotsVertical className="w-5 h-5" />
                            </div>
                        </div>
                        <div className="mx-4 mt-4 text-sm ">
                            <div className="break-all">อะไรเอ๋ยใหญ่ที่สุด</div>
                        </div>
                        <div className="flex mx-4 mt-2 mb-8 items-center flex-wrap">
                            <div className="w-56 h-48 bg-contain mr-2 bg-black flex justify-center items-center cursor-pointer" onClick={()=>{setImgModel(true);setNameImg('https://shotkit.com/wp-content/uploads/2021/09/Monochrome-vs-grayscale-ali-khalil.jpg')}}><img src="https://shotkit.com/wp-content/uploads/2021/09/Monochrome-vs-grayscale-ali-khalil.jpg"/></div>
                            <div className="w-56 h-48 bg-contain mr-2 bg-black flex justify-center items-center"><img src="https://colesclassroom.com/wp-content/uploads/2020/08/pexels-kayode-fashola-621812.jpg" /></div>
                        </div>

                        <div className={`flex md:mx-4 mx-3 mt-4 justify-center ${comment ? "items-start" : "items-center"}`}>
                            <div className="rounded-full border-2 p-2 mx-3"><FaUser className="h-6 w-6" /></div>
                            {
                                comment ? (
                                    <>
                                        {/* <div className="w-full comment">
                                            <ReactQuill 
                                                theme="snow" 
                                                value={value} 
                                                onChange={setValuePost} 
                                                modules={modules} 
                                                className="flex flex-col-reverse"
                                            /> 
                                        </div> */}
                                        <div className="relative ml-3 top-2 cursor-pointer"><LuSendHorizonal className="w-5 md:w-6 md:h-6 h-5 text-sky-500 comment" /></div>
                                    </>
                                )
                                :(
                                    <div className="w-full cursor-pointer hover:text-sky-500 md:text-base text-sm" onClick={()=>setComment(!comment)}>Comment</div>
                                )
                            }
                        
                        </div>
                    </div>
                </div>
                ))}
                {/* <div className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4">
                    <div className="flex ">
                        <div className="mx-4"><div className="rounded-full border-2 p-3"><FaUser className="md:h-8 md:w-8 h-7 w-7" /></div></div>
                        <div className="mx-2 grow">
                            <div >Witchaphon seanthawisuk</div>
                            <div className="text-sm">18:15</div>
                        </div>
                        <div className="mx-2 cursor-pointer ">
                            <BsThreeDotsVertical className="w-5 h-5" />
                        </div>
                    </div>
                    <div className="mx-4 mt-4 text-sm mb-8">
                        <div className="break-all">ฮัลโหลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลลล</div>
                    </div>
                    <div className="border-t-2">
                        <div className="flex md:mx-4 mx-3 mt-4 items-start justify-center">
                            <div className="rounded-full border-2 p-2 mx-3"><FaUser className="h-6 w-6" /></div>
                            <div className="w-full">
                                <ReactQuill 
                                    theme="snow" 
                                    value={value} 
                                    onChange={setValuePost} 
                                    modules={modules} 
                                    className="flex flex-col-reverse"
                                    
                                /> 
                            </div>
                            <div className="relative ml-3 top-2 cursor-pointer"><LuSendHorizonal className="w-5 md:w-6 md:h-6 h-5 text-sky-500" /></div>
                        </div>
                    </div>
                </div> */}
                
            </div>
        </>
    )
}

export default withAuthorization(DetailClassroom)