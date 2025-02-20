import { createContext, useState, useEffect } from "react";
import axios from "axios";
import {Navigate } from "react-router-dom";

export const RoomContext = createContext();


export const RoomProvider = ({ isLogin,children }) => {
    const [dataRoom, setDataRoom] = useState([]);
    useEffect(() => {
        fetchRoom();
    }, [id]);
    if(!isLogin){
        return <Navigate to="/login" />;
    }
    
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

    

    return (
        <RoomContext.Provider value={{ dataRoom, fetchRoom }}>
            {children}
        </RoomContext.Provider>
    );
};
