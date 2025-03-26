import React,{useState} from "react";
import { FaUser } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
const CreateGroup = ({createGroup}) =>{
    const {
        goToNextPage,
        students,
        setStudent,
        setGroups,
        groups,
        OnClose
    } = createGroup
    
    const [search, setSearch] = useState('')
    const [selectedStudents, setSelectedStudents] = useState([])
    const [name, setName] = useState('')
    const [errors, setErrors] = useState({})
    const handleSelectStudent = (id,name) => {
        // const students = { id, name }
        if(selectedStudents.includes(id)){
            setSelectedStudents(selectedStudents.filter((stdId) => stdId !== id))
        }
        else{
            setSelectedStudents([...selectedStudents, id])
        }
    }
    const createGroup = (e) => {
        e.preventDefault()
        let isValid = true
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
        if(selectedStudents.length === 0 ){
            isValid = false
            validation.students = 'Please select at least one student.'
        }
        if(isValid){
            setErrors({})
            goToNextPage()
            setGroups({id: groups.length + 1,name,members: selectedStudents.map(id_user => students.find(student => student.id_user === id_user))})
            setStudent(students.filter(student => !selectedStudents.includes(student.id_user)))
        }
        else{
            setErrors(validation)
        }
    }
    return(
        <>
            <div className="flex justify-between mt-3">
                <div className="text-lg font-medium"> New Group </div>
                <button onClick={()=>{OnClose();}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
            </div>
            <div className="mt-5">
                <div>Group name</div>
                <input type="text" name="name" className="border-2 w-full py-1 px-2 mt-1" value={name} onChange={(e)=>setName(e.target.value)}/>
                <div className={`h-2 ${errors.name && "text-red-500 text-xs"} `}>{errors.name}</div>
            </div>
            <form onSubmit={createGroup}>
                <div className="mt-5 mb-2">
                    <div>Search students to add</div>
                    <input type="text" name="search" id="" placeholder="Search by name" className="w-full border-2 px-2 py-2 text-sm rounded-sm" onChange={(e)=>setSearch(e.target.value)} />
                </div>
                <div className="h-32 overflow-y-auto">
                    {students.filter((data) => data.fname && data.fname.toLowerCase().includes(search.toLowerCase())).map((student,index) => (
                        <div key={index} className="flex items-center py-2 hover:bg-gray-200 pl-2 cursor-pointer" onClick={() => handleSelectStudent(student.id_user, student.fname)}>
                            <input
                                type="checkbox"
                                name={student.fname}
                                className="w-4 h-4"
                                checked={selectedStudents.includes(student.id_user)}
                                onChange={() => handleSelectStudent(student.id_user, student.fname)}
                            />
                            <div className="mx-2 p-1 rounded-full border-2"><FaUser className="w-4 h-4" /></div>
                            <div className="line-clamp-1">{student.fname+" "+student.lname}</div>
                        </div>
                    ))}
                </div>
                <div className={`h-2 ${errors.students && "text-red-500 text-xs"} `}>{errors.students}</div>
                <div className="flex mt-1 justify-end">
                    <div className=""><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150">Create</button></div>
                </div>
            </form>
        </>
    )
}

export default CreateGroup;