import React,{useEffect, useState} from "react";
import { RxCross2 } from "react-icons/rx";
import { FaRegCommentAlt,FaFileAlt } from "react-icons/fa";
import 'react-quill/dist/quill.snow.css'; 
import ReactQuill from 'react-quill';
import ModelFile from "../components/model-file";
import { MdOutlineFileUpload } from "react-icons/md";
import axios from "axios";
const ModelEditPost = ({open,onClose,id}) => {
    const modules = {
        toolbar: [
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          ['bold', 'italic', 'underline'],
          [{ 'color': [] }]
        ],
    }
    console.log('Modules loaded')
    const [dataPost,setDataPost] = useState({})
    const [errorPost,setErrorpost] = useState('')
    const [fileNames,setFileNames] = useState([])
    const [openFile,setOpenFile] = useState(false)
    const [selectFile,setSelectFile] = useState(null)
    const isContentValid = (value) => {
        const plainText = (value || "").replace(/<[^>]+>/g, '').trim(); // ลบ HTML tags และ trim ช่องว่าง
        return plainText !== ""; // ตรวจสอบว่าไม่ใช่ข้อความว่าง
    };
    const fetchPost = async() => {
        try{
            const response = await axios.get(`/data-post/${id}`)
            const responseData = response.data;
            setDataPost(responseData)
        } catch (error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        fetchPost()
    },[id])
    const handleQuillChange = (value) => {
        setDataPost({...dataPost,message:value})
    };
    const updatePost = async() => {
        let sizeFiles = 0
        let isValid = true
        const data = new FormData()
        const MAX_FILE_SIZE = 10 * 1024 * 1024;
        if(!isContentValid(String(dataPost.message || ''))) {
            setErrorpost('Post is required.')
            isValid = false
        }
        // if(fileNames.length > 0){
        //     fileNames.forEach((f,index)=>{
        //         data.append(`file[${index}]`,f.file)
        //         data.append(`fileName[${index}]`,f.name)
        //         sizeFiles += f.file.size
        //     })
        // }
        // else{
        //     data.append('fileName',null)
        // }
        // if(sizeFiles > MAX_FILE_SIZE){
        //     isValid = false
        //     setErrorpost('File size is too large. Maximum 10MB.')
        // }
        if(isValid){
            data.append('date',new Date())
            // const response = await axios.post('/add-post',data,{
            //     headers: {'Content-Type': 'multipart/form-data'}
            // });
            // const responseData = response.data;
            // if (responseData.status ==='success') {
            //     setErrorpost('')
            //     setValuePost('')
            //     setFileNames([])
            // }
            
        }
    }
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map((file) => {
            let fileName = file.name;
            let baseName = fileName;
            let extension = '';
            const dotIndex = fileName.lastIndexOf('.');
            if (dotIndex > -1) {
                baseName = fileName.substring(0, dotIndex);
                extension = fileName.substring(dotIndex);
            }
            let count = 1;
            while (fileNames.some((f) => f.name === fileName)) {
                fileName = `${baseName}(${count})${extension}`;
                count++;
            }
            const mimeType = file.type
            return {
                file,
                name: fileName,
                url: file, // สร้าง URL ที่นี่
                type:mimeType
            };
        });
    
        setFileNames((prevFiles) => [...prevFiles, ...newFiles]);
        e.target.value = '';
    };
    const handleDelete = (fileName) => {
        setFileNames(prevFileNames => prevFileNames.filter(file => file.name !== fileName))
    }
    const handleSelectFile = (file,type) => {
        setSelectFile({url:file, type:type});
    }
    const selectFileName = async (n,id) => {
        // setFileName(n)
        try {
            const encodedFileName = encodeURIComponent(n);
            // setFileName(pathFile)
            const response = await axios.get(`/post/${id}/${encodedFileName}`, { 
              responseType: 'arraybuffer'
            });
        
            const mimeType = response.headers['content-type'];
            const blob = new Blob([response.data], { type: mimeType });
            const blobWithName = { blob, name: n};
            handleSelectFileWork(blobWithName,mimeType)
          } catch (error) {
            console.error('Error fetching file:', error);
          }
    }
    const handleSelectFileWork = (file,type) => {
        const { blob, name } = file;
        setSelectFile({ url: blob, type: type, name: name });
    }
    const deleteFile = async (name,id_work) => {
        try {
            const data = new FormData()
            data.append('id_work',id_work)
            data.append('fileName',name)
            // const response = await axios.post('/delete-sheet',data,{
            //     headers: {'Content-Type': 'application/json'}
            // });
            // const responseData = response.data;
            // if (responseData.status ==='success') {
            //     await fetchdataAssignment()
            // }
        } catch (error) {
            console.log(error)
        }
    }
    return(
        <>  
            { selectFile && 
                (
                    <ModelFile
                        open={openFile}
                        onClose={() => setOpenFile(false)}
                        file={selectFile?.url} // ใช้ URL ที่สร้างไว้
                        type={selectFile?.type}
                    />
                )
            }
            <div className={`fixed inset-0 flex justify-center items-center  ${open ? "visible bg-black/20 z-40" : "invisible"}`}>
            <div className="bg-white rounded-md w-[600px] overflow-y-auto">
                <div className="flex justify-between text-xl mb-2 border-b-2 p-4">
                    <div className="flex items-center"><FaRegCommentAlt /><div className="ml-1">Edit Post {id}</div></div>
                    <div onClick={onClose} className="w-6 h-6 hover:bg-gray-200 cursor-pointer"><RxCross2 className="w-6 h-6"/></div>
                </div>
                <div className="flex mx-4 my-5 ">
                    <div className="w-full">
                        <ReactQuill 
                            theme="snow" 
                            value={dataPost.message} 
                            onChange={()=>handleQuillChange} 
                            modules={modules} 
                            placeholder="Add a personal opinion"
                            
                        />
                    </div>
                </div>
                <div className="px-4 mt-3">
                    {fileNames.length > 0 && (
                            <div className="flex flex-wrap text-xs">
                                {fileNames.map((f, index) => (
                                    <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f.name}>
                                        <button
                                            className="px-2 py-2 flex flex-1"
                                            onClick={() => {setOpenFile(!openFile); handleSelectFile(f.url,f.type)}}
                                        >
                                            <div>
                                                <FaFileAlt className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="pl-1">
                                                    {f.name.length > 20 ? f.name.substring(0, 20) + "..." : f.name}
                                                </span>
                                            </div>
                                        </button>
                                        <div className="flex">
                                            <button className="pr-1" onClick={() => handleDelete(f.name)}>
                                                <RxCross2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                        )}
                        {dataPost.file && (
                            <div className="flex flex-wrap text-xs">
                                {JSON.parse(dataPost.file).map((f, index) => (
                                    <div key={index} className="flex items-center mb-2 border-2 w-60 mr-2" title={f}>
                                        <button
                                            className="px-2 py-2 flex flex-1"
                                            onClick={() => {setOpenFile(!openFile); selectFileName(f,dataPost.id)}}
                                        >
                                            <div>
                                                <FaFileAlt className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <span className="pl-1">
                                                {f.length > 20  ? f.substring(0, 20) + '...' : f}
                                                </span>
                                            </div>
                                        </button>
                                        <div className="flex">
                                            <button className="pr-1" onClick={() => deleteFile(f,dataPost.id)}>
                                                <RxCross2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="pb-4 px-4 mt-2 flex justify-between items-center">
                        <div className="border-2 inline-block p-1 rounded-full hover:bg-gray-300">
                            <input type="file" className="hidden" id="file" multiple onChange={handleFileChange}  accept="application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,image/png,image/jpeg"/>
                            <label htmlFor="file" className="cursor-pointer"><MdOutlineFileUpload className="w-8 h-8" /></label>
                        </div>
                        <div className="ml-2"><button className="border-2 py-2 px-8 w-full mt-3 text-white border-sky-500 hover:border-sky-600 bg-sky-500 hover:bg-sky-600 transition ease-in-out delay-150" onClick={updatePost}>Update</button></div>
                    </div>
                    {errorPost && <div className="mt-1 px-4 pb-3 text-sm text-red-500">{errorPost}</div>}
                
            </div>
            </div>
        </>
    )
}

export default ModelEditPost;