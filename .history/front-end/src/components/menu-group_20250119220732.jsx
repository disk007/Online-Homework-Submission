import React,{useState} from "react";

const MenuGroup = () => {
    return(
        <>
        <div className="mt-5">
            <div className="w-full">
                <button className="bg-sky-500 w-full py-3 text-white">Remember group</button>
            </div>
            <div className="w-full">
                <button className="bg-sky-500 w-full py-3 text-white">Custom group</button>
            </div>
            
        </div>
        </>
    )
}

export default MenuGroup;