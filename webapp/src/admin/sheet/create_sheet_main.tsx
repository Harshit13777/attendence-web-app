import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import navbar_open from "../../.icons/navbar.png";

export const Create_sheet_Main=()=>{
  const [autoset,setauto]=useState(false);
  const [userset,setuser]=useState(false);
  const [showopenChooseoption,set_openChoose]=useState(true)
  const handleauto = () => {
    setuser(false);  
    setauto(true);
    set_openChoose(false)
  }
  const handleUser= () =>{
    setauto(false)
    set_openChoose(false);
    setuser(true);
   
  } 

  const handle_openchooseoption=()=>{
    set_openChoose(true);
    setauto(false);
    setuser(false);
  }

  return(
    
    <>
    <div className='relative'>
    {/* translate not happening if comp will not there  */}
      <div className={` ${!showopenChooseoption &&' -translate-y-full duration-1000'}`}>
        <div className={` flex-col flex gap-y-4 text-center items-center`}>
          <h3 className={` md:w-2/4 m-10 border-solid border-8 text-5xl rounded-lg bg-slate-800 text-slate-200 ml-6 mr-6 p-4 font-extrabold `}>Choose interface</h3>
          <div className='flex-col gap-y-2 flex  border-slate-800 m-2 '>
            <button className={`bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ${!showopenChooseoption && autoset && '  -translate-y-full duration-700'}`} onClick={handleauto}>Auto Create SpreadSheet</button>
            <button className={`bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ${!showopenChooseoption && userset && ' -translate-y-full duration-700'}`} onClick={handleUser}>Manual Create SpreadSheet</button>
          </div>
        </div>
      </div>
    
      <div className={`${showopenChooseoption ?'-translate-x-16 duration-300 ':''}  absolute top-0 `}>
        <img className=' rotate-180 rounded-full bg-slate-200 w-14 h-14  hover:bg-red-200' onClick={handle_openchooseoption} src={navbar_open} alt="" />
      </div>

    
    <div className=' absolute top-10 md:w-full'>
      {
        autoset &&
            <AutoSheetCreator/>
      }
      {
        userset &&
            <UserCreatedSheet/>
      }
    </div>
    
    </div>
      </>

  )
}


const AutoSheetCreator=()=>{
  const scope = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";
  const [accessToken,setaccessToken] =useState('');
  const [message,setmessage]=useState('');
  const navigat=useNavigate();
  const [loading,set_loading]=useState(false);
  
  const createSheet = async (accessToken: string) => {
    try {

      setmessage('');
      const token=sessionStorage.getItem('token')
      if(!token || !accessToken){
        throw new Error('Error:token not found')
      }
      const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=create_admin_sheet`,{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'google_accessToken':accessToken,
           token
        })}
      );

      console.log('data sent');
      if (!response.ok) {
        throw new Error('Network response was not ok.' );
      }

      const data =  await response.json();
      console.log(data);

      if(response.hasOwnProperty('error'))
      { //server error
        throw new Error('Server Error');
        
      }

      if(data.hasOwnProperty('is_sheet_created')){
        if(data.is_sheet_created==='yes'){
          sessionStorage.setItem('sheet_exist','Y');
          setmessage('Sheet Created Successfully')

          setTimeout(() => {
            navigat('/admin/');
          }, 5000);
          return;
        }
        else if(data.is_sheet_created==='no'){
          console.log(data.message)
          throw new Error('Sheet Not Created')
        }
      }

      setmessage(data.message);
      
    
    } catch (error:any) {
      set_loading(false)
      setmessage(error.message);
      console.log(error.message);
    }
  };
  
  const GoogleLogin = useGoogleLogin({
    
    onSuccess  : tokenResponse => {
      
      console.log('token received')
      createSheet(tokenResponse.access_token);
    }
    ,
    onNonOAuthError:(e)=>{console.log(e);setmessage('Error');set_loading(false)},
    scope,
    onError:(e)=>{console.log(e);setmessage('Error');set_loading(false)}
  }
    )


    return(
    
      <div className='  flex flex-col items-center text-center gap-y-4 '>
         <h3 className={` m-10 border-solid border-8 text-2xl md:text-5xl rounded-lg bg-slate-800 text-slate-200 p-4 font-extrabold text-center`} >Auto SpreadSheet Creater</h3>
        <div className=''>
          
          You can make spreadsheet by simply one click.
        </div>

        {
          loading
          ?
          <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
         :
                   
          <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={()=>{set_loading(true); GoogleLogin()}}>Create sheet</button>
        }
        
        {message!=='' &&
          <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
        }
      </div>
    
    )
  }



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
          
          const response:any = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=add_admin_sheet_id_manual`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              admin_sheet_id:SheetId,
              username:sessionStorage.getItem('username')
            }),
          });
          if(response.hasOwnProperty('error')){
            setMessage('Server error');
            console.log(response.error);
            return;
        }
          const data=await response.json();
          
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
                navigat('/admin');
               
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

export default Create_sheet_Main;
