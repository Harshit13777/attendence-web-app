import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';


const AutoSheetCreator=()=>{
  const scope = "https://www.autoapis.com/auth/spreadsheets https://www.autoapis.com/auth/drive";
  const [accessToken,setaccessToken] =useState('');
  const [message,setmessage]=useState('');
  const navigat=useNavigate();
  
  const createSheet = async () => {
    try {
      
      const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=create_admin_sheet`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'accessToken':{accessToken},
          username:sessionStorage.getItem('username')
        })}
      );

      console.log('data sent');
      if (!response.ok) {
        setmessage('Network error');
        throw new Error('Network response was not ok.' );
      }

      const data =  await response.json();
      console.log(data);

      if(response.hasOwnProperty('error'))
      { setmessage(data.message);
        console.log(data.error);
        return;
      }

      sessionStorage.setItem('Admin_sheet_Id',data.Admin_Sheet_Id);
      sessionStorage.setItem('admin_sheet_access_valid','Y');
      setmessage('Sheet created');
      
      setTimeout(() => {
        navigat('/admin/home');
        setmessage('loading...');
      }, 5000);
    
    } catch (error:any) {
      setmessage('Error sync');
      console.log(error.message);
    }
  };
  
  const GoogleLogin = useGoogleLogin({
    
    onSuccess  : tokenResponse => {
      console.log(tokenResponse);
      setaccessToken(tokenResponse.access_token);
      createSheet();
    }
    ,
    scope,
  }
    )
    return(
      <>
        <button className=' m-auto p-11 ' onClick={()=>GoogleLogin()}>Create sheet</button>
        <p>{message}</p>
      </>
    )
  }
export default AutoSheetCreator;
