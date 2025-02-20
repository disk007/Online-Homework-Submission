import React,{useContext,useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import { SiGoogleclassroom } from "react-icons/si";
const ModelEditRoom = ({open,onClose}) => {
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
                <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                    <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                        <div className="flex items-center"><SiGoogleclassroom /><div className="ml-1">Edit Room </div></div>
                        <div onClick={onClose} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                    </div>
                    <div className="flex mx-4 my-2 ">
                        <div className="w-full">
                            <input type="text" name="name" id="name" className="border-2 w-full py-2 px-2 mt-1" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModelEditRoom;