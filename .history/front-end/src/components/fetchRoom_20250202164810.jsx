import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ userId,children }) => {
    const [dataRoom, setDataRoom] = useState([]);

    const fetchRoom = async () => {
        let response;
        if (userId.role === "student") {
            response = await axios.get(`/joined-classroom/${userId?.id}`);
        } else if (userId.role === "teacher") {
            response = await axios.get(`/add-classroom/${userId?.id}`);
        }
        setDataRoom(response.data);
    };

    useEffect(() => {
        fetchRoom();
    }, [userId.id]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
