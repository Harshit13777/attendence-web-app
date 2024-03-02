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
    sessionStorage.setItem('api', 'https://script.google.com/macros/s/AKfycbyxY6NoH9EcQrPNMqz2RIMY12X6geKJiViFv-HbarNnsyKOp1XugDQpKASob3Ii886Jcg/exec')

    const obj = localStorage.getItem('User_data');
    if (obj) {
      const user_data: { user: string, username: string, token: string, email: string } = JSON.parse(obj);
      sessionStorage.setItem('token', user_data.token)
      sessionStorage.setItem('user', 'admin');
      sessionStorage.setItem('username', user_data.username);
      sessionStorage.setItem('email', user_data.email);
    }
  }, [])


  return (
    <Router>
      <Routes>

        {/* for admin 
      */}
        <Route index path="/login" element={<Login />} />
        <Route path="/test" element={<Upload_Img />} />
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
