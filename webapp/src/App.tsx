import { BrowserRouter as Router, Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { Main as Admin } from './admin/main';
import { Main as Teacher } from './teacher/main';
import { Main as Student } from './student/main';
import Create_admin_sheet from './admin/sheet/create_sheet_main';
import React, { useEffect, useState, } from 'react';
import Signup from './authentication/signup';
import Login from './authentication/login';
import Forget_password from './authentication/forget_password';
import { Upload_Img } from './teacher/example';
import Take_Attendence from "./teacher/Take_attendence";
import Add_Attendence_Sheet from "./teacher/Add_Attendence_Sheet";
import { Sheet_invalid } from "./authentication/sheetinvalid";
import { main_screen as Overview } from "./overview/main_screen";
import ChangePassword from './authentication/change_password';
import { Privacy_policy } from './overview/privacy_policy';

const App: React.FC = () => {

  //set all local storage item in session
  useEffect(() => {
    const obj = localStorage.getItem('User_data');
    console.log('obj', obj)
    if (obj) {
      const user_data: { user: string, username: string, token: string, email: string } = JSON.parse(obj);
      sessionStorage.setItem('token', user_data.token)
      sessionStorage.setItem('user', user_data.user);
      sessionStorage.setItem('username', user_data.username);//unique name to get admin info from my sheet
      sessionStorage.setItem('email', user_data.email);
      if (user_data.user !== 'student')
        sessionStorage.setItem('LAST_SYNC_TIME', `${user_data.email}_${user_data.user}_LAST_SYNC_TIME_Data`)
      if (user_data.user === 'admin') {
        //key , we get data from localstorage by key
        sessionStorage.setItem('student_data_key', `${user_data.email}_Student_Data`)
        sessionStorage.setItem('teacher_data_key', `${user_data.email}_Teacher_Data`)

      }
      else if (user_data.user === 'teacher') {
        //key , we get data from localstorage by key
        sessionStorage.setItem('student_imgs_key', `${user_data.email}_Student_Img_Data`)
        sessionStorage.setItem('subject_names_key', `${user_data.email}_Subject_Name_Data`)

      }
    }
  }, [])


  return (
    <Router>
      <Routes >

        {/* for admin 
      */}
        <Route path="/privacy-policy" element={<Privacy_policy />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget_password" element={<Forget_password />} />
        <Route path="/change_password" element={<ChangePassword />} />
        <Route path="/sheet invalid" element={<Sheet_invalid />} />

        <Route path="/admin/*" element={<Admin />} />
        <Route path="/teacher/*" element={<Teacher />} />
        <Route path="/student/*" element={<Student />} />
        <Route path="*" element={<Overview />} />

      </Routes>
    </Router>
  );
};

export default App;
