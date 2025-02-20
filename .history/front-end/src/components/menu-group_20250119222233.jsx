import React,{useState} from "react";

const MenuGroup = ({menuGroup}) => {
    const {
        goToNextPage,
        setCurrentPage
    } = menuGroup;
    return(
        <>
        <div className="my-5">
            <div className="w-full mb-5">
                <button className="bg-sky-500 w-full py-3 text-white hover:bg-sky-600 border-2" onClick={()=>setCurrentPage(3)}>Remember group</button>
            </div>
            <div className="w-full">
                <button className="border-gray-300 text-gray-700 border-2 w-full py-3 hover:bg-gray-300" onClick={goToNextPage}>Custom group</button>
            </div>
            
        </div>
        </>
    )
}

export default MenuGroup;