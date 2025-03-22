import axios from "axios";
import React,{useState,useEffect} from "react";

const All_members = () => {
    const [users,setusers] = useState([])
    const fetchUsers = async() =>{
        const response = await axios.get('/all-members')
        const responData = response.data
        setusers(responData)
    }
    useEffect(() =>{
        fetchUsers()
    },[])
    return(
        <>
            <div className="flex justify-center md:ml-32 ml-[6rem] md:py-5 py-2 bg-white items-center flex-col">
                <div className="border-2 w-[700px] py-2 px-3">
                    <div className="flex justify-between border-b-2">
                        <table class="table-auto w-full border-collapse border-spacing-0">
                            
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default All_members