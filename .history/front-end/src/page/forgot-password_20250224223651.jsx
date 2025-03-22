import React,{useState,useEffect} from "react";

const ForgotPassword = () => {
    const [email,setEmail] = useState('')
    const [error,setError] = useState('')
    const sendEmail = async () => {
        try {
            if(email.)
        } catch (error) {
            
        }
    }
    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <div className="text-2xl font-semibold mb-5">Forgot password</div>
                    <div>Email</div>
                    <div className="w-full mb-2">
                        <input type="text" name="email" id="email" className="px-2 py-2 border-2 w-full"  value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <div className={`h-2 ${error && "text-red-500 text-xs"} `}>{error}</div>
                    </div>
                    <div className="w-full mb-2"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150" onClick={sendEmail}>Send</button></div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword;