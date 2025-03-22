import axios from "axios";
import React,{useState,useEffect} from "react";

const All_members = () => {
    const [users,setusers] = useState([])
    const [search,setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 1;
    const fetchUsers = async() =>{
        const response = await axios.get('/all-members')
        const responData = response.data
        setusers(responData)
    }
    const filteredUsers = users.filter((d) =>
        d.fname.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (currentPage - 1) * usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, startIndex + usersPerPage);
    const generatePageNumbers = () => {
        let pages = [];
        if (totalPages <= 5) {
            pages = Array.from({ length: totalPages }, (_, i) => i + 1);
        } else {
            if (currentPage > 3) pages.push(1);
            if (currentPage > 4) pages.push("...");
            
            let start = Math.max(2, currentPage - 1);
            let end = Math.min(totalPages - 1, currentPage + 1);
            
            for (let i = start; i <= end; i++) pages.push(i);
            
            if (currentPage < totalPages - 3) pages.push("...");
            if (currentPage < totalPages - 2) pages.push(totalPages);
        }
        return pages;
    };
    useEffect(() =>{
        fetchUsers()
    },[])
    return(
        <>
            <div className="flex justify-center md:ml-32 ml-[6rem] md:py-5 py-2 bg-white items-center">
                <div className="w-4/5 py-2 px-3 overflow-x-auto">
                    <div className="flex justify-between mb-4">
                        <div className="flex items-center">{users.length} users</div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            placeholder="Search ..."
                            className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64"
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setCurrentPage(1); 
                            }}
                        />
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
                            {currentUsers.map((data,i)=>(
                                
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
                    {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {currentPage > 1 && (
                            <button
                                className="px-4 py-2 border rounded-md bg-gray-300"
                                onClick={() => setCurrentPage(currentPage - 1)}
                            >
                                &laquo;
                            </button>
                        )}
                        
                        {generatePageNumbers().map((page, index) => (
                            <button
                                key={index}
                                className={`px-4 py-2 border rounded-md ${currentPage === page ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                onClick={() => typeof page === "number" && setCurrentPage(page)}
                                disabled={page === "..."}
                            >
                                {page}
                            </button>
                        ))}

                        {currentPage < totalPages && (
                            <button
                                className="px-4 py-2 border rounded-md bg-gray-300"
                                onClick={() => setCurrentPage(currentPage + 1)}
                            >
                                &raquo;
                            </button>
                        )}
                    </div>
                )}
                </div>
            </div>
        </>
    )
}

export default All_members