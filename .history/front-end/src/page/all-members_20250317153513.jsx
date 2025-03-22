import axios from "axios";
import React,{useState,useEffect} from "react";

const All_members = () => {
    const [users,setusers] = useState([])
    const [search,setSearch] = useState('')
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
            <div className="flex justify-center md:ml-32 ml-[6rem] md:py-5 py-2 bg-white items-center">
                <div className="w-4/5 py-2 px-3 overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <div>{users.length} users</div>
                        <input type="text" name="search" id="search" placeholder="Search ..." className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64" onChange={(e)=>setSearch(e.target.value)} />
                    </div>
                    <table class="table-auto w-full border-collapse border-spacing-0">
                        <thead>
                            <tr class="border-t-2 border-b-2 text-sm">
                                <th class="px-4 py-2 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="mx-1">No</span> <div className="flex cursor-pointer " ></div>
                                    </div>
                                </th>
                                <th class="px-4 py-2 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="mx-1">Name</span> <div className="flex cursor-pointer " ></div>
                                    </div>
                                </th>
                                <th class="px-4 py-2 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="mx-1">Email</span> <div className="flex cursor-pointer " ></div>
                                    </div>
                                </th>
                                <th class="px-4 py-2 text-center">
                                    <div className="flex items-center justify-center">
                                        <span className="mx-1">Role</span> <div className="flex cursor-pointer " ></div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {users.map((data,i)=>(
                                
                                <tr class="border-t-2 border-b-2 text-xs" key={i}>
                                    <td class="px-4 py-2 text-center">
                                        <div>{i+1}</div>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <div>{data.fname+' '+data.lname}</div>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <div>{data.email}</div>
                                    </td>
                                    <td class="px-4 py-2 text-center">
                                        <div>{data.role}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default All_members