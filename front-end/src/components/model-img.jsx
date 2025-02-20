import React,{useState,useEffect,useRef} from "react";
import { MdOutlineRefresh } from "react-icons/md";
import { FaArrowDown } from "react-icons/fa";
import { LuZoomIn,LuZoomOut } from "react-icons/lu";
import {
    TransformWrapper,
    TransformComponent,
    useControls,
  } from "react-zoom-pan-pinch";
  
const Controls = () => {
    const { zoomIn, zoomOut, resetTransform } = useControls();
    return (
        <>
        <div className="p-2 cursor-pointer mx-2" onClick={() => resetTransform()}><MdOutlineRefresh className="text-slate-400 hover:text-white w-5 h-5" /></div>
        <div className="p-2 cursor-pointer mx-2" onClick={() => zoomOut()}><LuZoomOut className="text-slate-400 hover:text-white w-5 h-5" /></div>
        <div className="p-2 cursor-pointer mx-2" onClick={() => zoomIn()}><LuZoomIn className="text-slate-400 hover:text-white w-5 h-5" /></div>
        </>
    )
}

const ModelImg = ({open,OnClose,name,fileName}) => {
    const handleClose = () => {
        OnClose()
        
    }
    return(
    <>
        <div className={`fixed inset-0 flex flex-col ${open ? "visible bg-black/90 z-50" : "invisible"}`}>
        <TransformWrapper>
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <>
            <div className="flex justify-end p-5 items-center">
                <Controls />
                <a
                    href={name}
                    download={fileName}
                    className="bg-black text-white mr-1 hover:border-2 p-1 rounded-full"
                >
                    <FaArrowDown className="text-slate-400 hover:text-white" />
                </a>
                <button onClick={()=>{handleClose()}} className="mx-2 text-white border-2 border-slate-400 hover:border-white py-2 px-5 rounded-md ">Close</button>
            </div>
            <div className="flex-grow flex items-center justify-center" >
                <div className="w-[450px] bg-contain overflow-hidden">
                    <TransformComponent>
                        <img src={name} alt="test" />
                    </TransformComponent>
                </div>
            </div>
            </>
        )}
        </TransformWrapper>
        </div>
    </>
    
    )
}

export default ModelImg;