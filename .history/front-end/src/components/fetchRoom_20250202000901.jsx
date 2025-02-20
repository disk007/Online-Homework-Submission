import { useState, useEffect } from "react";
import axios from "axios";

const useFetchRoom = (userId,role) => {
    const [dataRoom, setDataRoom] = useState([]);
    const fetchroom = async () => {
        let response
        if(role === 'student'){
            response = await axios.get(`/joined-classroom/${userId}`);
        }
        else if(role === 'teacher'){
            response = await axios.get(`/add-classroom/${userId}`);
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

    return { dataRoom,fetchroom };
};

export default useFetchRoom;

import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const RoomContext = createContext();

export const RoomProvider = ({ userId, role}) => {
    const [dataRoom, setDataRoom] = useState([]);

    const fetchroom = async () => {
        try {
            let response;
            if (role === "student") {
                response = await axios.get(`/joined-classroom/${userId}`);
            } else if (role === "teacher") {
                response = await axios.get(`/add-classroom/${userId}`);
            }
            setDataRoom(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    useEffect(() => {
        fetchroom();
    }, [userId]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchroom }}>
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    return useContext(RoomContext);
};
