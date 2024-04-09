import React, { useState, useEffect } from 'react';
import { get_api } from '../static_api';
import { useNavigate } from 'react-router-dom';


interface Response_Data {
  Teacher: {
    name: string,
    is_login: boolean
  }[],
  Student: {
    name: string;
    roll: string;
    is_login: boolean
  }[],

}

export const Login_Email_Status = () => {

  const [message, setMessage] = useState('');
  const [response_data, setresponse_data] = useState<Response_Data | null>(null);
  const [loading, set_loading] = useState(false)
  const navigate = useNavigate()
  //key to access localstorage of student data and teacher data
  const student_storage_key = sessionStorage.getItem('student_data_key') as string
  const teacher_storage_key = sessionStorage.getItem('teacher_data_key') as string


  const fetchdata: any = async () => {

    setMessage('')
    set_loading(true);
    try {

      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }
      const response = await fetch(`${get_api().admin_api}?page=admin&action=get_login_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ token }),
      })

      if (!response.ok) {
        throw new Error('Network error');

      }

      const data = await response.json()


      if (data.hasOwnProperty('message')) {

        setMessage(data.message);
      }


      if (data.hasOwnProperty('sheet_invalid')) {
        sessionStorage.removeItem('sheet_exist')
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 500);
      }
      if (data.hasOwnProperty('sheet_Erased')) {
        if (data.sheet_Erased.includes('Student')) {
          localStorage.removeItem(student_storage_key)
        }
        else if (data.sheet_Erased.includes('Teacher')) {
          localStorage.removeItem(teacher_storage_key)
        }
        setTimeout(() => {
          navigate('/admin')
        }, 1000);
        throw new Error(data.sheet_Erased);

      }

      if (data.hasOwnProperty('Login_status')) {
        setresponse_data(data.Login_status)

      }
      set_loading(false)

    } catch (error: any) {
      set_loading(false)
      setMessage(error.message)
      console.log(error.message)
    }
  }

  useEffect(() => {
    setMessage('fetching data...');


    fetchdata();

  }, []);

  return (
    <div className="mx-auto p-4">
      <h1 className="flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
        <span className="bg-clip-text text-transparent bg-gradient-to-tl from-slate-300 to-gray-300 bg-lime-50 p-3 rounded-lg">
          Login Status
        </span>
      </h1>
      {response_data ? (
        <div className="flex w-full flex-col md:flex-row gap-4">
          <div className=" md:w-1/2 mt-20 m-5  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >
            <h1 className="mt-5  flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
              <span className="p-5 bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 to-red-500 bg-lime-50 rounded-lg">
                Teachers
              </span>
            </h1>
            <div className="overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2">
              <table className="w-full table-auto rounded-2xl">
                <thead className=' text-center items-center '>
                  <tr className=''>
                    <th className="text-base md:text-xl font-bold md:px-2 py-2">Name</th>
                    <th className="text-base md:text-xl font-bold md:px-2 py-2">Login Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    response_data.Teacher.map((row, rowIndex) => (
                      <tr key={rowIndex} className=' border-b-2'>
                        <td className={`px-4 py-2`} >
                          <div className='flex items-center text-center justify-center font-semibold md:text-lg text-base'>

                            {row.name}
                          </div>

                        </td>
                        <td className={`px-4 py-2`} >
                          <div className='flex items-center text-center justify-center font-semibold md:text-lg text-base '>

                            <p>{row.is_login ? 'Login' : 'Not Login'}</p>
                          </div>

                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
          <div className=" md:w-1/2 mt-20 m-5  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >
            <h1 className="mt-5  flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
              <span className="p-5 bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 to-red-500 bg-lime-50 rounded-lg">
                Students
              </span>
            </h1>
            <div className="overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2">
              <table className="w-full table-auto rounded-2xl">
                <thead className=' text-center items-center '>
                  <tr className=''>
                    <th className=" text-base md:text-xl font-bold md:px-2 py-2">Name</th>
                    <th className=" text-base md:text-xl font-bold md:px-2 py-2">Roll No</th>
                    <th className=" text-base md:text-xl font-bold md:px-2 py-2">Login Status</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    response_data.Student.map((row, rowIndex) => (
                      <tr key={rowIndex} className=' border-b-2'>


                        <td className={` `} >
                          <div className='flex  items-center text-center justify-center font-semibold md:text-lg text-base '>

                            {row.name}
                          </div>

                        </td>
                        <td className={` `} >
                          <div className='flex  items-center text-center justify-center font-semibold md:text-lg text-base '>

                            {row.roll}
                          </div>

                        </td>
                        <td className={` py-2`} >
                          <div className='flex  items-center text-center justify-center font-semibold md:text-lg text-base'>

                            <p>{row.is_login ? 'Login' : 'Not Login'}</p>
                          </div>

                        </td>



                      </tr>
                    ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      ) : (
        <>
          {loading &&
            <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
          }
          {
            message !== '' &&
            <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 p-6 shadow-md">
              <p className="text-xl">{message}</p>
            </div>
          }
        </>

      )}
    </div>



  );

}
export default Login_Email_Status;