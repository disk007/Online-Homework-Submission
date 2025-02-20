import React,{useState,useEffect} from "react"
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaUser } from "react-icons/fa6";
import { RiDeleteBin6Line } from "react-icons/ri";
const Edit_group = ({edit_group}) => {
    const {
        GroupStudents,
        id_group,
        goToNextPage,
        goToPreviousPage,
        setGroup,
        setStudent
    } = edit_group
    const [name, setName] = useState(() => {
        const group = GroupStudents.find((data) => data.id === id_group);
        return group ? group.name : ''; // ถ้าเจอกลุ่มที่มี id ตรงกัน ให้คืนค่า name ของกลุ่มนั้น ถ้าไม่เจอให้เป็นค่าว่าง
    });

    const [errors, setErrors] = useState({})
    const [search, setSearch] = useState('')

    const handleAddStudents = () => {
        goToNextPage()
    }
    const handleCancel = () => {
        setErrors({})
        goToPreviousPage();
    }
    const handleUpdate = (e) => {
        e.preventDefault()
        let isValid = true
        const group = GroupStudents.find(group => group.id === id_group);
        const isNameUnique = !GroupStudents.some(group => 
            group.id !== id_group && group.name.toLowerCase() === name.toLowerCase());
        let validation = {}
        
        if(!name.trim()){
            isValid = false
            validation.name = 'Group name is required.'
        }
        else if (/[\u0E00-\u0E7F]/.test(name)) {
            isValid = false;
            validation.name = 'No Thai characters allowed.';
        }
        else if (/^[^a-zA-Z]|[ ]{2,}|[^a-zA-Z0-9 ]/.test(name)) {
            isValid = false;
            validation.name = 'First character must be a letter.';
        }
        
        if (!isNameUnique) {
            isValid = false;
            validation.name = 'Group name must be unique.';
        }    
        if (group && group.members.length === 0) {
            isValid = false;
            validation.members = 'This group has no members.';
        }
        
        
        
        if(isValid){
            setErrors({})
            setGroup((prevGroups) => {
                const updatedGroups = prevGroups.map((group) => {
                    if (group.id === id_group) {
                        return { ...group, name: name }; // อัปเดตชื่อกลุ่ม
                    }
                    return group;
                });
            
                return updatedGroups; // อัปเดตกลุ่ม
            });
            goToPreviousPage()
        }
        else{
            setErrors(validation)
        }
    }
    const handleRemoveMember = (groupId, studentId) => {
        const groupToUpdate = GroupStudents.find(group => group.id === groupId);
        const studentsToRemove =  groupToUpdate.members.filter(student => student.id_user === studentId) 
        setStudent(prevStudents => [...prevStudents, ...studentsToRemove]);
        setGroup(prevGroups => 
            prevGroups.map(group => {
                // ตรวจสอบว่าเป็นกลุ่มที่ต้องการอัปเดต
                if (group.id === groupId) {
                    // ลบสมาชิกออกจาก group.members
                    return {
                        ...group,
                        members: group.members.filter(student => student.id_user !== studentId)
                    };
                }
                return group;
            })
        );
        
    };
    const handleDeleletingGroup = () => {
        setGroup(prevGroups => prevGroups.filter(group => group.id !== id_group))
        const groupToUpdate = GroupStudents.find(group => group.id === id_group);
        const studentsToRemove =  groupToUpdate.members
        setStudent(prevStudents => [...prevStudents, ...studentsToRemove]);
        goToPreviousPage()
    }
    return(
        <>
            {/* <div className="flex justify-between mt-3">
                <div className="text-lg font-medium"> Edit Group </div>
                <button onClick={handleExit} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
            </div> */}
            <form onSubmit={handleUpdate}>
                <div className="mt-5">
                    <div>Group name</div>
                    <input type="text" name="name" className="border-2 w-full py-1 px-2 mt-1" value={name} onChange={(e)=>setName(e.target.value)}/>
                    <div className={`h-2 ${errors.name && "text-red-500 text-xs"} `}>{errors.name}</div>
                </div>
                <div className="mt-5">Students in the group</div>
                <hr className="my-2" />
                <div className="text-sky-500 hover:text-sky-600"> <button className="flex items-center cursor-pointer" onClick={handleAddStudents}><FaPlus className="mr-1"/> Add students</button></div>
                <hr className="my-2" />
                <div className="h-32 overflow-y-auto">
                {GroupStudents.map((data, groupIndex) => (
                    data.id === id_group && ( // ตรวจสอบว่า id ของกลุ่มตรงกับ id_group หรือไม่
                        <div key={groupIndex}>
                            {data.members.map((student, index) => (
                                <div className="flex justify-between items-center" key={index}>
                                    <div className="flex items-center py-2 pl-2">
                                        <div className="mx-2 p-1 rounded-full border-2">
                                            <FaUser className="w-4 h-4" />
                                        </div>
                                        <div className="line-clamp-1">
                                            {student.fname + " " + student.lname}
                                        </div>
                                    </div>
                                    <div 
                                        className="p-2 cursor-pointer hover:bg-gray-200 rounded-full"
                                        onClick={() => handleRemoveMember(data.id, student.id_user)} // เรียกฟังก์ชันเมื่อคลิก
                                    >
                                        <RxCross2 className="w-5 h-5" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ))}
                    <hr className="my-2" />
                </div>
                <div className={`h-2 ${errors.members && "text-red-500 text-xs"} `}>{errors.members}</div>
                <div className="flex justify-between mb-3 mt-5">
                    <div className="flex items-center px-2 cursor-pointer  text-sky-500 hover:text-sky-600 transition ease-in-out delay-150" onClick={handleDeleletingGroup}><RiDeleteBin6Line className='mr-1 hover:text-sky-600' />Delete Groups</div>
                    <div className="flex justify-between">
                        <button className=" px-7 py-2 cursor-pointer text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={handleCancel}>Cancel</button>
                        <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" >Update</button>
                    </div>
                </div>
            </form>
        </>
    )
}

export default Edit_group