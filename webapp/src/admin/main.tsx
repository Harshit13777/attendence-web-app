import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import Signup from '../authentication/signup';
import Login from '../authentication/login';
import React, { useState, useEffect } from 'react';
import Forget_password from '../authentication/forget_password';
import Change_password from '../authentication/forget_password';
import Create_admin_sheet from './sheet/create_sheet_main';
import {HomePage} from './home';
import Admin_sheet_access_valid from './sheet/check_sheet_access_valid';


export const Main: React.FC = () => {
    
    //check the 
    const navigate = useNavigate();
     
    
  //if  admin not login in 
    if (!sessionStorage.getItem('username')) {
      return(
        <Routes>
          <Route path="/admin/signup" element={<Signup/>} />
          <Route path="/admin/forget-password" element={<Forget_password/>} />
          <Route path="/admin/change-password" element={<Change_password/>}/>
          <Route path="/admin/*" element={<Login/>} /> {/*if not login in then all route goes to login page */ }
        </Routes>
      );
    }
   
    else if(!sessionStorage.getItem('Admin_Sheet_Id')){
      return (<>
                <Create_admin_sheet/>
            </>)  
      }
      
    else if(!sessionStorage.getItem('admin_sheet_access_valid')){
       return (<>
          <Admin_sheet_access_valid/>
        </>)
      } 
    
      return (
        <>
           <HomePage/>
        </>
      )
    

  
  };
  