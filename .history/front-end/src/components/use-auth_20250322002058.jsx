// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const useAuth = () => {
  const [isLogin, setIsLogin] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchLogin = async () => {
    try {
      const response = await axios.get('/profile', {
        withCredentials: true, // ส่ง cookies ในคำขอ
      });
      const responseData = response.data 
      setIsLogin(responseData);
    } catch (error) {
      console.error("Error fetching login data:", error);
      setIsLogin(null); // จัดการกรณีเกิดข้อผิดพลาด
    }
  };
  useEffect(() => {
    fetchLogin();
  }, []);
  return isLogin;
};

export default useAuth;
