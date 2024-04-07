import React, { useState, useEffect } from 'react';
import { get_api } from '../static_api';


interface Response_Data {
  Teacher_Name: string[];
  Student: {
    name: string;
    roll: string;
  }[],

}

export const Login_Email_Status = () => {

  const [message, setMessage] = useState('');
  const [response_data, setresponse_data] = useState<Response_Data>({
    Teacher_Name: [],
    Student: [{ name: '', roll: '' }],
  });

  const fetchdata: any = () => {
    let Admin_Sheet_Id = sessionStorage.getItem('Admin_Sheet_Id');

    fetch(`${get_api().admin_api}?page=admin&action=check_login_email_status`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify({}),
    })
      .then((response: any) => {
        if (!response.ok) {
          setMessage('Network error');
          console.log('Network response was not ok');
        }
        if (response.hasOwnProperty('error')) {
          setMessage('Server error');
          console.log(response.error);
          return;
        }
        return response.json(); //convert json to object
      })
      .then((data) => {


        if (data.hasOwnProperty('message')) {

          setMessage('');
          setresponse_data(data.response_data);

          return;
        }

        if (data.hasOwnProperty('sheet_valid')) {
          if (!data.sheet_valid) {
            setMessage('Sheet not Found');
            sessionStorage.removeItem('Admin_Sheet_Id');
          }
          if (!data.admin_sheet_access_valid) {
            sessionStorage.removeItem('admin_sheet_access_valid');
            setMessage('Sheet not valid check instructions');
          }
          return;
        }

      });
  }

  useEffect(() => {
    setMessage('fetching data...');
    fetchdata();

  }, []);


  return (
    <div className="mx-auto w-screen p-4">
      <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2">
        <h1 className="text-4xl font-bold text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
            Teachers and Students Not Logged In
          </span>
        </h1>
      </div>
      {message === '' ? (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-6 bg-white shadow-md">
            <h2 className="text-3xl font-semibold mb-6">Teachers</h2>
            <ul className="text-lg">
              {response_data.Teacher_Name.map((teacherName, index) => (
                <li key={index} className="mb-3">
                  {teacherName}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-white shadow-md">
            <h2 className="text-3xl font-semibold mb-6">Students</h2>
            <ul className="text-lg">
              {response_data.Student.map((student, index) => (
                <li key={index} className="mb-3">
                  {student.name} - {student.roll}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 p-6 shadow-md">
          <p className="text-xl">{message}</p>
        </div>
      )}
    </div>



  );

}
export default Login_Email_Status;