import './App.css';
import './font.css'
import React,{ useState,useEffect } from 'react';
import axios from 'axios';
import { BrowserRouter , Routes, Route,Navigate} from "react-router-dom";
import Classroom from './page/classroom';
import All_upComming from './page/all-upComming';
import All_past_due from './page/all-past-due';
import All_completed from './page/all-completed';
import Activity from './page/activity';
import Post from './page/post';
import UpComming from './page/upComming';
import Past_due from './page/past-due';
import Completed from './page/completed';
import Login from './page/login';
import Register from './page/register';
import Member from './page/member';
import List_assignments from './page/list-assignments';
import Detali_assignment from './page/detail-assignment'
import VarifiedAssignment from './page/varified-assignment';
import RegisterTeacher from './page/register-teacher';
import Full_send_work from './page/full-send-work';
import SendWork from './page/send-work';
import Navbar from './components/navbar';
import Sidebar from './components/sidebar';
import {AuthProvider,useAuth} from './components/use-auth';
import PageNotFound from './page/not-found';

function Layout({ children, isLogin }) {
  return (
    <>
      <Navbar isLogin={isLogin} />
      <Sidebar isLogin={isLogin} />
      <main>{children}</main>
    </>
  );
}
function NotFound() {
  return (
    <div className="flex items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
    </div>
  );
}
function App() {
  
  const isLogin = useAuth();
  return (
    <>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout isLogin={isLogin}><Classroom isLogin={isLogin} /></Layout>} />
          <Route path="/assignments/all-upcomming" element={<Layout isLogin={isLogin}><All_upComming isLogin={isLogin} /></Layout>} />
          <Route path="/assignments/send-work/:workId" element={<Layout isLogin={isLogin}><Full_send_work isLogin={isLogin} /></Layout>} />
          <Route path="/assignments/all-past-due" element={<Layout isLogin={isLogin}><All_past_due isLogin={isLogin} /></Layout>} />
          <Route path="/assignments/all-completed" element={<Layout isLogin={isLogin}><All_completed isLogin={isLogin} /></Layout>} />
          <Route path="/activity" element={<Layout isLogin={isLogin}><Activity isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/post/:classroomId" element={<Layout isLogin={isLogin}><Post isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/list-assignments/:classroomId" element={<Layout isLogin={isLogin}><List_assignments isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/detail-assignment/:classroomId/:assignmentId" element={<Layout isLogin={isLogin}><Detali_assignment isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/verified-assignment/:classroomId/:assignmentId" element={<Layout isLogin={isLogin}><VarifiedAssignment isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/up-comming/:classroomId" element={<Layout isLogin={isLogin}><UpComming isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/past-due/:classroomId" element={<Layout isLogin={isLogin}><Past_due isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/completed/:classroomId" element={<Layout isLogin={isLogin}><Completed isLogin={isLogin} /></Layout>} />
          <Route path="/detail-classroom/send-work/:classroomId/:workId" element={<Layout isLogin={isLogin}><SendWork isLogin={isLogin} /></Layout>} />
          <Route path="/login" element={<Login isLogin={isLogin} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-teacher" element={<RegisterTeacher />} />
          <Route path='/not-found' element={<PageNotFound />} />
          <Route path="/detail-classroom/member/:classroomId" element={<Layout isLogin={isLogin}><Member isLogin={isLogin} /></Layout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;
