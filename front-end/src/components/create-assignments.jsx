import React,{useState} from "react";
import { FaPlus} from "react-icons/fa";
import ModelAssignmen from "./model-assignments";
import useAuth from "./use-auth";
const CreateAssignments = ({isLogin,listAssignments}) => {
    const [open,setOpen] = useState(false)
    return (
        <>
            <div className="fixed bottom-4 right-4 text-base">
                <button className="bg-sky-500 px-3 py-2 text-white rounded-md cursor-pointer flex items-center hover:bg-sky-600 transition ease-in-out delay-150" onClick={()=>setOpen(!open)}><FaPlus /><div className="pl-1">Create</div> </button>
            </div>
            <ModelAssignmen isLogin={isLogin} open={open} OnClose={()=>setOpen(false)} listAssignments={listAssignments} />
        </>
    )
}

export default CreateAssignments;