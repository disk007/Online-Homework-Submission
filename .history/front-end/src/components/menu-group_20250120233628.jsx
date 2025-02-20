import React,{useState,useEffect} from "react";

const MenuGroup = ({menuGroup}) => {
    const {
        goToNextPage,
        setCurrentPage,
        dataRememberGroup,
        student,
        setStudent,
        setGroups,
    } = menuGroup;
    // const [matchedUsers,setMatchedUsers] = useState([])
    const handleRememberGroup = () => {
        // กรองสมาชิกใน student ที่เกี่ยวข้องกับ dataRememberGroup
        const filteredMembers = student.filter(st =>
            dataRememberGroup.some(group => st.id_user === group.id_user)
        );
    
        // จัดกลุ่มสมาชิกตาม id_group
        const groupedByGroupId = dataRememberGroup.reduce((acc, group) => {
            const groupName = group.name; // ใช้ name จาก dataRememberGroup
            if (!acc[group.id_group]) {
                acc[group.id_group] = {
                    id: group.id_group,
                    name: groupName,
                    members: []
                };
            }
    
            // เพิ่มสมาชิกที่ตรงกันในกลุ่ม
            const member = filteredMembers.find(st => st.id_user === group.id_user);
            if (member) {
                acc[group.id_group].members.push(member);
            }
    
            return acc;
        }, {});
    
        // แปลงจาก Object เป็น Array และตั้งค่า groups ใหม่
        const newGroups = Object.values(groupedByGroupId);
    
        setGroups(prevGroups => [...prevGroups, ...newGroups]);
        setStudent(student.filter(st => 
            !dataRememberGroup.some(group => st.id_user === group.id_user)
        ));
        setCurrentPage(3);
    };
    // const ddd = student.filter(st =>dataRememberGroup.some(group => st.id_user !== group.id_user))
    // console.log("dddd "+ddd.map((data) => data.id_user))
    // // useEffect(()=> {
    //     console.log("group"+groups.length)
    // // },[matchedUsers])
    // useEffect(() => {
    //     if (groups.length > 0) {
    //         setCurrentPage(3);
    //     }
    // }, [groups]); // ติดตามการเปลี่ยนแปลงใน groups
    
    
    
    return(
        <>
        <div className="my-5">
            <div className="w-full mb-5">
                {dataRememberGroup.length > 0 &&
                <button className="bg-sky-500 w-full py-3 text-white hover:bg-sky-600 border-2" onClick={()=>{handleRememberGroup()}}>Remember group</button>
                }
                
            </div>
            <div className="w-full">
                <button className="border-gray-300 text-gray-700 border-2 w-full py-3 hover:bg-gray-300" onClick={goToNextPage}>Custom group</button>
            </div>
            
        </div>
        </>
    )
}

export default MenuGroup;