import { useState, useEffect } from "react";
import axios from "axios";

const useFetchRoom = (userId,role) => {
    const [dataRoom, setDataRoom] = useState([]);
    const fetchroom = useCallback(async () => {
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
    }, [userId]);
    useEffect(() => {
        fetchroom()
    }, [fetchroom]);

    return { dataRoom,fetchroom };
};

export default useFetchRoom;
