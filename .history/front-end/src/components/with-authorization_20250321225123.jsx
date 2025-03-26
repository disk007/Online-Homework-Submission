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
            const timer = setTimeout(() => {
              setTimeoutReached(true); // อัปเดตสถานะหากรอครบ 10 วินาที
            }, 10000);
      
            return () => clearTimeout(timer);
        },[isLogin, classroomId]);
        console.log("timeoutReached ",timeoutReached)
        if (timeoutReached === true && isLogin === null) {
          // หากเวลาผ่านไป 5 วินาทีให้ไปหน้า login
          return <Navigate to="/login" />;
        }
        if(isLogin === null && timeoutReached === false){
          return(
            <div className='ml-[5.5rem] md:ml-[10.5rem] ml-[8.5rem] flex justify-center items-center fixed inset-0'>
              <ClipLoader color="#1D7AE5"  size={50} />
            </div>
          )
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