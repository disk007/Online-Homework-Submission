import React,{useState,useEffect} from "react";
import withAuthorization from "../components/with-authorization";
import { useParams,useNavigate } from "react-router-dom";

const Full_send_work = () => {
    const { workId } = useParams()
    return(
        <>
            ffff
        </>
    )
}

export default withAuthorization(Full_send_work);