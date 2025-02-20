import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const RoomContext = createContext();

export const RoomProvider = ({ userId, role, children }) => {
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
    }, [userId, role]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchroom }}>
            {children}
        </RoomContext.Provider>
    );
};

export const useRoom = () => {
    return useContext(RoomContext);
};
