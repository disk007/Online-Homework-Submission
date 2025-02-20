import React,{useState} from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { MdOutlineArrowDropDown,MdArrowDropUp  } from "react-icons/md";
import { ToastContainer, toast,Slide } from 'react-toastify';
import '../../node_modules/react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';


const Register = () => {
    const navigate = useNavigate();
    const [formData,setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        confirmPassword: '',
        // status: 'Student'
    })
    const [errors,setErrors] = useState({})
    const handleChange = (e) => {
        setFormData({...formData,[e.target.name]:e.target.value})
    }
    const [status,setStatus] = useState('Student')
    const [open,setOpen] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        let isValid = true
        let validation = {}
        if(!formData.fname.trim()){
            isValid = false
            validation.fname = 'Firstname is required.'
        }
        else if (/[^a-zA-Z]/.test(formData.fname)){
            isValid = false
            validation.fname = 'Firstname should contain only letters.'
        }
        if(!formData.lname.trim()){
            isValid = false
            validation.lname = 'Lastname is required.'
        }
        else if (/[^a-zA-Z]/.test(formData.lname)){
            isValid = false
            validation.lname = 'Lastname should contain only letters.'
        }
        if(!formData.email.trim()){
            isValid = false
            validation.email =  'Email is required.'
        }
        else if(!/\S+@\S+\.\S+/.test(formData.email)){
            validation.email = "Email is not valid."
        }
        if (!formData.password.trim()) {
            validation.password = 'Password is required.'
            isValid = false

        } 
        else if (formData.password.length < 5) {
            validation.password = 'Must be more than 5 characters.'
            isValid = false
        }
        else if (formData.password !== formData.confirmPassword) {
            validation.password = 'Password is not match.'
            isValid = false
        }
        if (!formData.confirmPassword.trim()) {
            validation.confirmPassword = 'Confirm password is required.'
            isValid = false
        }
        if(isValid){
            const response = await axios.post('/register', formData)
            const responseData = response.data;
            if(responseData.status === 'success'){
                toast.success('Register successfully!', {
                    position: "bottom-right",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                    onClose: () => navigate('/login'),
                })
            }
            else if(responseData.status === 'warning'){
                toast.warning(responseData.message, {
                    position: "bottom-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                    transition: Slide,
                })
            }
            // setFormData({fname: '',lname: '', email: '',username:'', password: '', confirmPassword: '', /*status: 'Student'*/})
            setErrors({})
        }
        else{
            setErrors(validation)
        }
    }

    const handleStatus = (e) => {
        setStatus(e)
        setOpen(false)
        setFormData({...formData, status: e})
    }

    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center overflow-y-auto">
                <ToastContainer/>
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[42rem]">
                    <div className="text-4xl font-semibold text-center mb-5">Register</div>
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-full mr-2 ">
                                <div>Firstname</div>
                                <div className=""><input type="text" name="fname" id="" className="px-2 py-2 border-2 w-full" value={formData.fname} onChange={handleChange} /></div>
                                <div className={`h-2 ${errors.fname && "text-red-500 text-xs"} `}>{errors.fname}</div>
                            </div>
                            <div className="w-full ml-2 ">
                                <div>Lastname</div>
                                <div className=""><input type="text" name="lname" id="" className="px-2 py-2 border-2 w-full" value={formData.lname} onChange={handleChange} /></div>
                                <div className={`h-2 ${errors.lname && "text-red-500 text-xs"} `}>{errors.lname}</div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center mb-3">
                            <div className="w-full">
                                <div>Email</div>
                                <div className="w-full "><input type="text" name="email" id="" className="px-2 py-2 border-2 w-full" value={formData.email} onChange={handleChange} /></div>
                                <div className={`h-2 ${errors.email && "text-red-500 text-xs"} `}>{errors.email}</div>
                            </div>
                            {/* <div className="w-full ml-2 relative">
                                <div>Status</div>
                                <div className="cursor-pointer border-2 px-2 py-2 flex items-center justify-between" onClick={()=>setOpen(!open)}><div>{status}</div>{ open ?(<MdArrowDropUp/>):(<MdOutlineArrowDropDown/>)}</div>
                                {open &&(
                                    <ul className="absolute left-0 w-full border-2 bg-white z-10">
                                        <li
                                        className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleStatus('Student')}
                                        >
                                        Student
                                        </li>
                                        <li
                                        className="px-2 py-2 hover:bg-gray-200 cursor-pointer"
                                        onClick={() => handleStatus('Teacher')}
                                        >
                                        Teacher
                                        </li>
                                    </ul>
                                )}
                                <div className={`h-2 `}></div>
                            </div> */}
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <div className="w-full mr-2">
                                <div>Password</div>
                                <div ><input type="password" name="password" id="" className="px-2 py-2 border-2 w-full" value={formData.password} onChange={handleChange} /></div> 
                                <div className={`h-2 ${errors.password && "text-red-500 text-xs"} `}>{errors.password}</div>
                            </div>
                            <div className="w-full ml-2">
                                <div>Confirm password</div>
                                <div ><input type="password" name="confirmPassword" id="" className="px-2 py-2 border-2 w-full" value={formData.confirmPassword} onChange={handleChange} /></div>
                                <div className={`h-2 ${errors.confirmPassword && "text-red-500 text-xs"} `}>{errors.confirmPassword}</div>
                            </div>  
                        </div>
                        <div className="w-full mb-3"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150">Register</button></div>
                        <div className="w-full text-center">Already have an account? <Link to={'/login'} className="font-semibold hover:text-sky-600 transition ease-in-out delay-150">Login</Link></div>
                    </form>
                </div>
            </div>

        </>
    )
}

export default Register 