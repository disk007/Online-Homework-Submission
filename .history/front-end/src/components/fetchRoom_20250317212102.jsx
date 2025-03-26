import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ userId, role, children }) => {
    const [dataRoom, setDataRoom] = useState([]);
    

    const fetchRoom = async () => {
        let response;
        if (role === "student") {
            response = await axios.get(`/joined-classroom/${userId}`);
            setDataRoom(response.data);
        } else if (role === "teacher") {
            response = await axios.get(`/add-classroom/${userId}`);
            setDataRoom(response.data);
        } else if (role === "admin"){
            response = await axios.get(`/all-classroom/${userId}`);
            setDataRoom(response.data);
        }
        
        
    };

    useEffect(() => {
        fetchRoom();
    }, [userId]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
