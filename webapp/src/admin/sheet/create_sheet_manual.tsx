import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';



const UserCreatedSheet=()=>{
    const [SheetId,setSheetId]=useState('');
    const [message,setMessage]=useState('');
    const [show_instruction,set_show]=useState(false);
      const handleOnClick = () => set_show((prevState) => !prevState);
  
    let navigat=useNavigate();
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if(SheetId==='')
        setMessage('Please fill the form');
      
        try{
          handleOnClick();//hide instructions while fetching
          
          const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=add_admin_sheet_id_manual`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              admin_sheet_id:SheetId,
              username:sessionStorage.getItem('username')
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
            return
          }
          if(!data.admin_sheet_access_valid){
            setMessage('Sheet not valid check instructions')
            return
          }

          sessionStorage.setItem('Admin_Sheet_Id',SheetId);
          sessionStorage.setItem('admin_sheet_access_valid',"Y");

              setMessage('Sheet created');
            
              setTimeout(() => {
                navigat('/admin/home');
                setMessage('loading...');
              }, 3000);


        }
        catch (error:any) {
          setMessage('Error sync');
          console.log(error.message);
        }
    };
  
    return(<>
      <button onClick={handleOnClick}>show the instructions of sheet</button>
            <div className={`${!show_instruction && 'hidden'}`}>
            <div>
              instruction...
            </div>
            </div>    
    <form onSubmit={handleSubmit}>
  
        <div>
          <label htmlFor="SheetId">New Password:</label>
          <input
            type="text"
            id="SheetId"
            value={SheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
        </div>
        <button type='submit'>Save</button>
      </form>
      <p>{message}</p>
    </>)
  }
  export default UserCreatedSheet;