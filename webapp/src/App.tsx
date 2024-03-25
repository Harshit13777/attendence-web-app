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


const App: React.FC = () => {

  //set all local storage item in session
  useEffect(() => {
    //set admin api
    sessionStorage.setItem('api', 'https://script.google.com/macros/s/AKfycbzLTaDfkBPIRvv3X5_v9fpSdy7G-6lK1X79upH_idqQKOhS5jWsTyZrYevqVV1AckF3/exec')
    //set student api
    sessionStorage.setItem('student_api', 'https://script.google.com/macros/s/AKfycbyQnCuDY-rM5FsfUwne3YgmcvrfYNM3LwdEy6Dtv9FzEaLHfHrcjKkaa4MPVFPLi6h8/exec')

    //set teacher api
    sessionStorage.setItem('teacher_api', 'https://script.google.com/macros/s/AKfycbzd4-E7wpabtN2yHw35M9qwaC1A0ysVz9pOWOWetETt-4AC8XA9-0SthF2Bm9ab3KLqEA/exec')


    const obj = localStorage.getItem('User_data');
    if (obj) {
      const user_data: { user: string, username: string, token: string, email: string } = JSON.parse(obj);
      sessionStorage.setItem('token', user_data.token)
      sessionStorage.setItem('user', user_data.user);
      sessionStorage.setItem('username', user_data.username);//unique name to get admin info from my sheet
      sessionStorage.setItem('email', user_data.email);
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
      <Routes>

        {/* for admin 
      */}
        <Route index path="/login" element={<Login />} />
        <Route path="/test" element={<Upload_Img />} />
        <Route path='/take_attendance' element={<Take_Attendence />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget_password" element={<Forget_password />} />
        <Route path="/sheet invalid" element={<Sheet_invalid />} />

        <Route path="/admin/*" element={<Admin />} />
        <Route path="/teacher/*" element={<Teacher />} />
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </Router>
  );
};

export default App;
