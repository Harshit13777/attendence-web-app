import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const HandlecheckSheetStatusTeacher=()=>{
    
    const [message,setMessage]=useState<string>('Sheet not exist contact to admin'); 
    const [loading,setloading]=useState(false);
    const navigate = useNavigate(); 
    const sheetid=sessionStorage.getItem('Admin_Sheet_Id')  
    
  
      const fetch_check_sheet_access=async()=>{
        
        
        
        if(!sheetid){
          setMessage('Sheet not found')
          throw new Error('sheet not found')
        }
       setloading(true);
        try{
  
          const response= await fetch(`${sessionStorage.getItem('api')}?page=admin&action=checking_admin_sheet_access_valid`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              admin_sheet_id:sessionStorage.getItem('Admin_Sheet_Id')
            }),
          });

          if (!response.ok) {
            setMessage('Network Error');
            throw new Error('Network Error');
          }

          const data=await response.json();
          
          if(data.hasOwnProperty('error')){
            
            setMessage('Network Error');
            throw new Error('Network Error')
            
          }
          if(data.hasOwnProperty('sheet_invalid')){ 
            
            setMessage('Sheet Not valid')
            throw new Error('Sheet Not valid')
            
          }
          if(data.hasOwnProperty('sheet_valid'))
            sessionStorage.setItem('sheet_exist','Y');
            setMessage(data.message);
          
            setTimeout(()=>{
              navigate('/teacher');
            },1000);
          
        }
        catch (e:any) {
          setloading(false);
        
          console.log(e.message);
        }
  
      }
  
  
      return (<>            
        <div>

          <div className="  text-center  flex flex-col justify-center items-center">
            {
                loading
                ?
                <div className="animate-spin  rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
                :
                <button
                  className=" mt-2  hover:from-blue-800 hover:to-blue-400 from-blue-400 to-blue-800 md:shadow-xl bg-gradient-to-r text-white font-bold p-2   rounded-xl"
                  onClick={fetch_check_sheet_access}
                  >
                  Check Sheet Aceess
                </button>
  
              }
  
           </div>
                {message !== '' && (
                  <div className="bg-red-100 mt-16 border-t h-6 text-center border-b border-red-500 text-red-700 px-4 " role="alert">
                    <p className="text-sm">{message}</p>
                  </div>
                )}
        </div>
          </>)  
    }
  