import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setFlagsFromString } from 'v8';
import { get_api } from '../static_api';

const ForgotPassword: React.FC = () => {

  const [email, setEmail] = useState('');
  const [username, setusername] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [message, setMessage] = useState<string[]>([]);
  const [ForgetCompOn, setForgetCompOn] = useState(true);

  const [Otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigat = useNavigate();
  const [loading, set_loading] = useState(false);

  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const selectInputRef = useRef<HTMLSelectElement | null>(null);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const newPasswordInputRef = useRef<HTMLInputElement | null>(null);
  const conformPassInputRef = useRef<HTMLInputElement | null>(null);
  const OtpInputRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const handleKeyPress = (e: any) => {
      e.target.style.setProperty('border-color', 'black');
      if (e.key === 'Enter') {

        switch (e.target.name) {

          case 'role':
            // Check if role is not admin before moving to the username field

            usernameInputRef.current?.focus();
            break;
          case 'username':

            emailInputRef.current?.focus();
            break;


          case 'newPassword':
            conformPassInputRef.current?.focus();
            break;
          case 'confirmPassword':
            OtpInputRef.current?.focus();
            break;
          default:
            break;
        }
      }

    };

    // Add event listeners to the input fields
    emailInputRef.current?.addEventListener('keydown', handleKeyPress);
    usernameInputRef.current?.addEventListener('keydown', handleKeyPress);
    selectInputRef.current?.addEventListener('keydown', handleKeyPress);
    newPasswordInputRef.current?.addEventListener('keydown', handleKeyPress);
    conformPassInputRef.current?.addEventListener('keydown', handleKeyPress);
    OtpInputRef.current?.addEventListener('keydown', handleKeyPress);
    // Add more event listeners for other fields

    // Cleanup the event listeners when the component is unmounted
    return () => {
      usernameInputRef.current?.removeEventListener('keydown', handleKeyPress);
      emailInputRef.current?.removeEventListener('keydown', handleKeyPress);
      selectInputRef.current?.removeEventListener('keydown', handleKeyPress);
      newPasswordInputRef.current?.removeEventListener('keydown', handleKeyPress);
      conformPassInputRef.current?.removeEventListener('keydown', handleKeyPress);
      OtpInputRef.current?.removeEventListener('keydown', handleKeyPress);
      // Remove event listeners for other fields
    };
  }, []);




  const handleRoleChange = (event: any) => {
    if (event.target.value === '') {
      setSelectedRole(null)
      return;
    }
    if (event.target.value === 'admin') {
      setusername('');
    }
    setSelectedRole(event.target.value);
  };


  const validateforgetform = (email: string, selectedRole: string | null, username: string) => {

    let isvalid = true;

    if (email === '') {
      emailInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'Fill the Email'])
      isvalid = false;
    }

    if (!selectedRole) {
      selectInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'select user'])
      isvalid = false;
    }

    else if (selectedRole !== 'admin' && username === '') {
      usernameInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'enter username'])
      isvalid = false;
    }

    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailvalid) {
      emailInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'Email not valid'])
      isvalid = false;
    }

    return isvalid;
  }


  async function handleForgetPasswordSubmit() {
    setMessage([]);
    try {
      if (!validateforgetform(email, selectedRole, username)) {
        throw new Error();
      }

      set_loading(true);

      const response = await fetch(`${selectedRole === 'admin' ? get_api().admin_api : selectedRole === 'teacher' ? get_api().teacher_api : get_api().student_api}?page=${selectedRole}&action=forget_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          email, username, selectedRole
        }),
      });

      if (!response.ok) {
        throw new Error('Network Error');
      }
      const data = await response.json();
      console.log(data)
      if (data.hasOwnProperty('message')) {

        setMessage((p) => [...p, data.message])
      }

      if (data.hasOwnProperty('Sended_otp')) {
        setMessage((p) => [...p, data.Sended_otp])
      }
      set_loading(false);

    } catch (error: any) {
      set_loading(false);
      setMessage((p) => [...p, error.message])
      console.log(error.message);
    }
  };


  return (
    <div className=" mx-auto pt-4 pb-4 md:p-8">
      <div className=" p-8 m-auto h-max min-h-[calc(100vh-32px)]  md:min-h-[calc(100vh-64px)] md:w-7/12 lg:w-5/12  bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">

        <div className='mb-8'>

          <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>

            <h1 className=" text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">Forget Password</h1>

            <div className="mb-4">
              <label htmlFor="role" className={`block ${selectedRole === null && 'hidden'}text-sm p-1 md:text-xl  opacity-75 `}>
                Role
              </label>
              <select
                id="role"
                name="role"
                ref={selectInputRef}
                value={selectedRole?.toString()}
                onFocus={(e) => e.target.style.setProperty('border-color', 'black')}
                onChange={handleRoleChange}
                className="w-full text-black px-3 py-2 border-2 rounded-md"
              >

                <option value='' className=' bg-slate-400' >select user</option>
                <option value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {selectedRole !== null && selectedRole != 'admin' && (
              <div className="mb-8">
                <label htmlFor="username" className={`block ${username.length === 0 && 'hidden'} text-sm p-1 md:text-xl  opacity-75`}>
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  ref={usernameInputRef}
                  maxLength={50}
                  placeholder='Enter Username'
                  value={username}
                  onChange={(e) => setusername(e.target.value)}
                  className="w-full text-black px-3 py-2 border-2 rounded-md"
                />
              </div>
            )}

            <div className=" mb-8">
              <label htmlFor="email" className={`block ${email.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailInputRef}
                maxLength={60}
                placeholder='Enter Email'
                aria-placeholder='example@gmial.com'

                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className=" w-full   text-black px-3 py-2  rounded-md border-2"
              />
            </div>

            <div className='text-center flex flex-col items-center pt-5 gap-y-2'>


              <button
                onClick={handleForgetPasswordSubmit}
                className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
              >
                Submit
              </button>
              <div className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
              >
                <Link to="/login">
                  Login
                </Link>
              </div>

            </div>
          </div>
          {loading &&
            <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
          }
        </div>

        {message.map((message, i) => (
          <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
            <p className="text-sm">{message}</p>
          </div>
        ))}

      </div>
    </div>
  );

};
export default ForgotPassword;
