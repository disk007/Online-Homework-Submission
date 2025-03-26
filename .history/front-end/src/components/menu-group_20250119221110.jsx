import React,{useState} from "react";

const MenuGroup = () => {
    return(
        <>
        <div className="mx-5">
            <div className="w-full mb-5">
                <button className="bg-sky-500 w-full py-3 text-white hover:bg-sky-600 border-2">Remember group</button>
            </div>
            <div className="w-full">
                <button className="border-gray-300 text-gray-700 border-2 w-full py-3 hover:bg-gray-300">Custom group</button>
            </div>
            
        </div>
        </>
    )
}

export default MenuGroup;