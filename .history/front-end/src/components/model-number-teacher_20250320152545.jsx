import React from "react";
import { RxCross2 } from "react-icons/rx";
import { MdAddCall } from "react-icons/md";
const Model_number_teacher = ({open,OnClose}) => {
    const handleCancel = () => {
        OnClose()
    }
    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center visible bg-black/20 z-50`}>
                <div className="bg-white rounded-md p-4 w-[30rem]">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <MdAddCall className="w-6 h-6" />
                            <span className="px-2">Add number teacher</span>
                        </div>
                        <div onClick={handleCancel}>
                            <RxCross2 className="w-6 h-6"/>
                        </div>
                    </div>
                    <div className="mt-5">Enter your number teacher.</div>
                    <div className=""><input type="text" name="numberTeacher" id="numberTeacher" className="border-2 w-full py-3 px-2"   /></div>
                    <div className={`mt-2 mb-1 flex justify-end`}>
                        <div className="hover:text-sky-500">
                            <button  className={`border-2 py-2 px-8 w-full bg-sky-500 text-white border-sky-500 cursor-pointer mt-3 hover:border-sky-600 hover:bg-sky-600 transition ease-in-out delay-150`} ><MdAddCall className="w-6 h-6" /><span>Add</span></button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Model_number_teacher