import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import add_icon from '../.icons/add.png';
import { loadavg } from 'os';

const Add_Attendence_Sheet=({pre_sheet_arr}:{pre_sheet_arr:string[]|null})=>{

  const [dataRows, setDataRows] = useState<string[]>(['']);
  const [message, setMessage] = useState<string[]>([]);
  const navigate=useNavigate();
 

  const handleInputChange = (index: number, value: string) => {
    const updatedDataRows = [...dataRows];
    if(updatedDataRows[index]===''){
      if(value===' ')return;//if first word is space then return
      value=value.toUpperCase();
    }
    updatedDataRows[index] = value.toLowerCase();
    setDataRows(updatedDataRows);
  };
  
  useEffect(()=>{
    if(message.length>3){
      setMessage([]);
    }
  })

  const handleAddRow = () => {
   setDataRows([...dataRows, '']);
  };
  

  const handleDeleteRow = (index: number) => {
    if (dataRows.length > 1) {
      // Create a new array without the deleted element and set it as the updated state
      const updatedDataRows = dataRows.filter((_, i) => i !== index);
      setDataRows(updatedDataRows);
    } else {
      setDataRows(['']);
    }
  };
  
  const isValidData=()=> {
    for (let i in dataRows) {
      if(dataRows[i] ==='')
        return false; 
    } 
      return true;
    
  }

  const same_subject_found=(pre_sheets: string[])=>{
    

    const binarySearchContains=(pre_sheet_arr:string[], elem:string)=> {
    let left = 0;
    let right = pre_sheet_arr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Use the localeCompare method to compare strings in a case-insensitive manner
      const comparison = pre_sheet_arr[mid].localeCompare(elem, undefined, {
        sensitivity: 'base',
      });

      if (comparison === 0) {
        // Found a match
        return true;
      } else if (comparison < 0) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

  // Element not found
  return false;
    }

    dataRows.forEach((elem:string) => {
      if(binarySearchContains(pre_sheets, elem)){
        setMessage((prev)=>[...prev,`${elem} already taken: `]);
        return true;
      }
    });
    return false;

  }

  function submitData  (){ 
    if(!isValidData()){
      setMessage((prev)=>[...prev,'Error:Fill the empty value']);
      return;
    }

    if( pre_sheet_arr  && same_subject_found(pre_sheet_arr)){
      return;
    } 


    let Admin_Sheet_Id=sessionStorage.getItem('Admin_Sheet_Id');
    let email=sessionStorage.getItem('email');
    fetch(`${sessionStorage.getItem('api')}?page=teacher&action=add_attendence_sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({dataRows,Admin_Sheet_Id,email}),
    })
      .then((response:any) => {
        if (!response.ok) {
          setMessage((prev)=>[...prev,'Network error']);
          console.log('Network response was not ok');
        }
        if(response.hasOwnProperty('error')){
          setMessage((prev)=>[...prev,'Server error']);
          console.log(response.error);
          return;
      }
        return response.json(); //convert json to object
      })
      .then((data) => {
        
          if(data.hasOwnProperty('sheet_added')){
            setMessage(data.message);
            //convet datarow into json then add in localstorge
            const prev_data=localStorage.getItem('Attendence_Sheet_Name')
            if(!prev_data){
              const sheet_name=JSON.stringify(dataRows);
              localStorage.setItem('Attendence_Sheet_Name',sheet_name);
              setInterval(()=>{
                navigate('/teacher');
              })
            }
            else{
              let prev_sheet=JSON.parse(prev_data);
              prev_sheet.push(dataRows);
              let update_data=JSON.stringify(prev_sheet);
              localStorage.setItem('Attendence_Sheet_Name',update_data);

            }
            return;
          }
        
          if(data.hasOwnProperty('sheet_valid')){
            sessionStorage.removeItem('sheet_valid');
            setMessage((prev)=>[...prev,'sheet not valid contact to admin']);
            return;
          }
          setMessage(data.message);



  });}

  
  return (
    <div className="p-4 md:p-8">
      
      <div className="flex flex-col  justify-cente  bg-lime-50 p-5 m-5 w-3/6">
        {pre_sheet_arr && (
          <div className="mb-4 ">
            <h1 className="text-2xl font-bold  text-gray-900">Already Added Subjects</h1>
          </div>
        )}

        {pre_sheet_arr &&
        
        
           
            pre_sheet_arr.map((subject, i) => (
                <li className="mb-3 text-lg font-semibold">
                  {subject}
                </li>
            ))
          
        
          
        
          }
      </div>
      
      <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2 ">
        <h1 className="text-4xl font-bold text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
            Add a New Attendence Sheet
          </span>
        </h1>
      </div>

      
      

      


      <div className="flex flex-row justify-between mb-4 mt-2 ">
        <div className="flex">
          <img
            src={add_icon}
            title="Add Row"
            onClick={handleAddRow}
            className="bg-green-500 text-white px-2 py-1 rounded hover:opacity-50"
          />
        </div>
      </div>

      <div className="overflow-x-auto mb-4 bg-lime-50">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 font-bold text-xl">Enter Subjects Name</th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2">
                  <input
                    value={row}
                    placeholder="Subject name"
                    aria-placeholder='Subject name'
                    onChange={(e) => handleInputChange(rowIndex, e.target.value)}
                    className="w-full border rounded px-2 py-1 hover:bg-slate-100 hover:text-black"
                  />
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-white hover:text-red-700 hover:bg-light-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={submitData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-50"
      >
        Create Attendence Sheet
      </button>

      {message.map((message,i)=> (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}
    </div>
  );
};

export default Add_Attendence_Sheet;