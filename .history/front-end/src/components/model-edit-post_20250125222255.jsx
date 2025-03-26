import React,{useState} from "react";

const ModelEditPost = ({open}) => {
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
            <div className="bg-white rounded-md w-[600px] overflow-y-auto">

            </div>
            </div>
        </>
    )
}

export default ModelEditPost;