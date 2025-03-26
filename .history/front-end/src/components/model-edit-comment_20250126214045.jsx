import React,{useEffect, useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
import ModelFile from "../components/model-file";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";

const ModelEditComment = ({open,onClose,id,fetchAllComment}) => {
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
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
                </div>
            </div>
        </>
    )
}

export default ModelEditComment;