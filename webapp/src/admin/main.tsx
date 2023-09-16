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
    if (sessionStorage.getItem('username')) {
      
      if(!sessionStorage.getItem('Admin_Sheet_Id')){
        return (<>
                  <Create_admin_sheet/>
              </>)  
        }
        
      else if(!sessionStorage.getItem('admin_sheet_access_valid')){
         return (<>
            <Admin_sheet_access_valid/>
          </>)
        } 
      else 
        return (<>
            <HomePage/>  
          </>);

    }
    else{
      setInterval(()=>{
        navigate('/login');
      },3000);
      return(

      <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p className="text-sm">Account Not Login in</p>
      </div>
      
      );
    }

  
  };
  