import { BrowserRouter as Router, Link, Route, Routes,useLocation } from 'react-router-dom';
import './App.css';
import {Main as Admin}  from './admin/main';
import {Main as Teacher} from './teacher/main';
import {Main as Student} from './student/main';
import Create_admin_sheet from './admin/sheet/create_sheet_main';
import React, { useEffect, useState } from 'react';
import  Signup  from './authentication/signup';
import  Login  from './authentication/login';
import  Forget_password from './authentication/forget_password';
import { Upload_Img } from './student/Upload_Img';
import Add_Attendence_Sheet from "./teacher/Add_Attendence_Sheet";




const App: React.FC = () => {

 

  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Add_Attendence_Sheet/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forget_password" element={<Forget_password/>} />
        <Route path="/login" element={<Login/>} />

        {/* for admin 
      */}
        <Route path="/admin/*" element={<Admin/>} />
        <Route path="/teacher/*" element={<Teacher />} />
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </Router>
  );
};

export default App;
