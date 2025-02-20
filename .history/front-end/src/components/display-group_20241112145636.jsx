import React,{useState} from "react";
import { FaPlus,FaUserFriends} from "react-icons/fa";
import { IoMdRefresh } from "react-icons/io";
import { GoPencil } from "react-icons/go";
const DisplayGroup = ({displayGroup}) => {
    const [search, setSearch] = useState('')
    const [id,setId] = useState(null)
    const [open,setOpen] = useState(false)
    const {
        goToPreviousPage,
        GroupStudents = [],  // ตั้งค่าเริ่มต้นให้เป็นอาร์เรย์ว่าง
        setGroups,
        resetGroups = [],
        OnClose,
        students,
        setStudent = () => {},
        count,
        edit_group,
        id_group = () =>{}
    } = displayGroup;

    const resetGroup = () => {
        setGroups([])
        setStudent(resetGroups)
        count(0)
        goToPreviousPage()
        OnClose()
    }
    
    const handleDone = () => {
        count(GroupStudents.length)
        OnClose()
    }
    const handleEditGroup = (id) => {
        // setId(id)
        id_group(id)
        edit_group()
    }
    // console.log("id_group "+id)
    return(
        <>
            <div className="mt-7 flex justify-between">
                <div className={`flex items-center px-2 cursor-pointer rounded-sm hover:bg-sky-600 text-white transition ease-in-out delay-150 ${students.length == 0 ? 'pointer-events-none bg-gray-300 text-gray-500' : 'bg-sky-500 hover:bg-sky-600'}`} onClick={goToPreviousPage} ><FaPlus className="mr-1" />New Group</div>
                <div className="">
                    <input type="text" name="search" id="" placeholder="Search by Group" className="w-full border-2 px-2 py-2 text-sm rounded-sm" onChange={(e)=>setSearch(e.target.value)} />
                </div>
            </div>
            <div className="h-32 overflow-y-auto mt-4">
            {
                GroupStudents.map((group, index) => (
                    <>
                        <div className={`flex ${index === GroupStudents.length - 1 ? 'border-y-2' : 'border-t-2'} py-2 items-center`}>
                            <div className="border-2 ml-2 mr-4 flex items-center p-2 rounded-full"><FaUserFriends className="w-6 h-6" /></div>
                            <div className="grow" key={index}>
                                <div >
                                    {group.name}
                                </div>
                                <div className="text-sm text-gray-500">{group.members.length} member</div>
                                <div className="flex flex-row space-x-1">
                                {group.members.map((student, index) => (
                                    <div key={index} className="flex">
                                        {student.fname}
                                        {index < group.members.length - 1 && " ,"}
                                    </div>
                                ))}
                                </div>
                            </div>
                            <div className="mr-3 cursor-pointer hover:bg-gray-200 rounded-full p-2" onClick={()=>handleEditGroup(group.id)}>
                                <GoPencil className=" w-5 h-5" />
                            </div>
                        </div>
                    </>
                ))
            }
            </div>
            <div className="flex justify-between mb-3 mt-4">
                <div className="flex items-center px-2 cursor-pointer  text-sky-500 hover:text-sky-600 transition ease-in-out delay-150" onClick={resetGroup}><IoMdRefresh className='mr-1 hover:text-sky-600' />Recreate Groups</div>
                <div><button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150" onClick={handleDone}>Done</button></div>
            </div>
                
        </>
    )
}

export default DisplayGroup;