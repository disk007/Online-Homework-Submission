import React from "react";
import { useState,useRef } from "react";

const OTP = () => {
//   const { email, otp, setPage } = useContext(RecoveryContext);
const [otp, setOtp] = useState(new Array(4).fill(""));
const inputsRef = useRef([]);

const handleChange = (e, index) => {
  const value = e.target.value;
  if (isNaN(value)) return; // ให้รับเฉพาะตัวเลข
  const newOtp = [...otp];
  newOtp[index] = value;
  setOtp(newOtp);

  // ถ้ามีการกรอกค่าในช่องนี้แล้ว ให้ focus ช่องถัดไป
  if (value && index < 3) {
    inputsRef.current[index + 1].focus();
  }
};

const handleKeyDown = (e, index) => {
  // ถ้ากด backspace และช่องนี้ว่าง ให้ focus ช่องก่อนหน้า
  if (e.key === "Backspace" && !otp[index] && index > 0) {
    inputsRef.current[index - 1].focus();
  }
};

return (
    <div className="fixed inset-0 flex justify-center items-center">
        <div className="bg-white border-2 px-8 py-12 shadow rounded-md w-[25rem]">
            <div className="text-2xl font-semibold mb-5">Email Verification</div>
        </div>
        <div className="flex flex-row text-sm font-medium text-gray-400">
              <p>We have sent a code to your email</p>
        </div>
        <div>
        {otp.map((data, index) => (
            <input
                key={index}
                type="text"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                ref={(el) => (inputsRef.current[index] = el)}
                className="w-[40px] h-[40px] text-center border-2 rounded"
                style={{
                width: "40px",
                height: "40px",
                textAlign: "center",
                fontSize: "24px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                }}
            />
        ))}
        </div>
    </div>
  );
}

export default OTP
