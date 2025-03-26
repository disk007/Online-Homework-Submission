import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaComment } from "react-icons/fa";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
import { FaUser } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdOutlineFileUpload , MdAssignment } from "react-icons/md";
import { LuSendHorizonal } from "react-icons/lu";
import ModelImg from "../components/model-img";
import {useNavigate,useParams } from "react-router-dom";
import withAuthorization from "../components/with-authorization";
import ModelFile from "../components/model-file";
import ModelEditPost from "../components/model-edit-post";
import ModelEditComment from "../components/model-edit-comment";
import io from "socket.io-client";
import axios from "axios";

const socket = io(process.env.REACT_APP_API_URL);

const DetailClassroom = ({isLogin}) =>{
    const [post,setPost] = useState(false)
    const [sidebar,setSidebar] = useState(false)
    const [comment,setComment] = useState({})
    const [selectFile,setSelectFile] = useState(null)
    const [fileNames,setFileNames] = useState([])
    const [dataPost,setDataPost] = useState([])
    const [dataComment,setDataComment] = useState([])
    const [valuePost,setValuePost] = useState('')
    const [errorPost,setErrorpost] = useState('')
    const [valueComment,setValueComment] = useState({})
    const [editDel,setEditDel] = useState({})
    const [editDelComment,setEditDelComment] = useState({})
    const [openEdit,setOpenEdit] = useState(false)
    const [openEditComment,setOpenEditComment] = useState(false)
    const [selecteId,setSelecteId] = useState('')
    const [openDelPost,setOpenDelPost] = useState(false)

    const [openFile,setOpenFile] = useState(false)
    const { classroomId } = useParams()
    const [assignment,setAssignment] = useState([])
    const navigate = useNavigate()
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    const [showAllComments, setShowAllComments] = useState({});

    const toggleShowAll = (id) => {
        setShowAllComments((prev) => ({
            ...prev,
            [id]: !prev[id], // สลับสถานะของโพสต์ที่เลือก
        }));
    };
    const chooseDataEdit = (id) => {
        setSelecteId(id)
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
                await fetchPost()
            }
            
        }
    }
    const addComment = async(id) => {
        let isValid = true
        const formdata = new FormData()
        const filteredvalueComment = String(valueComment[id]|| '') 
        if(!isContentValid(filteredvalueComment)) {
            isValid = false
        }
        if(isValid){
            formdata.append('message',filteredvalueComment)
            formdata.append('date',new Date())
            formdata.append('id_user',isLogin.id)
            formdata.append('id_post',id)
            const response = await axios.post('/add-comment',formdata,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                setValueComment({})
                // await fetchComment()
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
    const fetchComment = async() => {
        try {
            const response = await axios.get(`/get-comment/${classroomId}`)
            const responseData = response.data
            setDataComment(responseData)
        } catch (error) {
            console.error(error)
        }
        
    }
    useEffect(()=>{
        fetchPost()
    },[])
    useEffect(() =>{
        fetchComment()
    },[])
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".comment")) {
                setComment((prev) => (Object.keys(prev).length ? {} : prev));
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".post-editDel")) {
                setEditDel((prev) => (Object.keys(prev).length ? {} : prev));
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest(".comment-editDel")) {
                setEditDelComment((prev) => (Object.keys(prev).length ? {} : prev));
            }
        };
    
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
    const toggleComment = (id) => {
        setComment((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };
    const toggleEditDel = (id) => {
        setEditDel((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }
    const toggleEditDelComment = (id) => {
        setEditDelComment((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    }
    const handleCommentChange = (id, value) => {
        setValueComment((prev) => ({
          ...prev,
          [id]: value, // เก็บค่าของ comment ที่เปลี่ยนแปลง
        }));
      };
    const listAssignments = async() => {
        try {
            let response
            if(isLogin.role !== 'student'){
                response = await axios.get(`/page-post-assignments/${classroomId}`)
                
            }
            else if(isLogin.role === 'student'){
                response = await axios.get(`/page-post-work/${classroomId}/${isLogin.id}`)
            }
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
    const selectFileName = async (n,id) => {
        // setFileName(n)
        try {
            const encodedFileName = encodeURIComponent(n);
            // setFileName(pathFile)
            const response = await axios.get(`/post/${id}/${encodedFileName}`, { 
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
    const handleDelPost = async() => {
        try {
            const data = new FormData()
            data.append('id', selecteId)
            const response = await axios.post('/delete-post',data,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if (responseData.status ==='success') {
                // await fetchPost()
                setOpenDelPost(false)
                setSelecteId('')
            }
        } catch (error) {
            console.error(error)
        }
    }
    const handleDelComment = async(id) => {
        try {
            const data = new FormData()
            data.append('classroomId',classroomId)
            data.append('id', id)
            const response = await axios.post('/delete-comment',data,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            if (responseData.status ==='success') {
                // await fetchComment()
                setSelecteId('')
            }
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(() => {
        listAssignments()
    },[])
    const combinedData = [...assignment,...dataPost]
    const sortedData = combinedData.sort((a, b) => {
        const dateA = new Date(a.create_at);
        const dateB = new Date(b.create_at);
        return dateB - dateA;
    });
    const assignmentLink = (id) => {
        if(isLogin.role !== 'student'){
            navigate(`/detail-classroom/detail-assignment/${classroomId}/${id}`);
        }
        else if(isLogin.role === 'student'){
            navigate(`/detail-classroom/send-work/${classroomId}/${id}`);
        }
    }
    useEffect(()=> {
        socket.emit("comment",classroomId);
            const handleActivityUpdate = (data) => {
                // console.log("comment update:");
                fetchComment()
                fetchPost()
            };
            socket.on("get-comment", handleActivityUpdate);
    },[selecteId])
    return(
        <>
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar} />
            {
                openEdit && (
                    <ModelEditPost open={openEdit} onClose={()=>setOpenEdit(false)} id={selecteId} fetchAllPost={fetchPost}/>
                )
            }
            {
                openEditComment && (
                    <ModelEditComment open={openEditComment} onClose={()=>setOpenEditComment(false)} id={selecteId} classroomId={classroomId} />
                )
            }
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
                </div>

                {
                    post ? (
                        <div className="my-4 flex  flex-col lg:mx-24 md:mx-16 mx-10 border-2 p-2 rounded-lg">
                            <div className="flex justify-end w-full mb-2"><div className="cursor-pointer" onClick={handleCancle}><RxCross2 className="w-6 h-6 hover:bg-gray-200" /></div></div>
                            <div className="w-full">
                                <ReactQuill 
                                    theme="snow" 
                                    value={valuePost} 
                                    onChange={setValuePost} 
                                    modules={modules}
                                    className="px-2" 
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
                                <div className="text-base text-sm md:text-lg text-gray-500 px-1">Express your opinions in class</div>
                            </div>
                        )
                }
                {sortedData.map((data, index) => {
                const filteredComments = dataComment.filter((d) => d.id_post === data.id);
                const displayedComments = showAllComments[data.id]
                    ? filteredComments
                    : filteredComments.slice(0, 2);
                return( 
                <div key={index}>
                    {"title" in data ? ( // ถ้าเป็น assignment
                    <>
                        <div className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4 cursor-pointer hover:bg-gray-100" onClick={()=>assignmentLink((isLogin.role !== 'student' && data.id_assignment) || (isLogin.role === 'student' && data.work_id))}>
                            <div className="mx-4 flex items-center">
                                <MdAssignment className="lg:h-10 lg:w-10 w-7 h-7 text-sky-500" />
                                <div className="ml-2">
                                    <div>
                                        {data.title}
                                    </div>
                                    <div className="text-sm text-gray-500">Due: {formattedDate(data.create_at)}</div>
                                </div>
                            </div>
                        </div>
                    </>
                    ) : ( // ถ้าเป็น post
                    <>
                        <div className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4">
                            <div className="flex ">
                                <div className="mx-4"><div className="rounded-full border-2 p-3"><FaUser className="md:h-8 md:w-8 h-7 w-7" /></div></div>
                                <div className="mx-2 grow">
                                    <div >{data.name}<span className="text-red-500">{` (${data.role})`}</span></div>
                                    <div className="text-sm text-gray-500">{data.update_create ? formattedDate(data.update_create) : formattedDate(data.create_at)}</div>
                                </div>
                                {isLogin.id === data.id_user &&
                                <div className="mx-2 relative ">
                                    <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full " onClick={()=>toggleEditDel(data.id)}>
                                        <BsThreeDotsVertical className="w-5 h-5  " />
                                    </div>
                                    {
                                        editDel[data.id] && (
                                            <div className="absolute left-2 bg-white cursor-pointer post-editDel">
                                                <div className="text-xs border-t-2 border-x-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(data.id);setOpenEdit(!openEdit)}}>Edit</div>
                                                <div className="text-xs border-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(data.id);setOpenDelPost(!openDelPost)}}>Delete</div>
                                            </div>
                                        )
                                    }
                                    
                                    

                                </div>
                                }
                            </div>
                            <div className="mx-4 mt-4 text-sm mb-5">
                                <div className={`list-inside ${data.message.includes("<ol>") || data.message.includes("<ul>") ? "pl-4" : "pl-1"}`} dangerouslySetInnerHTML={{ __html: data.message }} />
                            </div>
                            {data.file && (
                                <div className="mx-4 flex flex-wrap text-xs">
                                    {JSON.parse(data.file).map((f, index) => (
                                        <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f}>
                                            <button
                                                className="px-2 py-2 flex flex-1"
                                                onClick={() => {setOpenFile(!openFile); selectFileName(f,data.id)}}
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
                                        </div>
                                    ))}
                                </div>
                            )}
                            <div className="border-t-2 mt-2">
                                <div className="flex justify-between mx-4 my-3 flex-wrap items-center text-gray-500">
                                    <div className=" ">{dataComment.filter((d) => d.id_post == data.id).length} comments</div>
                                    <div 
                                        className="cursor-pointer"
                                        onClick={() => toggleShowAll(data.id)}
                                    >
                                        {showAllComments[data.id] ? "Hide comments" : "All comments"}
                                    </div>
                                </div>
                                
                                {displayedComments.length > 0 && displayedComments.map((c,i) =>(
                                    
                                    <div key={i} className={`border-t-2`}>
                                        <div className="flex mt-5">
                                            <div className="mx-2"><div className="rounded-full border-2 p-2"><FaUser className="w-6 h-6" /></div></div>
                                            <div className="mx-1 grow  text-sm">
                                                <div >{c.name}</div>
                                                <div className="text-xs text-gray-500">{c.update_create ? formattedDate(c.update_create) : formattedDate(c.create_at)}</div>
                                            </div>
                                            {isLogin.id === c.id_user &&
                                            <div className="mx-2 relative">
                                                <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full " onClick={()=>toggleEditDelComment(c.id)}>
                                                    <BsThreeDotsVertical className="w-5 h-5  " />
                                                </div>
                                                    {
                                                        editDelComment[c.id] && (
                                                            <div className="absolute left-2 bg-white cursor-pointer comment-editDel">
                                                                <div className="text-xs border-t-2 border-x-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(c.id);setOpenEditComment(!openEditComment)}}>Edit</div>
                                                                <div className="text-xs border-2 p-1 hover:bg-gray-200" onClick={()=>{handleDelComment(c.id)}}>Delete</div>
                                                            </div>
                                                        )
                                                    }
                                            </div>
                                            }
                                        </div>
                                        <div className="my-4 text-sm mx-4">
                                        <div className={`list-inside ${c.message.includes("<ol>") || c.message.includes("<ul>") ? "pl-4" : "pl-1"}`} dangerouslySetInnerHTML={{ __html: c.message }} />
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t-2"></div>
                                <div className={`flex md:mx-7 mt-5 justify-center ${comment[data.id] ? "items-end" : "items-center"}`}>
                                    
                                    {
                                        comment[data.id] ? (
                                            <>
                                                <div className="flex w-full">
                                                    <div className="comment w-full">
                                                        <ReactQuill 
                                                            theme="snow" 
                                                            value={valueComment[data.id] || ''} 
                                                            onChange={(value) => handleCommentChange(data.id, value)} 
                                                            modules={modules}
                                                        />
                                                        
                                                    </div>
                                                    
                                                </div>
                                                <div className={` ml-2 top-2 ${!isContentValid(String(valueComment[data.id] || '')) ? 'text-gray-400': 'text-sky-500 cursor-pointer'}`} onClick={()=>addComment(data.id)}><LuSendHorizonal className="w-5 md:w-7 md:h-7 h-5  comment" /></div>
                                                
                                            </>
                                        )
                                        :(
                                            <div className="flex items-center w-full cursor-pointer hover:text-sky-500 md:text-base text-sm" onClick={() => toggleComment(data.id)}><FaRegCommentAlt className="w-5 md:w-7 md:h-7 h-5" /><span className="ml-2">Comment</span></div>
                                        )
                                    }
                                
                                </div>
                            </div>
                        </div>
                    </>
                    )}
                </div>
                )
                })}


                {/* {dataPost.length > 0 && dataPost.map((data,index) =>{
                 const filteredComments = dataComment.filter((d) => d.id_post === data.id);
                 const displayedComments = showAllComments[data.id]
                     ? filteredComments
                     : filteredComments.slice(0, 2); 
                return(  
                <div className="border-2 rounded-lg mt-5 lg:mx-24 md:mx-16 mx-10 shadow py-4">
                    <div className="flex ">
                        <div className="mx-4"><div className="rounded-full border-2 p-3"><FaUser className="md:h-8 md:w-8 h-7 w-7" /></div></div>
                        <div className="mx-2 grow">
                            <div >{data.name}<span className="text-red-500">{` (${data.role})`}</span></div>
                            <div className="text-sm text-gray-500">{data.update_create ? formattedDate(data.update_create) : formattedDate(data.create_at)}</div>
                        </div>
                        {isLogin.id === data.id_user &&
                        <div className="mx-2 relative ">
                            <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full " onClick={()=>toggleEditDel(data.id)}>
                                <BsThreeDotsVertical className="w-5 h-5  " />
                            </div>
                            {
                                editDel[data.id] && (
                                    <div className="absolute left-2 bg-white cursor-pointer post-editDel">
                                        <div className="text-xs border-t-2 border-x-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(data.id);setOpenEdit(!openEdit)}}>Edit</div>
                                        <div className="text-xs border-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(data.id);setOpenDelPost(!openDelPost)}}>Delete</div>
                                    </div>
                                )
                            }
                            
                            

                        </div>
                        }
                    </div>
                    <div className="mx-4 mt-4 text-sm mb-5">
                        <div className={`list-inside ${data.message.includes("<ol>") || data.message.includes("<ul>") ? "pl-4" : "pl-1"}`} dangerouslySetInnerHTML={{ __html: data.message }} />
                    </div>
                    {data.file && (
                        <div className="mx-4 flex flex-wrap text-xs">
                            {JSON.parse(data.file).map((f, index) => (
                                <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f}>
                                    <button
                                        className="px-2 py-2 flex flex-1"
                                        onClick={() => {setOpenFile(!openFile); selectFileName(f,data.id)}}
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
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="border-t-2 mt-2">
                        <div className="flex justify-between mx-4 my-3 flex-wrap items-center text-gray-500">
                            <div className=" ">{dataComment.filter((d) => d.id_post == data.id).length} comments</div>
                            <div 
                                className="cursor-pointer"
                                onClick={() => toggleShowAll(data.id)}
                            >
                                {showAllComments[data.id] ? "Hide comments" : "All comments"}
                            </div>
                        </div>
                        
                        {displayedComments.length > 0 && displayedComments.map((c,i) =>(
                            
                            <div key={i} className={`border-t-2`}>
                                <div className="flex mt-5">
                                    <div className="mx-2"><div className="rounded-full border-2 p-2"><FaUser className="w-6 h-6" /></div></div>
                                    <div className="mx-1 grow  text-sm">
                                        <div >{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.update_create ? formattedDate(c.update_create) : formattedDate(c.create_at)}</div>
                                    </div>
                                    {isLogin.id === c.id_user &&
                                    <div className="mx-2 relative">
                                        <div className="cursor-pointer hover:bg-gray-200 p-1 rounded-full " onClick={()=>toggleEditDelComment(c.id)}>
                                            <BsThreeDotsVertical className="w-5 h-5  " />
                                        </div>
                                            {
                                                editDelComment[c.id] && (
                                                    <div className="absolute left-2 bg-white cursor-pointer comment-editDel">
                                                        <div className="text-xs border-t-2 border-x-2 p-1 hover:bg-gray-200" onClick={()=>{chooseDataEdit(c.id);setOpenEditComment(!openEditComment)}}>Edit</div>
                                                        <div className="text-xs border-2 p-1 hover:bg-gray-200" onClick={()=>{handleDelComment(c.id)}}>Delete</div>
                                                    </div>
                                                )
                                            }
                                    </div>
                                    }
                                </div>
                                <div className="my-4 text-sm mx-4">
                                <div className={`list-inside ${c.message.includes("<ol>") || c.message.includes("<ul>") ? "pl-4" : "pl-1"}`} dangerouslySetInnerHTML={{ __html: c.message }} />
                                </div>
                            </div>
                        ))}
                        <div className="border-t-2"></div>
                        <div className={`flex md:mx-7 mt-5 justify-center ${comment[data.id] ? "items-end" : "items-center"}`}>
                            
                            {
                                comment[data.id] ? (
                                    <>
                                        <div className="flex w-full">
                                            <div className="comment w-full">
                                                <ReactQuill 
                                                    theme="snow" 
                                                    value={valueComment[data.id] || ''} 
                                                    onChange={(value) => handleCommentChange(data.id, value)} 
                                                    modules={modules}
                                                />
                                                 
                                            </div>
                                            
                                        </div>
                                        <div className={` ml-2 top-2 ${!isContentValid(String(valueComment[data.id] || '')) ? 'text-gray-400': 'text-sky-500 cursor-pointer'}`} onClick={()=>addComment(data.id)}><LuSendHorizonal className="w-5 md:w-7 md:h-7 h-5  comment" /></div>
                                        
                                    </>
                                )
                                :(
                                    <div className="flex items-center w-full cursor-pointer hover:text-sky-500 md:text-base text-sm" onClick={() => toggleComment(data.id)}><FaRegCommentAlt className="w-5 md:w-7 md:h-7 h-5" /><span className="ml-2">Comment</span></div>
                                )
                            }
                        
                        </div>
                    </div>
                </div>
                )
                })} */}
                
            </div>
            {
                openDelPost && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setOpenDelPost(!openDelPost)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to delete post ?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setOpenDelPost(!openDelPost)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handleDelPost}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default withAuthorization(DetailClassroom)