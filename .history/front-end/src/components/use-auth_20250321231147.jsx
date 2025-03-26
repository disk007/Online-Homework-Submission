// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const useAuth = () => {
  const [isLogin, setIsLogin] = useState(null);
  

  const fetchLogin = async () => {
    try {
      const response = await axios.get('/profile', {
        withCredentials: true, // ส่ง cookies ในคำขอ
      });
      const responseData = response.data
      if(responseData.status === 'expired'){
        // window.location.href = '\login'
        setIsLogin(null)
      }
      else{
        setIsLogin(responseData);
      } 
    } catch (error) {
      console.error("Error fetching login data:", error);
      setIsLogin(null); // จัดการกรณีเกิดข้อผิดพลาด
    }
  };
  useEffect(() => {
    fetchLogin();
  }, []);
  console.log("isLogin ",isLogin)
  return isLogin;
};

export default useAuth;
