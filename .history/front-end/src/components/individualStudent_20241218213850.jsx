import React,{useState,useEffect} from "react";
import { FaUser } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import {useParams } from "react-router-dom";

const IndividualStudent = ({open,OnClose,setDataIndividual,state}) => {
    const [isChecked, setIsChecked] = useState(false)
    const { classroomId } = useParams()
    const [selectedStudents, setSelectedStudents] = useState([])
    const [saveSelectedStudents, setSaveSelectedStudents] = useState([])
    const [search, setSearch] = useState('');
    const [students,setStudents] = useState([])
    const fetchMembers = async () => {
        const response = await axios.get(`/members/${classroomId}`)
        const responseData = response.data 
        setStudents(responseData)
    }
    const handleSelectStudent = (id) => {
        if (selectedStudents.includes(id)) {
            setSelectedStudents(selectedStudents.filter(studentId => studentId !== id))
        } 
        else {
            setSelectedStudents([...selectedStudents, id])
        }
    }
    const handleSelectAll = () => {
        if (isChecked) {
            setSelectedStudents([]);
        } else {
            setSelectedStudents(students.map(student => student.id_user))
        }
        setIsChecked(!isChecked)
    }

    const handleDone = () => {
        setSaveSelectedStudents(selectedStudents);
        setDataIndividual([...selectedStudents]);
        OnClose();
    }
    
    const handleCancel = () => {
        setSelectedStudents(saveSelectedStudents);
        setDataIndividual([...saveSelectedStudents]);
        OnClose();
    }

    useEffect(() => {
        setIsChecked(selectedStudents.length === students.length)
    }, [selectedStudents, students.length])

    useEffect(()=>{
        if(!state){
            setSaveSelectedStudents([])
            setSelectedStudents([])
        }
    },[state])
    

    useEffect(() => {
        fetchMembers()
    }, [])

    return(
        <>
        <div className={`fixed inset-0 flex justify-center items-center ${open ? "visible bg-black/20 z-50" : "invisible"}`}>
        <div className="bg-white rounded-md p-4 w-[30rem]">
            <div>
                <div className="flex justify-end mb-2">
                    <button className="w-6 h-6 hover:bg-gray-200" onClick={handleCancel}><RxCross2 className="w-6 h-6"/></button>
                </div>
                <div className="flex items-center justify-between border-b-2 py-2 mb-2 pl-2 flex-wrap">
                    <div className="flex items-center">
                        <input
                        type="checkbox"
                        id="allStudents"
                        className="w-4 h-4 cursor-pointer"
                        checked={isChecked}
                        onChange={handleSelectAll}
                        />
                        <label className="mx-2 cursor-pointer" htmlFor="allStudents">All students</label>
                    </div>
                    <input type="text" name="search" id="" placeholder="Search by name" className="border-2 px-2 py-1 text-sm rounded-sm" onChange={(e)=>setSearch(e.target.value)} />
                </div>
                <div className="h-32 overflow-y-auto">
                    {students.filter((user)=> user.fname.toLowerCase().includes(search.toLowerCase())).map((student)=>(
                        <div key={student.id_user} className="flex items-center py-2 hover:bg-gray-200 pl-2 cursor-pointer" onClick={() => handleSelectStudent(student.id_user)}>
                            <input
                                type="checkbox"
                                name={student.fname}
                                className="w-4 h-4"
                                checked={selectedStudents.includes(student.id_user)}
                                onChange={() => handleSelectStudent(student.id_user)}
                            />
                            <div className="mx-2 p-1 rounded-full border-2"><FaUser className="w-4 h-4" /></div>
                            <div className="line-clamp-1">{student.fname +" "+student.lname}</div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-end" > <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150" onClick={handleDone}>Done</button></div></div>
        </div>
        
        </div>
        </>
    )
}

export default IndividualStudent;