import { BrowserRouter as Router, Link, Route, Routes,useLocation } from 'react-router-dom';
import './App.css';
import {Main as Admin}  from './admin/main';
import {Main as Teacher} from './teacher/main';
import {Main as Student} from './student/main';
import Create_admin_sheet from './admin/sheet/create_sheet_main';
import React, { useEffect, useState } from 'react';
import {HomePage }from './admin/home';
import  Signup  from './authentication/signup';



const App: React.FC = () => {

 

  return (
    <Router>
      <Routes>
        <Route path="/admin/*" element={<HomePage/>} />
        {/* for admin 
        <Route path="/admin/*" element={<Admin/>} />
        <Route path="/teacher/*" element={<Teacher />} />
        <Route path="/student/*" element={<Student />} />
        */}
      </Routes>
    </Router>
  );
};

export default App;
