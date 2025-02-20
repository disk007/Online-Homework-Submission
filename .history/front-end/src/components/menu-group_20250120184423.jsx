import React,{useState,useEffect} from "react";

const MenuGroup = ({menuGroup}) => {
    const {
        goToNextPage,
        setCurrentPage,
        dataRememberGroup: dataRememberGroup,
        student: student,
        setGroups:setDataGroup,
        groups: groups,
    } = menuGroup;
    const [matchedUsers,setMatchedUsers] = useState([])
    const handleRememberGroup = () => {
        const filtered = student.filter(st =>
            dataRememberGroup.some(group => st.id_user === group.id_user)
        );
        setMatchedUsers(filtered);
    }
    // useEffect(()=> {
        console.log("matchedUsers"+matchedUsers.map((data)=> data.fname))
    // },[matchedUsers])
    useEffect(() => {
        if (matchedUsers.length > 0) {
            setCurrentPage(3); // เปลี่ยนหน้าเมื่อ matchedUsers ถูกอัปเดต
        }
    }, [matchedUsers]);
    
    
    return(
        <>
        <div className="my-5">
            <div className="w-full mb-5">
                <button className="bg-sky-500 w-full py-3 text-white hover:bg-sky-600 border-2" onClick={()=>{handleRememberGroup()}}>Remember group</button>
            </div>
            <div className="w-full">
                <button className="border-gray-300 text-gray-700 border-2 w-full py-3 hover:bg-gray-300" onClick={goToNextPage}>Custom group</button>
            </div>
            
        </div>
        </>
    )
}

export default MenuGroup;