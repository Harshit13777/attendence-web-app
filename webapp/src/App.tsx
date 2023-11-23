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
import { Upload_Img } from './teacher/example';
import Take_Attendence from "./teacher/Take_attendence";
import Add_Attendence_Sheet from "./teacher/Add_Attendence_Sheet";




const App: React.FC = () => {

 

  return (
    <Router>
      <Routes>
        
        {/* for admin 
        <Route path="/u" element={<Upload_Img/>} />
        <Route path="/add_sheet" element={<Take_Attendence student_imgs_json={''} sheet_name_arr={}/>} />
      */}
      <Route path="/add_sheet" element={<Add_Attendence_Sheet pre_sheet_arr={['a','b']}/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/forget_password" element={<Forget_password/>} />

        <Route path="/admin/*" element={<Admin/>} />
        <Route path="/teacher/*" element={<Teacher />} />
        <Route path="/student/*" element={<Student />} />
      </Routes>
    </Router>
  );
};

export default App;
