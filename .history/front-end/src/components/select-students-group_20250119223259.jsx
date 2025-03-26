import React,{useState} from "react"
import { FaUser } from "react-icons/fa6";
const Select_students_group = ({choose_students}) => {
    const {
        students,
        setCurrentPage,
        goToPreviousPage,
        setGroup,
        id_group,
        GroupStudents,
        setStudent
    } = choose_students
    const [search, setSearch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])
    const [errors, setErrors] = useState({})
    const handleSelectStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(studentId => studentId !== id))
        } 
        else {
            setSelectedStudents([...selectedStudents, id])
        }
    }
    const select_students = (e) => {
        e.preventDefault()
        let isValid = true
        let validation = {}
        if(selectedStudents.length === 0){
            isValid =  false
            validation.selectedStudents = 'select students is required.'
        }
        if(isValid){
            setErrors({})
            // const groupUpdate = GroupStudents.find(group => group.id === group.id);
            // const updateStudent = groupUpdate.members.filter(
            //     data => !selectedStudents.includes(data.id_user) // ลบเฉพาะที่ id_user ตรงกับ selectedStudents
            // );
            const updateStudent = students.filter(student => !selectedStudents.includes(student.id_user))
            setStudent([...updateStudent]);
            setGroup((prevGroups) =>
                prevGroups.map(group => {
                    if(group.id === id_group){
                        const update = students.filter(student => selectedStudents.includes(student.id_user))
                        return {
                            ...group,
                            members:[...group.members, ...update]
                        }
                    }
                    return group
                })
            )
            setCurrentPage(4)
            goToPreviousPage()
        }
        else{
            setErrors(validation)
        }
    }
    const handleCancle = () => {
        setSearch('')
        setSelectedStudents([])
        setErrors({})
        setCurrentPage(4)
        goToPreviousPage()
    }
    return(
        <>
            <form onSubmit={select_students}>
            <div className="mt-5 mb-2">
                <input type="text" name="search" id="" placeholder="Search by name" className="w-full border-2 px-2 py-2 text-sm rounded-sm" onChange={(e)=>setSearch(e.target.value)} />
            </div>
            <div className="h-32 overflow-y-auto">
                {students.length === 0 ? (
                    <div className="text-gray-500 text-sm">No students available.</div>
                ) : (
                    students.filter((data) => data.fname && data.fname.toLowerCase().includes(search.toLowerCase())).map((student, index) => (
                        <div key={index} className="flex items-center py-2 hover:bg-gray-200 pl-2 cursor-pointer" onClick={() => handleSelectStudent(student.id_user)}>
                            <input
                                type="checkbox"
                                name={student.fname}
                                className="w-4 h-4"
                                checked={selectedStudents.includes(student.id_user)}
                                onChange={() => handleSelectStudent(student.id_user)}
                            />
                            <div className="mx-2 p-1 rounded-full border-2"><FaUser className="w-4 h-4" /></div>
                            <div className="line-clamp-1">{student.fname + " " + student.lname}</div>
                        </div>
                    ))
                )}
            </div>
            <div className={`h-2 ${errors.selectedStudents && "text-red-500 text-xs"} `}>{errors.selectedStudents}</div>
            <div className="flex justify-end mb-3 mt-5">
                    <button className=" px-7 py-2 cursor-pointer text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={handleCancle}>Cancel</button>
                    <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" >Choose</button>
            </div>
            </form>
        </>
    )
}

export default Select_students_group