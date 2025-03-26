import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import useAuth from './use-auth';
import ClipLoader from 'react-spinners/ClipLoader';

const withAuthorization = (WrappedComponent) => {

    return ({ ...props }) => {
        const { classroomId } = useParams()
        const isLogin = useAuth()
        const [isAuthorized, setIsAuthorized] = useState(null); // เก็บสถานะการตรวจสอบสิทธิ์
        const [timeoutReached, setTimeoutReached] = useState(false);

        const checkAuthorization = async () => {
            try {
              const response = await axios.post('/check-classroom-access', {
                userId: isLogin.id,
                classroomId: classroomId,
              });
              setIsAuthorized(response.data.isAuthorized);
            } catch (error) {
              console.error('Error checking authorization:', error);
              setIsAuthorized(false);
            }
        };
        useEffect(() => {
            if (isLogin) {
              checkAuthorization();
            }
            // if (isLogin === null && timeoutReached === false) {
            //   const timer = setTimeout(() => {
            //     console.log("🔴 Timeout reached! Redirecting...");
            //     setTimeoutReached(true);
            //   }, 10000);
            //   return () => clearTimeout(timer);
            // }
        },[isLogin, classroomId]);
        console.log("timeoutReached ",timeoutReached)
        // if (timeoutReached === true && isLogin === null) {
        //   // หากเวลาผ่านไป 5 วินาทีให้ไปหน้า login
        //   return <Navigate to="/login" />;
        // }
        if(isLogin === null){
          return <Navigate to="/login" />;
        }
        if(isAuthorized === true){
          return <WrappedComponent {...props} />
        }
        else if (isAuthorized === false) {
          return <Navigate to="/not-found" />;
        }
    }
}
export default withAuthorization