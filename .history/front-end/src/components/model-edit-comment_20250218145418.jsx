import React,{useEffect, useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
import ModelFile from "../components/model-file";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";
import ClipLoader from "react-spinners/ClipLoader";

const ModelEditComment = ({open,onClose,id,FetchAllComment}) => {
    const [dataComment,setDataComment] = useState({})
    const [errorComment, setErrorComment] = useState('')
    const [loading, setLoading] = useState(false)
    const handleFetchData = () => {
        FetchAllComment(); // เรียก fetchPost จาก props
    };
    const isContentValid = (value) => {
        const plainText = value.replace(/<[^>]+>/g, '').trim(); // ลบ HTML tags และ trim ช่องว่าง
        return plainText !== ""; // ตรวจสอบว่าไม่ใช่ข้อความว่าง
    };
    const fetchComment = async() => {
        try{
            if(id !== null){
                setLoading(true);
                const response = await axios.get(`/data-comment/${id}`)
                const responseData = response.data;
                setDataComment(responseData)
            }
            setLoading(false);
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        fetchComment()
    },[id])
    const handleQuillChange = (value) => {
        setDataComment({...dataComment,message:value})
        
    };
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    const updateComment = async() => {
        let isValid = true
        const data = new FormData()
        if(!isContentValid(String(dataComment.message))) {
            setErrorComment('comment is required.')
            isValid = false
        }
        if(isValid){
            data.append('message',dataComment.message)
            data.append('id',dataComment.id)
            data.append('date',new Date())
            const response = await axios.post('/edit-comment',data,{
                headers: {'Content-Type': 'application/json'}
            });
            const responseData = response.data;
            if (responseData.status ==='success') {
                handleFetchData()
                handleCancle()
            }
            
        }
    }
    const handleCancle = () => {
        onClose()
    }

    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
                <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                    <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                        <div className="flex items-center"><FaRegCommentAlt /><div className="ml-1">Edit comment </div></div>
                        <div onClick={handleCancle} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                    </div>
                    {loading  ? 
                        <ClipLoader color="#1D7AE5"  size={50} />
                    : 
                    <div className="flex mx-4 my-2 ">
                        <div className="w-full">
                            <ReactQuill 
                                theme="snow" 
                                value={dataComment.message} 
                                onChange={handleQuillChange} 
                                modules={modules} 
                                placeholder="Add a personal opinion"
                                
                            />
                        </div>
                    </div>
                    }
                    {errorComment && <div className="px-4 pb-3 text-sm text-red-500">{errorComment}</div>}
                    <div className="flex justify-end mx-4 my-5 ">
                        <div className="mr-2"><div className="border-2 py-2 px-8 w-full mt-3 text-gray-400 hover:text-gray-500 mr-2 transition ease-in-out delay-150 cursor-pointer" onClick={handleCancle}>Cancel</div></div>
                        <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150" onClick={updateComment}>Update</button></div>
                        
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModelEditComment;