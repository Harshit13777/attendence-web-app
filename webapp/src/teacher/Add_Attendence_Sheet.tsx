import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import add_icon from '../.icons/add.png';
import { loadavg } from 'os';

const Add_Attendence_Sheet=()=>{

  const [dataRows, setDataRows] = useState<string[]>(['']);
  const [message, setMessage] = useState<string[]>([]);
  const navigate=useNavigate();
  const [subject_names,set_subject_names]=useState<{[subject: string]: string}|null>(null)
 
  const [loading,setloading]=useState(false);

  useEffect(()=>{
    const sheet_name_json=localStorage.getItem('Subject_Names')
    if(sheet_name_json){
        const sheet_arr=JSON.parse(sheet_name_json);
        set_subject_names(sheet_arr)
      }
  },[])

  const handleInputChange = (index: number, value: string) => {
    const updatedDataRows = [...dataRows];
    if(updatedDataRows[index]===''){
      if(value===' ')return;//if first word is space then return
      value=value.toUpperCase();
    }
    if(updatedDataRows.find((pre,i)=>pre===value))
      return;
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
    
   

    const binarySearchContains=(pre_sheets:string[], elem:string)=> {
    let left = 0;
    let right = pre_sheets.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      // Use the localeCompare method to compare strings in a case-insensitive manner
      const comparison = pre_sheets[mid].localeCompare(elem, undefined, {
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

  async function submitData() {
    setloading(true);
  
    try {
      if (!isValidData()) {
        setMessage((prev) => [...prev, 'Error: Fill the empty value']);
        throw new Error('Error: Fill the empty value');
      }
  
      if (subject_names && same_subject_found(Object.keys(subject_names))) {
        setMessage((prev) => [...prev, 'Error: Same subject found']);
        throw new Error('Error: Same subject found');
      }
  
      const Admin_Sheet_Id = sessionStorage.getItem('Admin_Sheet_Id');
      const email = sessionStorage.getItem('email');
  
      const response = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=add_subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Subject_Names: dataRows, Admin_Sheet_Id, email }),
      });
  
      if (!response.ok) {
        setMessage((prev) => [...prev, 'Network Error']);
        throw new Error('Network Error');
      }
  
      const responseData = await response.json();
  
      if (responseData.hasOwnProperty('error')) {
        setMessage((prev) => [...prev, 'Server Error']);
        throw new Error('Server Error');
      }
  
      if (responseData.hasOwnProperty('sheet_added')) {
          
        if (!subject_names) {
          const sheetName = JSON.stringify(responseData.Subject_Names);
          localStorage.setItem('Subject_Names', sheetName);
          set_subject_names(responseData.subject_names);
        } else {
          const updatedData = { ...subject_names, ...responseData.Subject_Names };
          localStorage.setItem('Subject_Names', JSON.stringify(updatedData));
          set_subject_names(updatedData);
        }
        setDataRows(['']);
      }
  
      if (responseData.hasOwnProperty('sheet_invalid')) {
        sessionStorage.removeItem('sheet_exist');
        setMessage([responseData.message]);
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 5000);
        return;
      }
      setloading(false);
      setMessage([responseData.message]);
    } catch (error:any) {
      setloading(false);
      console.log(error.message)
    }
  }
  

  
  return (
    <div className="p-4 md:p-8 ">
      
        
      
      <div className="flex text-center items-center justify-center bg-lime-50 p-3 rounded-lg">
        <h1 className=" text-xl md:text-4xl font-bold text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
            Add a New Attendence Sheet
          </span>
        </h1>
      </div>

      
      <div className="overflow-x-auto mb-4 rounded-xl md:p-10 bg-lime-50">

        <table className="w-full table-auto rounded-2xl">
          <thead className=''>
            <tr className=''>
              
              <th className="px-4 py-2 font-bold flex flex-row pl-5 text-xl"><div className="flex flex-row justify-between mb-4 mt-2 ">
                  <div className="flex">
                    <img
                      src={add_icon}
                      title="Add Row"
                      onClick={handleAddRow}
                      className="bg-gradient-to-r from-green-50 to-blue-950 rounded-2xl   bg-lime-50 text-white px-2 py-1  hover:bg-gradient-to-r  hover:to-green-50 hover:from-blue-950"
                    />
                  </div>
                  </div>
              </th>
              <th className="px-4 py-2 font-bold flex flex-row pl-5 text-xl">Subject Name</th>
            </tr>
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex} className=''>
                <td className="px-4 py-2">
                  <input
                    value={row}
                    placeholder="Enter Subject name"
                    aria-placeholder='Subject name'
                    maxLength={30}
                    onChange={(e) => handleInputChange(rowIndex, e.target.value)}
                    className="w-full md:w-3/5 border rounded px-2 py-1 hover:bg-slate-100 hover:text-black"
                  />
                </td>
                <td className="px-4 py-2 flex-row">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded from-red-800 :to-red-200 bg-gradient-to-r hover:bg-white hover:text-red-700 hover:bg-light-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>


        <div className='text-center flex flex-col items-center pt-10'>
        
        {
              loading
              ?
              <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
             :
             <button
              onClick={submitData}
              className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
              >
              Create Attendence Sheet
            </button>
            }
        </div>

      </div>

      {message.map((message,i)=> (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}

      {subject_names && (
          <div className="flex flex-col  justify-center  bg-lime-50 p-5 mt-5  ">
          <div className="mb-4 ">
            <h1 className="text-2xl text-center font-bold  text-gray-900">Subjects</h1>
          </div>

        {subject_names &&
        
            Object.entries(subject_names).map(([subject, value],i) => (
                <li className="mb-3 text-lg md:text-xl font-semibold">
                  {subject}
                </li>
            ))      
          }
          </div>
        )}

      
    </div>
  );
};

export default Add_Attendence_Sheet;