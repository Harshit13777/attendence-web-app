import { BrowserRouter as Router, Link, Route,Routes,useNavigate } from 'react-router-dom';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { HomePage } from '../home';

export const Admin_sheet_access_valid:React.FC<{set_sheet_status:Dispatch<SetStateAction<string>>}> =({set_sheet_status})=>{
    const [show_instruction,set_show]=useState(false);
    const handleOnClick = () => set_show((prevState) => !prevState);
    const [message,setMessage]=useState('');
    const navigat=useNavigate();
    const [loading,set_loading]=useState(false);
    
    const fetch_check_sheet_access=async()=>{
      setMessage('checking...');  
      set_show(false);//hide instruction when fetching
      try{
        const token=sessionStorage.getItem('token');
        if(!token){
          throw new Error('Error');
        }

        const response:any = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=checking_admin_sheet_access_valid`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token
          }),
        });
        
        if (!response.ok) {
          throw new Error('Network Error')
        }
        
        const data = await response.json(); 

        if(data.hasOwnProperty('is_sheet_valid')){
          if(data.is_sheet_valid==='yes'){
            sessionStorage.setItem('sheet_exist','Y');
            setTimeout(()=>{
              navigat('/admin/');
            },3000);

          }
          else if(data.is_sheet_valid==='no'){
            setMessage(data.message);
            console.log('sheet access not available')
          }
        }
        setMessage(data.message);
        set_loading(false);
      }
      catch (error:any) {
        set_loading(false);
        setMessage(error.message);
        console.log(error.message);
      }

    }

    useEffect(()=>{
      fetch_check_sheet_access();
    },[]);
    
    const handle_changeSheetID=()=>{
      set_sheet_status('Sheet_Not_Exist');//want to add new sheet
    }


      return (<>
      <div className='  flex flex-col items-center text-center gap-y-4 '>
         <h3 className={` m-10  border-solid border-8 text-2xl md:text-5xl rounded-lg bg-slate-800 text-slate-200 p-4 font-extrabold text-center`} >Check Sheet Status</h3>
        <div className=' relative w-11/12' >

          <button className={`  m-2 border-solid border-yellow-700  ${show_instruction ? 'absolute p-1 pl-4 pr-4 border-4  left-3/4  translate-x-full text-red-400 bg-yellow-200  rounded-full duration-500 ':' p-2  font-bold rounded-lg text-slate-600 bg-yellow-200 text-xl'} `} onClick={handleOnClick}>{show_instruction ?'':'show instruction'}</button>
          <div className={`${!show_instruction && 'hidden'} bg-yellow-100 rounded-md`}>
            <div className=' p-2 border-solid   rounded-md'>
              instruction of sheet access...
            </div>
          </div>   

        </div>
        
        
        
        {
          loading
            ?
            <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
            :           
            <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={()=>{set_loading(true);fetch_check_sheet_access()}}>Check</button>
        }
                
            <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={()=>{handle_changeSheetID()}}>Change SpreadSheet Id</button>
        

          
      {message!=='' &&
          <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
        }
        </div>
        
      </>)
}
export default Admin_sheet_access_valid;