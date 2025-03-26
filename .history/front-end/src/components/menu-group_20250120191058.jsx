import React,{useState,useEffect} from "react";

const MenuGroup = ({menuGroup}) => {
    const {
        goToNextPage,
        setCurrentPage,
        dataRememberGroup,
        student,
        setGroups,
        groups
    } = menuGroup;
    const [matchedUsers,setMatchedUsers] = useState([])
    const handleRememberGroup = () => {
        const filtered = student.filter(st =>
            dataRememberGroup.some(group => st.id_user === group.id_user)
        );
    
        setGroups(prevGroups => [
            ...prevGroups, // เก็บกลุ่มเดิมไว้
            {
                id: prevGroups.length + 1, // สร้าง ID ใหม่
                name: student.filter(st =>dataRememberGroup.some(group => st.id_user === group.id_user)), // ตั้งชื่อกลุ่มใหม่
                members: student.filter(st =>dataRememberGroup.some(group => st.id_user === group.id_user)) // เพิ่มสมาชิกที่ผ่านการกรอง
            }
        ]);
    };
    // useEffect(()=> {
        console.log("group"+groups.length)
    // },[matchedUsers])
    useEffect(() => {
        if (groups.length > 0) {
            setCurrentPage(3);
        }
    }, [groups]); // ติดตามการเปลี่ยนแปลงใน groups
    
    
    
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