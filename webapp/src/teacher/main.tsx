import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import HomePage from './home';
import React, { useState, useEffect } from 'react';
import { datacatalog } from 'googleapis/build/src/apis/datacatalog';

export const Main= () => {    
  //check the 
  const navigate = useNavigate();   
  const [message,setMessage]=useState<any>('loading...'); 
  const [loading_comp,setloading]=useState(true);
  const user=sessionStorage.getItem('user');
  

  //if  teacher not login in 
  if (!sessionStorage.getItem('email')) {//token + email 
    
    setTimeout(()=>{
      navigate('/login');},10000);
      
    return(
      <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p className="text-sm">Account Not Login in</p>
      </div>)
    }
    
  //if user not teacher 
    else if(!user || user!=='teacher'){
      return(
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">User not verified</p>
        </div>
      )
    }


    //if sheet invalid
    else if(!sessionStorage.getItem('sheet_exist')){
      setTimeout(() => {
        navigate('/sheet invalid')
      }, 5000);
      
      return(
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">Sheet not valid</p>
        </div>
      )
    }
  
  else
  return (<> 
            {loading_comp ?<Sync setloading={setloading}/>
              : <HomePage />}
        </>);

  }

  const Sync=({setloading}:{setloading:React.Dispatch<React.SetStateAction<boolean>>})=>{
    const navigate = useNavigate();   
    const [message,setMessage]=useState<any>('loading...'); 
   
    
    //syncing attendence sheet name and student img_ids and update in local storage
   
  useEffect(()=>{

    const syncing = async () => {
      try {
        const syncSubjectNames = async (subjectJson: string | null) => {
          const email = sessionStorage.getItem('email');
          const adminSheetId = sessionStorage.getItem('Admin_Sheet_Id');
          let availableSubjects = 0;
    
          if (subjectJson) {
            const totalSubjects: string[] = JSON.parse(subjectJson);
            availableSubjects = totalSubjects.length;
          }
    
          const response: Response = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=sync_subjects_name`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              Admin_Sheet_Id: adminSheetId,
              available_subjects: availableSubjects,
            }),
          });

          if (!response.ok) {
            setMessage('Network Error');
            return;
          }
    
          const data = await response.json();
    
          if (data.hasOwnProperty('error')) {
            setMessage('Server error');
            console.log(response);
            return;
          }
    
          if (data.hasOwnProperty('sheet_invalid')) {
            sessionStorage.removeItem('sheet_exist');
            setMessage('Sheet not valid. Contact admin.');
            setTimeout(() => {
              navigate('/sheet invalid')
            }, 5000);
            return;
          }
    
          if (data.hasOwnProperty('Subjects')) {
            const sheetNames = data.Subjects;
            localStorage.setItem('Subject_Names', sheetNames);
            return;
          }
    
          if (data.hasOwnProperty('up_to_dated')) {
            return;
          }
    
          setMessage(data.message);
        };
    
        const syncStudentImgs = async (studentIdsJson: string | null) => {
          const adminSheetId = sessionStorage.getItem('Admin_Sheet_Id');
          let studentIds: string[] | false = false;
    
          if (studentIdsJson) {
            studentIds = JSON.parse(studentIdsJson);
          }
    
          const response: Response = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=sync_student_imgs_ids`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              Admin_Sheet_Id: adminSheetId,
              available_student_ids: studentIds,
            }),
          });

          if (!response.ok) {
            setMessage('Network Error');
            return;
            
          }
          const data = await response.json();
    
          if (data.hasOwnProperty('error')) {
            setMessage('Server error');
            console.log(response);
            return;
          }
    
    
          if (data.hasOwnProperty('sheet_invalid')) {
            setMessage('Sheet not valid. Contact admin.');
            sessionStorage.removeItem('sheet_exist');
            setTimeout(() => {
              navigate('/sheet invalid')
            }, 5000);
            return;
          }
    
          if (data.hasOwnProperty('student_imgs')) {
            if (!studentIds) {
              const studentImgs = JSON.stringify(data.student_imgs);
              const studentIds = JSON.stringify(data.student_ids);
              localStorage.setItem('Students_Dataset', studentImgs);
              localStorage.setItem('Student_Ids', studentIds);
            } else {
              const storeImgs = localStorage.getItem('Students_Dataset');
              const storeIds = localStorage.getItem('Student_Ids');
              const prevObjImgs = storeImgs ? JSON.parse(storeImgs) : {};
              const prevArrIds = storeIds ? JSON.parse(storeIds) : [];
    
              const newDataImgs = data.Student_Imgs;
              const newDataIds = data.Student_Imgs;
    
              const updateDataImgs = JSON.stringify({ ...prevObjImgs, ...newDataImgs });
              const updateDataIds = JSON.stringify([...prevArrIds, ...newDataIds]);
    
              localStorage.setItem('Students_Dataset', updateDataImgs);
              localStorage.setItem('Student_Ids', updateDataIds);
            }
    
            setMessage(data.message);
            setloading(false);
            return;
          }
    
          setMessage(data.message);
        };
    
        // Check attendance sheet name presence and sync
        const subjectJson = localStorage.getItem('Subject_Names');
        await syncSubjectNames(subjectJson);
    
        // Check student imgs and ids presence
        const studentIdsJson = localStorage.getItem('Student_Ids');
        await syncStudentImgs(studentIdsJson);
    
        // Set loading to false (testing)
        setloading(false);
      } catch (error) {
        setMessage('Error. Please try again later.');
        console.error(error);
      }
      setloading(false);//remover after testing
    };
    
  syncing();
  },[]);

 

  return (<> 
            
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
              <p className="text-sm">Syncing...</p>
            </div>
            {message=='' && <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
              <p className="text-sm">{message}</p>
            </div>}
        </>);
  }


 
