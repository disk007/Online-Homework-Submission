import { useState, useEffect } from "react";
import axios from "axios";

const fetchRoom = (userId,role) => {
    const [dataRoom, setDataRoom] = useState([]);
    const fetchroom = async () => {
        let response
        if(role === 'student'){
            response = await axios.get(`/joined-classroom/${data.id}`);
        }
        else if(role === 'teacher'){
            response = await axios.get(`/add-classroom/${data.id}`);
        } 
        const responseData = response.data; 
        setDataRoom(responseData);
    }
    // const fetchJoinedRoom = async () => {
    //     const 
    //     const responseData = response.data; 
    //     setJoinedClassroom(responseData);
    // }
    useEffect(() => {
        fetchroom()
    }, [userId]);

    return { dataRoom, fetchroom };
};

export default fetchRoom;
