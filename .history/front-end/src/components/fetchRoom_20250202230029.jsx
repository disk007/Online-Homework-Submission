import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ isLogin,children }) => {
    const [dataRoom, setDataRoom] = useState([]);
    const {id,role} = isLogin
    

    const fetchRoom = async () => {
        let response;
        if (role === "student") {
            response = await axios.get(`/joined-classroom/${id}`);
        } else if (role === "teacher") {
            response = await axios.get(`/add-classroom/${id}`);
        }
        setDataRoom(response.data);
    };

    useEffect(() => {
        fetchRoom();
    }, [id]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
