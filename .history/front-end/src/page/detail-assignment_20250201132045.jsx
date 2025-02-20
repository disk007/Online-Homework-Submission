import React,{useState,useEffect} from "react";
import SidebarClassroom from "../components/sidebar-classroom";
import CheckDetailAssignment from "../components/check-detail-assignment";
import { useParams,useNavigate,useLocation} from "react-router-dom";
import axios from "axios";
import DetailWorks from "../components/detail-works";

const Detali_assignment = ({isLogin}) => {
    const [sidebar,setSidebar] = useState(false)
    const { assignmentId,classroomId } = useParams()
    
    
    return (
        <>
            {/* <ToastContainer /> */}
            <SidebarClassroom sidebar={sidebar} setSidebar={setSidebar}/>
            <DetailWorks isLogin={isLogin} assignmentId={assignmentId} classroomId={classroomId} sidebar={sidebar} setSidebar={setSidebar}  />
            {/* <ModelEditAssignment assignmentId={assignmentId}  isLogin={isLogin} open={openEdit} OnClose={()=>setOpenEdit(false)} /> */}
            {/* { selectFile && 
                (
                    <ModelFile
                        open={openFile}
                        onClose={() => setOpenFile(false)}
                        file={selectFile?.url} // ใช้ URL ที่สร้างไว้
                        type={selectFile?.type}
                        download={selectFile?.name}
                    />
                )
            }  */}
            {/* <div className={`ml-[6rem] md:ml-[8rem] lg:ml-[26rem] mb-4 ${sidebar ? 'opacity-10 pointer-events-none' : ''}` }>
                <div className={`flex pl-5 md:text-lg md:font-medium bg-gray-100 border-b-2  py-3 sticky md:top-[67px] top-[59px] items-center `}>
                    <div className="lg:mx-1 mx-0 block lg:hidden" onClick={()=>setSidebar(!sidebar)} ><div className="p-1"><GiHamburgerMenu className="h-5 w-5 text-black cursor-pointer" /></div></div>
                    <div className="lg:mx-1 mx-0" ><div className="hidden lg:block bg-sky-600 rounded p-1"><GoChecklist  className="h-5 w-5 text-white"/></div></div>
                    <div className="px-1">Detail assignment</div>
                </div>
                <div className="py-3 px-5 mt-2 flex flex-wrap items-center justify-center md:text-base text-sm">
                    <div className="flex items-center md:grow">
                        <div className="flex items-center  hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={() => navigate(`/detail-classroom/list-assignments/${classroomId}`)}><IoChevronBackOutline className="h-7 w-7"/>Back</div>
                        <div className=" mx-5 hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={()=>setOpenEdit(!false)}>Edit assignment </div>
                        <div className=" hover:text-sky-600 text-gray-500 cursor-pointer transition ease-in-out delay-150" onClick={()=>{setOpenDelete(!Opendelete)}}>Delete assignment </div>
                    </div>
                    <div className="flex items-center md:mt-0 mt-1">
                        <div className="flex items-center hover:text-green-600 text-green-500 cursor-pointer transition ease-in-out delay-150" onClick={handleExport}><PiMicrosoftExcelLogoFill className="h-7 w-7 text-green-800"/>Export to Excel</div>
                        <div className="ml-5 ">
                        <button 
                            className={`cursor-pointer text-white px-5 py-2 rounded transition ease-in-out delay-150 ${
                                selectedId.length === 0 ? 'bg-gray-300 ' : 'bg-sky-500 hover:bg-sky-600'
                            }`}
                            disabled={selectedId.length === 0} // Disable เมื่อไม่มีการเลือก
                            onClick={handleFeedback}
                        >
                            Return {selectedId.length === 0 ? '': `(${selectedId.length})`}
                        </button>
                        </div>
                    </div>
                </div>
                <div className="text-2xl  pt-2 px-6 mt-3">{detailAssignments[0]?.title}</div>
                <div className="text-gray-500 flex px-6 mb-5">
                    <div className="mr-2">{formattedDate(detailAssignments[0]?.due_time)}</div>
                    <div className="ml-2">{detailAssignments[0]?.colses_time ? 'Close : '+formattedDate(detailAssignments[0]?.colses_time):''}</div>
                </div>
                <hr />
                <div>
                    <div className="flex md:flex-row flex-col justify-center md:justify-between items-center px-6 py-2 ">
                        <div className="flex justify-center md:mb-0 mb-2">
                            <div className={`inline-block mr-3 cursor-pointer hover:font-bold ${sideClass.includes('detail-assignment')?'font-bold' :''}`} onClick={handleLinkToretrun}>
                                <div className="">To returns</div>
                                <div className={`${sideClass.includes('detail-assignment')? 'bg-sky-500 rounded':''} h-1 `}></div>
                            </div>
                            <div className={`inline-block mr-3 cursor-pointer hover:font-bold ${sideClass.includes('verified-assignment')?'font-bold' :''}`} onClick={handleLinkRetruned}>
                                <div className="">Returned</div>
                                <div className={`${sideClass.includes('verified-assignment')? 'bg-sky-500 rounded':''} h-1 `}></div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <input type="text" name="search" id="search" placeholder="Search by students" className="border-2 px-2 py-2 text-sm rounded-sm w-full md:w-64" onChange={(e)=>setSearch(e.target.value)} />
                        </div>
                    </div>
                </div>
                
                <div className="overflow-x-auto ">
                    <table className="table-auto w-full border-collapse border-spacing-0">
                        <thead>
                        <tr className="border-t-2 border-b-2 text-sm">
                            <th className="py-2 text-center w-10 ">
                                <input type="checkbox" 
                                    className="transform scale-150 mx-2"
                                    checked={selectedId.length === filteredAssignments.length}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Name</span> <div className="flex cursor-pointer " onClick={()=>{sortData('name')}}>{state ==='name' && sortOrder === 'desc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">State</span> <div className="flex cursor-pointer" onClick={()=>{sortData('state')}}>{state ==='state' && sortOrder === 'desc' ? <FaSortUp/> : <FaSortDown  />}</div>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Files</span>
                                </div>
                            </th>
                            <th className="px-4 py-2 text-center">
                                <div className="flex items-center justify-center">
                                    <span className="mx-1">Feedback</span> 
                                </div>
                            </th>
                            {filteredAssignments[0]?.score !== '' && 
                                <th className="px-4 py-2 text-center w-28">
                                    <div className="flex items-center justify-center">
                                        <div className="mr-1">
                                            <input type="text" name="" id="" 
                                                className="text-center w-8 border-2 font-normal text-sm"
                                                value={score} // เชื่อมกับ state
                                                onChange={(e) => handleInputChangeAll(e.target.value)}
                                            />
                                        </div><div> / {filteredAssignments[0]?.score}</div>
                                    </div>
                                </th>
                            } 
                            
                        </tr>
                        </thead>
                        <tbody className="text-xs">
                        {filteredAssignments.map((m,i) => (
                            <tr className="border-t-2 border-b-2 text-xs" key={i}>
                            <td className="py-2 text-center w-10">
                                {assignmentType === 'group' ? (
                                    <>
                                    <input type="checkbox"
                                        name={m.id_group} 
                                        className="transform scale-150 mx-2"
                                        checked={selectedId.includes(m.id_group)}
                                        onChange={() => handleSelectStudent(m.id_group)} 
                                    />
                                    </>
                                ):
                                (
                                    <input type="checkbox"
                                        name={m.id_user} 
                                        className="transform scale-150 mx-2"
                                        checked={selectedId.includes(m.id_user)}
                                        onChange={() => handleSelectStudent(m.id_user)} 
                                    />
                                )
                                }
                                
                            </td>
                            <td className="px-4 py-2 text-center">
                            <div className="flex items-center justify-center">
                                <div className="">
                                    <div className="py-1 flex items-center justify-center">
                                            { assignmentType === 'group' ? <span className="font-bold">{m.group_name}</span> : <span>{m.fname +' '+m.lname}</span>}
                                    </div>
                                    { assignmentType === 'group' && 
                                    m.group_members.split(',').map((g,key) => (
                                        <div key={key} className="flex items-center justify-center my-2"><FaRegUserCircle className="w-4 h-4" /><div className="mx-1">{g}</div></div>
                                    ))
                                    } 
                                </div>
                            </div>
                            </td>
                            <td className="px-4 py-2">
                                <div className="flex items-center justify-center text-sky-600 cursor-default" title={ m.is_submitted === true? formattedDate(m.sent_date): undefined}
>
                                    {m.is_submitted == true  && new Date(m.sent_date) < new Date(m.due_time) && 
                                    <div className="flex md:flex-row flex-col items-center "><FaCheck className="mr-1" /><span className="text-center">Turned in</span></div>
                                    }
                                    {m.is_submitted == true  && new Date(m.sent_date) > new Date(m.due_time) &&
                                    <div className="flex md:flex-row flex-col items-center"><FaCheck className="mr-1" /> <span className="text-center">Turned in late</span></div>
                                    }
                                    {m.is_submitted == false  && 
                                    <div className="flex md:flex-row flex-col items-center ">
                                        <AiOutlineStop className="mr-1" /><span className="text-center">Turned out</span> 
                                    </div>
                                    }
                                </div>
                            </td>
                            <td className="px-4 py-2 ">
                                <div className={`text-[10px] h-32 ${m.work !== null ? 'h-20 overflow-y-auto' : 'h-auto'}`}>
                                    {m.work === null && <div className="text-sky-600 text-center">None</div>}
                                    {m.work && JSON.parse(m.work).map((file,index) => (
                                        
                                        <div className=" flex items-center justify-center mb-2 border-2 " key={index} title={file}>
                                            <div className="px-2 py-2 flex flex-1 cursor-pointer" onClick={()=>{setOpenFile(!openFile);selectFileWork(file,m.id,m.assignment_type === 'group'?'group':null,m.assignment_type === 'group'? m.id_group : m.id_user)}}>
                                                <div className=""><FaFileAlt className="w-4 h-4" /></div>
                                                <div className="">
                                                    <span className="pl-1">{file.length > 30 ? file.substring(0, 25) + "..." : file}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </td>
                            <td className="px-4 py-2 overflow-x-auto">
                                <div className="flex items-center justify-center text-sky-600 feedback cursor-pointer">
                                {openFeed[m.id_user || m.id_group] ? (
                                        <div className="flex items-center py-2">
                                            {assignmentType === 'group' ? (
                                                <textarea name={m.id_group} id={m.id_group} className="border-2 text-black p-1 w-full" rows="5"  onChange={(e) => handleFeedbackChange(m.id_group, e.target.value)} value={feedbackData[m.id_group] || m.feedback || ""} />
                                            ):
                                            (
                                                <textarea name={m.id_user} id={m.id_user} className="border-2 text-black p-1 w-full" rows="5"  onChange={(e) => handleFeedbackChange(m.id_user, e.target.value)} value={feedbackData[m.id_user] || m.feedback || ""} />
                                            )}
                                            
                                        </div>
                                    ):(
                                        <BsChatRightText className="w-5 h-5"  onClick={() => handleToggleFeedback(m.id_user || m.id_group)} />
                                    )}
                                </div>
                            </td>
                            {filteredAssignments[0]?.score !== '' &&
                                <td className="px-4 py-2 text-center w-28 ">
                                    {assignmentType === 'group' ? (
                                        <div className="mr-1">
                                            <input type="text" name="" id="" 
                                                className="text-center w-8 border-2 font-normal text-sm"
                                                value={scores[m.id_group] || ""} // ดึงค่าจาก state
                                                onChange={(e) =>
                                                    handleInputChange(m.id_group, e.target.value)
                                                }
                                            />
                                        </div>  
                                    ):
                                    (
                                        <div className="mr-1">
                                            <input type="text" name="" id="" 
                                                className="text-center w-8 border-2 font-normal text-sm"
                                                value={scores[m.id_user] || ""} // ดึงค่าจาก state
                                                onChange={(e) =>
                                                    handleInputChange(m.id_user, e.target.value)
                                                }
                                            />
                                        </div>  
                                    )}
                                </td>
                            }
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {
                Opendelete && (
                    <div className="fixed inset-0 z-[51] flex justify-center items-center bg-black/20">
                        <div className="bg-white rounded-md p-4 w-[30rem] ">
                            <div className="flex justify-end">
                                <button onClick={()=>{setOpenDelete(!Opendelete)}} className="w-6 h-6 hover:bg-gray-200"><RxCross2 className="w-6 h-6"/></button>
                            </div>
                            <div className='mt-5'>Do you want to delete assignment ?</div>
                            <div className="flex justify-end mb-1 mt-5">
                                <button className=" px-7 py-2  text-gray-400 hover:text-gray-500 border-2 transition ease-in-out delay-150 mr-1" onClick={()=>{setOpenDelete(!Opendelete)}}>Cancel</button>
                                <button className=" px-7 py-2 cursor-pointer hover:bg-sky-600 text-white bg-sky-500 transition ease-in-out delay-150 ml-1" onClick={handleDeleteAssignment}>Yes</button>
                        </div>
                        </div>
                    </div>
                )
            } */}
        </>
    )
}

export default CheckDetailAssignment(Detali_assignment);