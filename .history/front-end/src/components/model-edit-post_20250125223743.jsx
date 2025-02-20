import React,{useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
const ModelEditPost = ({open,onClose}) => {
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    const [valuePost,setValuePost] = useState('')
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
            <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                    <div className="flex items-center"><FaRegCommentAlt /><div className="ml-1">Edit Post</div></div>
                    <div onClick={onClose} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                </div>
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
            </div>
        </>
    )
}

export default ModelEditPost;