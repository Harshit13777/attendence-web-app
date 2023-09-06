import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { HomePage } from '../home';

export const Admin_sheet_access_valid =()=>{
    const [show_instruction,set_show]=useState(false);
    const handleOnClick = () => set_show((prevState) => !prevState);
    const [message,setMessage]=useState('');
    
    const fetch_check_sheet_access=async()=>{
      setMessage('checking...');  
      handleOnClick();//hide instruction when fetching
      try{

        const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=checking_admin_sheet_access_valid}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            admin_sheet_id:sessionStorage.getItem('Admin_Sheet_Id')
          }),
        });
        const data=await response.json();
        if(data.hasOwnProperty('error')){

          console.log(data.error);
          setMessage('server error');
          return;
        }
        if(!data.sheet_valid){ 
          setMessage('Sheet not Found');
          sessionStorage.removeItem('Admin_Sheet_Id');
          return
        }
        if(!data.admin_sheet_access_valid){
          setMessage('Sheet not valid check instructions')
          return
        }
        setMessage(data.message);
        
          sessionStorage.setItem('admin_sheet_access_valid','Y');
            return (<><HomePage/></>)
        
      }
      catch (error:any) {
        setMessage('Error sync');
        console.log(error.message);
      }

    }

    useEffect(()=>{
      fetch_check_sheet_access();
    },[]);
    


      return (<>
        <h4>
          Yoy change the settings of sheet 
          <br/>
          Please reset those settings to continue
        
        </h4>
        <h5>{message}</h5>
        <button onClick={handleOnClick}>click here to read the instructions of sheet</button>
          <div className={`${!show_instruction && 'hidden'}`}>
          <div>
            instruction...
          </div>
          <div><button onClick={fetch_check_sheet_access}>
                    Check 
                </button>
          </div>
          </div>
      </>)
}
export default Admin_sheet_access_valid;