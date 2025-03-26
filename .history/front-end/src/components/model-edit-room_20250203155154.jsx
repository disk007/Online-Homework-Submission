import React,{useContext,useState} from "react";

const ModelEditRoom = ({open,onClose}) => {
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
                <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                    
                </div>
            </div>
        </>
    )
}