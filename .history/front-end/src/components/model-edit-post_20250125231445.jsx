import React,{useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
const ModelEditPost = ({open,onClose,id,data}) => {
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    console.log('Modules loaded')
    const [valuePost,setValuePost] = useState(data)
    const isContentValid = (value) => {
        const plainText = value.replace(/<[^>]+>/g, '').trim(); // ลบ HTML tags และ trim ช่องว่าง
        return plainText !== ""; // ตรวจสอบว่าไม่ใช่ข้อความว่าง
    };
    const addPost = async() => {
        let sizeFiles = 0
        let isValid = true
        const data = new FormData()
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if(!isContentValid(valuePost)) {
            setErrorpost('Post is required.')
            isValid = false
        }
        // if(fileNames.length > 0){
        //     fileNames.forEach((f,index)=>{
        //         data.append(`file[${index}]`,f.file)
        //         data.append(`fileName[${index}]`,f.name)
        //         sizeFiles += f.file.size
        //     })
        // }
        // else{
        //     data.append('fileName',null)
        // }
        // if(sizeFiles > MAX_FILE_SIZE){
        //     isValid = false
        //     setErrorpost('File size is too large. Maximum 10MB.')
        // }
        if(isValid){
            data.append('date',new Date())
            data.append('message',valuePost)
            // const response = await axios.post('/add-post',data,{
            //     headers: {'Content-Type': 'multipart/form-data'}
            // });
            // const responseData = response.data;
            // if (responseData.status ==='success') {
            //     setErrorpost('')
            //     setValuePost('')
            //     setFileNames([])
            // }
            
        }
    }
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
            <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                    <div className="flex items-center"><FaRegCommentAlt /><div className="ml-1">Edit Post</div></div>
                    <div onClick={onClose} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                </div>
                <div className="flex mx-4 my-5 ">
                    <div className="w-full">
                        <ReactQuill 
                            theme="snow" 
                            value={valuePost} 
                            onChange={setValuePost} 
                            modules={modules} 
                            placeholder="Add a personal opinion"
                            
                        />
                    </div>
                </div>
                <div className="flex justify-end pb-4 px-4">
                    <div className="mr-2"><div className="border-2 py-2 px-8 w-full mt-3 text-gray-400 hover:text-gray-500 mr-2 transition ease-in-out delay-150 cursor-pointer" onClick={onClose}>Cancel</div></div>
                    <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150">Update</button></div>
                    
                </div>
            </div>
            </div>
        </>
    )
}

export default ModelEditPost;