import React,{useState} from "react";

const ResetPassword = () => {
    const [error,setError] = useState({})
    const [passwords,setPasswords] = useState({
        new:'',
        con:''
    })
    return(
        <>
            <div className="fixed inset-0 flex justify-center items-center">
                <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
                    <div className="text-2xl font-semibold mb-5 text-center">Reset password</div>
                    <div>Password</div>
                    <div className="w-full mb-3">
                        <input type="password" name="email" id="email" className="px-2 py-2 border-2 w-full"  />
                        <div className={`h-2 ${error.new && "text-red-500 text-xs"} `}>{error.new}</div>
                    </div>
                    <div>Confirm password</div>
                    <div className="w-full mb-3">
                        <input type="password" name="email" id="email" className="px-2 py-2 border-2 w-full"  />
                        <div className={`h-2 ${error.con && "text-red-500 text-xs"} `}>{error.con}</div>
                    </div>
                    <div className="w-full mb-2"><button className="py-2 bg-sky-500 w-full text-white hover:bg-sky-600 text-lg transition ease-in-out delay-150" >Reset</button></div>
                </div>
            </div>
        </>
    )
}

export default ResetPassword;