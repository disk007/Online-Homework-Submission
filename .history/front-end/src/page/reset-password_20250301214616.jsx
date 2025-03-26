import axios from "axios";
import React,{useState,useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const [error,setErrors] = useState({})
    const { token } = useParams();
    const [isValid, setIsValid] = useState(null);
    const [passwords,setPasswords] = useState({
        new:'',
        con:''
    })
    const verifyToken = async () => {
        if(token !== null){
            const formData = new FormData()
            formData.append('token', token)
            const response = await axios.get('/verifyTokenPass',formData,{
                headers: {'Content-Type': 'application/json'}
            })
            const responseData = response.data
            setIsValid(responseData.valid)
        }
    };
    useEffect(() => {
        verifyToken();
    }, [token]);
    const ChangePass = (e) => {
        setPasswords({...passwords,[e.target.name]:e.target.value})
    }
    const resetPass = async(e) => {
        try {
            e.preventDefault()
            let isValid = true
            let validation = {}
            if(!passwords.new.trim()){
                isValid = false
                validation.new = 'New password is required.'
            }
            else if (passwords.new.length < 5) {
                validation.new = 'Must be more than 5 characters.'
                isValid = false
            }
            else if (passwords.new !== passwords.con){
                validation.new = 'Password is not match.'
                isValid = false
            }
            if(!passwords.con.trim()){
                isValid = false
                validation.con = 'Confirm password is required.'
            }
            else if (passwords.con.length < 5) {
                validation.con = 'Must be more than 5 characters.'
                isValid = false
            }
            if(isValid){
                setErrors({})
                const formData = new FormData()
                formData.append('newPassword', passwords.new)
            }
            else{
                setErrors(validation)
            }
        } catch (error) {
            console.error(error)
        }
        
    }
    console.log("token ",token)
    // if (isValid === false) {
    //     return <p>Invalid or expired token. Please request a new password reset link.</p>;
    // }

    // if (isValid === null) {
    //     return <p>Checking token...</p>;
    // }
    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <div className="text-2xl font-semibold mb-5 text-center">Reset password</div>
                    <div>Password {token}</div>
                    <div className="w-full mb-3">
                        <input type="password" className="px-2 py-2 border-2 w-full" name="new" id="new" onChange={ChangePass} />
                        <div className={`h-2 ${error.new && "text-red-500 text-xs"} `}>{error.new}</div>
                    </div>
                    <div>Confirm password</div>
                    <div className="w-full mb-3">
                        <input type="password" className="px-2 py-2 border-2 w-full" name="con" id="con" onChange={ChangePass} />
                        <div className={`h-2 ${error.con && "text-red-500 text-xs"} `}>{error.con}</div>
                    </div>
                    <div className="w-full mb-2"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150" onClick={resetPass}>Reset</button></div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;