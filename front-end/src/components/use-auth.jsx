// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from './axios-instance';
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  const [isLogin, setIsLogin] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchLogin = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/profile', {
        withCredentials: true, // ส่ง cookies ในคำขอ
      });
      const responseData = response.data
      if(responseData.status === 'success'){
        setIsLogin(responseData);
      }
      setLoading(false) 
      // 
    } catch (error) {
      console.error("Error fetching login data:", error);
      setIsLogin(null); // จัดการกรณีเกิดข้อผิดพลาด
      setLoading(false)
    }

  };
  useEffect(() => {
    fetchLogin();
  }, []);
  return {isLogin,loading}
};

export default useAuth;
