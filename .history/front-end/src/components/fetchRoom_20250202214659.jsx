import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const RoomContext = createContext();

export const RoomProvider = ({ userId, role, children }) => {
    const [dataRoom, setDataRoom] = useState([]);
    const [forceUpdate, setForceUpdate] = useState(0);

    const fetchRoom = async () => {
        let response;
        if (role === "student") {
            response = await axios.get(`/joined-classroom/${userId}`);
        } else if (role === "teacher") {
            response = await axios.get(`/add-classroom/${userId}`);
        }
        setDataRoom(response.data);
    };

    useEffect(() => {
        fetchRoom();
    }, [userId]);
    useEffect(() => {
        console.log("Updated dataRoom: ", dataRoom);
    }, [dataRoom]);

    return (
        <RoomContext.Provider value={{ dataRoom, fetchRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
