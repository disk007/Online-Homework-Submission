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
                <div className="bg-white rounded-md p-4">
                    <div className="flex justify-between">
                        <div className="flex items-center">
                            <MdAddCall />
                            <span className="px-2">Add number teacher</span>
                        </div>
                        <div onClick={handleCancel}>
                            <RxCross2 />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Model_number_teacher