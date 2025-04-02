import React,{useState,useEffect} from "react";
import { RxCross2 } from "react-icons/rx";
import CreateGroup from "./create-group";
import DisplayGroup from "./display-group";
import Edit_group from "./edit-group";
import MenuGroup from "./menu-group";
import Select_students_group from "./select-students-group";
import axios from './axios-instance';
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
    const goToEditGroup= () => setCurrentPage(4);
    const [dataRememberGroup,setDataRememberGroup] = useState([])
    const [rememberGroup,setRememberGroup] = useState(false)
    // const goToAddMembers = () => setCurrentPage(4);
    const [stateError,setStateError] = useState(true)

    const title = [
        {id : 1, title: 'Menu Group'},
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
    const fetchRememberGroup = async () => {
        try{
            const response = await axios.get(`/remember-groups/${classroomId}`)
            const responseData = response.data 
            setDataRememberGroup(responseData)
        }
        catch (error) {
            console.error('Error :', error);
        }
    }
    useEffect(() => {
        fetchRememberGroup()
    }, [])
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
    const menuGroup = {
        goToNextPage,
        setCurrentPage,
        dataRememberGroup: dataRememberGroup,
        student: student,
        setStudent: setStudent,
        setGroups:setGroups,
        // groups: groups,
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
                        <MenuGroup 
                            menuGroup={menuGroup}
                        />
                    }
                    {currentPage === 2 && 
                        <CreateGroup 
                            create_group={create_group}
                        />
                    }
                    {currentPage === 3 &&
                    <>
                        <DisplayGroup 
                            displayGroup={displayGroup}
                        />
                    </>
                    }
                    {currentPage === 4 && (
                        <Edit_group 
                            edit_group = {edit_group}
                        />
                    )}

                    {currentPage === 5 && (
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