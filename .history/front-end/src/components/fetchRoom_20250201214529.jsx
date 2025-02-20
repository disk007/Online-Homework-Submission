import { useState, useEffect } from "react";
import axios from "axios";

const fetchRoom = (userId,role) => {
    const [joinedClassroom, setJoinedClassroom] = useState([]);
    const fetchRoom = async () => {
        let response
        if(role === 'student'){
            response = await axios.get(`/joined-classroom/${data.id}`);
        }
        else if(role === 'teacher'){
            response = await axios.get(`/add-classroom/${data.id}`);
        } 
        
        const responseData = response.data; 
        setCreateClassroom(responseData);
    }
    // const fetchJoinedRoom = async () => {
    //     const 
    //     const responseData = response.data; 
    //     setJoinedClassroom(responseData);
    // }
    useEffect(() => {
        fetchRoom()
    }, [userId]);

    return { joinedClassroom, loading, error };
};

export default fetchRoom;
