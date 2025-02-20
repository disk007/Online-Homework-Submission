import React,{useState,useEffect} from "react";
import { RxCross2 } from "react-icons/rx";
import CreateGroup from "./create-group";
import DisplayGroup from "./display-group";
import Edit_group from "./edit-group";
import Select_students_group from "./select-students-group";
import axios from "axios";
import {useParams } from "react-router-dom";
const GroupStudents = ({open,OnClose,setDataGroup,state,setStatus,setOpen}) => {
    const [currentPage, setCurrentPage] = useState(1)
    const [groups,setGroups] = useState([])
    const [student,setStudent] = useState([])
    const [resetGroup,setResetGroup] = useState([])
    const [id,setId] = useState(null)
    const { classroomId } = useParams()
    const [exit,setExit] = useState(false)
    const goToNextPage = () => setCurrentPage((prevPage) => prevPage + 1)
    const goToPreviousPage = () => setCurrentPage((prevPage) => prevPage - 1)
    const goToEditGroup= () => setCurrentPage(3);
    // const goToAddMembers = () => setCurrentPage(4);
    const [stateError,setStateError] = useState(true)

    const title = [
        { id: 1, title: 'New Group' },
        { id: 2, title: 'Display group' },
        { id: 3, title: 'Edit group' },
        { id: 4, title: 'Choose students to add' }
    ];

    
    const fetchMembers = async () => {
        try{
            const response = await axios.get(`/members/${classroomId}`)
            const responseData = response.data 
            setStudent(responseData)
            setResetGroup(responseData)
        }
        catch (error) {
            console.error('Error :', error);
        }
        
    }
    useEffect(() => {
        fetchMembers()
    }, [])
    useEffect(()=>{
        setStudent(resetGroup)
        setGroups([])
        setCurrentPage(1)
    },[state])
    
    const handleCancel = () => {
        setGroups([])
        setStudent(resetGroup)
        setCurrentPage(1)
        setDataGroup([])
        setStateError(!stateError)
        OnClose()
        setExit(!exit)
    }
    const create_group = {
        goToNextPage:goToNextPage,
        students:student,
        setStudent: setStudent,
        setGroups:(newGroup) => setGroups([...groups, newGroup]),
        groups: groups,
        stateError,
    }
    const displayGroup = {
        goToPreviousPage,
        GroupStudents: groups,
        setGroups: setGroups,
        resetGroups: resetGroup,
        OnClose,
        students: student,
        setStudent,
        setDataGroup,
        edit_group:goToEditGroup,
        id_group: setId
    }
    const edit_group = {
        GroupStudents: groups,
        id_group: id,
        goToNextPage,
        goToPreviousPage,
        setGroup:setGroups,
        setStudent
    }
    const choose_students =  {
        students:student,
        setCurrentPage,
        goToPreviousPage,
        setGroup:setGroups,
        id_group: id,
        GroupStudents: groups,
        setStudent
    }

    return(
        <>
            <div className={`fixed inset-0 flex justify-center items-center ${open && !exit  ? "visible bg-black/20 z-50" : "invisible"}`}>
                <div className="bg-white rounded-md p-4 w-[30rem] ">
                    <div className="flex justify-between mt-3">
                        <div className="text-lg font-medium">{title[currentPage - 1].title}</div>
                        <button onClick={()=>setExit(!exit)} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                    </div>
                    {currentPage === 1 && 
                        <CreateGroup 
                            create_group={create_group}
                        />
                    }
                    {currentPage === 2 &&
                    <>
                        <DisplayGroup 
                            displayGroup={displayGroup}
                        />
                    </>
                    }
                    {currentPage === 3 && (
                        <Edit_group 
                            edit_group = {edit_group}
                        />
                    )}

                    {currentPage === 4 && (
                        <Select_students_group
                            choose_students = {choose_students}
                        />
                    )}
                </div>
            </div>
            {
                exit && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setExit(!exit);setOpen(true)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you wish to exit group management?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setExit(!exit);setOpen(true)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handleCancel}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            }
        </>
    )
}

export default GroupStudents;