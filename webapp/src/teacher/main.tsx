import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import HomePage from './home';
import React, { useState, useEffect } from 'react';


export const Main: React.FC = () => {    
  //check the 
  const navigate = useNavigate();   
  const [message,setMessage]=useState<any>('loading...'); 
  const [loading_comp,setloading]=useState(true);
  
//if  admin not login in 
  if (!sessionStorage.getItem('email')) {
    
    setInterval(()=>{
      navigate('/login');},10000);
        
    return(
      <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p className="text-sm">Account Not Login in</p>
      </div>)
    }

    //if sheet invalid
  if(!sessionStorage.getItem('sheet_exist')){
    return (<>            
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">Sheet Not exist contact to admin</p>
        </div>
          </>)  
      
    }
  

  return (<> 
            {loading_comp && <Sync setloading={setloading}/>}
            {!loading_comp && <HomePage />}
        </>);

  }

  const Sync=({setloading}:any)=>{
    const navigate = useNavigate();   
    const [message,setMessage]=useState<any>('loading...'); 
   
    
    //syncing attendence sheet name and student img_ids and update in local storage
   /*
  useEffect(()=>{

    async function sync_attendence_sheet_name(){

    try {
        const email=sessionStorage.getItem('email');
        const Admin_Sheet_Id=sessionStorage.getItem('Admin_Sheet_Id');
        const response:any = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=sync_attendence_sheet_name`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,Admin_Sheet_Id
          }),
        });
  
        if(response.hasOwnProperty('error')){
          setMessage('Server error');
          console.log(response.error);
          return;
        }

        const data = await response.json();
        
        if(data.hasOwnProperty('sheet_access')){
            setMessage('sheet not valid contact to admin');
            sessionStorage.removeItem('sheet_access');
            return;
        }

        //if teacher attendence sheet name exist in response 
        if(data.hasOwnProperty('attendence_sheet_name')){
            const sheet_names=data.attendence_sheet_name;
            localStorage.setItem('Attendence_Sheet_Name',sheet_names);
            return;
        }
        if(data.hasOwnProperty('Sheet_Not_Added')){
            return ;
        }
        //else
        setMessage(data.message);
        
    } catch (error) {
        setMessage('Error sending email. Please try again later.');
      }
      
    }
    async function sync_student_imgs(pre_student_ids:false|number[]){

    try {
        const email=sessionStorage.getItem('email');
        const Admin_Sheet_Id=sessionStorage.getItem('Admin_Sheet_Id');
        const response:any = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=sync_student_imgs_ids`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Admin_Sheet_Id,pre_student_ids
          }),
        });
  
        if(response.hasOwnProperty('error')){
          setMessage('Server error');
          console.log(response.error);
          return;
        }

        const data = await response.json();
        
        if(data.hasOwnProperty('sheet_access')){//if sheet not valid
            setMessage('sheet not valid contact to admin');
            sessionStorage.removeItem('sheet_access');
            return;
        }

        //if student imgs exist in response 
        if(data.hasOwnProperty('student_imgs')){

            if(!pre_student_ids){//if no store img present then store all imgs ids 
                const Student_Imgs=JSON.stringify(data.student_imgs);
                const Student_Ids=JSON.stringify(data.student_ids);
                localStorage.setItem('Student_Imgs',Student_Imgs);
                localStorage.setItem('Student_Ids',Student_Ids);
            } 
            else{ 
                //append response img and ids in store img obj
                const store_imgs:string|null=localStorage.getItem('Student_Imgs');//get json formted object
                const store_ids:string|null=localStorage.getItem('Student_Ids');//get json formted object
                let prev_obj_imgs={};
                let prev_obj_ids={};
                if(store_imgs && store_ids){
                    prev_obj_imgs=JSON.parse(store_imgs);//convet json to object
                    prev_obj_ids=JSON.parse(store_ids);//convet json to object
                }

                let new_data_imgs=data.Student_Imgs;//get object from response
                let new_data_ids=data.Student_Imgs;//get object from response

                let update_data_imgs=JSON.stringify({...prev_obj_imgs,...new_data_imgs});//concatenate 
                let update_data_ids=JSON.stringify({...prev_obj_ids,...new_data_ids});//concatenate 
                
                localStorage.setItem('Student_Imgs',update_data_imgs);
                localStorage.setItem('Student_Ids',update_data_ids);

            }
            setMessage('');
            setloading(false);
            return;     
        }
    
        //else
        setMessage(data.message);
        
    } catch (error) {
        setMessage('Error sending email. Please try again later.');
      }
      
    }

    //check attednece sheet name present or not then sync
    if(!localStorage.getItem('Attendence_Sheet_Name')){
        sync_attendence_sheet_name();
    }
  
    //check student imgs and ids present 
    let pre_student_ids:false|number[];
    const data_ids=localStorage.getItem('Student_Ids');//get student ids json stirng
    if(!data_ids){//if student ids not present then sync all student data
        pre_student_ids=false;
        sync_student_imgs(pre_student_ids);
    }
    else{//else send present data to sync student img which not present
        
        let student_ids_arr=JSON.parse(data_ids);
        pre_student_ids=student_ids_arr;
        sync_student_imgs(pre_student_ids)
    }
  },[]);
*/
setloading(false);
  return (<> 
            
            {message=='' && <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
              <p className="text-sm">{message}</p>
            </div>}
        </>);
  }

