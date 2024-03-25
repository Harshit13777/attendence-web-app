import { admin } from 'googleapis/build/src/apis/admin';
import { throttle } from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setFlagsFromString } from 'v8';

interface FormData {
  email: string;
  password: string;
  username: string;
}
interface user {

}

const Login: React.FC = () => {

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [message, setMessage] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username: ''
  });
  const [open_setpassword_comp, set_opensetpassword_comp] = useState(false);
  const [spassword, set_spassword] = useState('');
  const [s_conformpassword, set_sconformpassword] = useState('');
  const [loading, set_loading] = useState(false);
  const navigat = useNavigate();


  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const passwordInputRef = useRef<HTMLInputElement | null>(null);
  const usernameInputRef = useRef<HTMLInputElement | null>(null);
  const roleInputRef = useRef<HTMLSelectElement | null>(null);
  const spasswordRef = useRef<HTMLInputElement | null>(null);
  const conform_spasswordRef = useRef<HTMLInputElement | null>(null);


  useEffect(() => {
    const handleKeyPress = (e: any) => {
      if (e.key === 'Enter') {
        switch (e.target.name) {
          case 'email':
            passwordInputRef.current?.focus();
            break;
          case 'password':
            roleInputRef.current?.focus()
            break;

          case 'username':
            handleSubmit();
            break;
          case 'newPassword':
            conform_spasswordRef.current?.focus();
            break;
          case 'conformPassword':
            handle_setPasswordSubmit();
            break;

          default:
            break;
        }
      }
      else {
        e.target.style.setProperty('border-color', 'black');
      }
    };

    // Add event listeners to the input fields

    emailInputRef.current?.addEventListener('keydown', handleKeyPress);
    usernameInputRef.current?.addEventListener('keydown', handleKeyPress);
    passwordInputRef.current?.addEventListener('keydown', handleKeyPress);
    roleInputRef.current?.addEventListener('keydown', handleKeyPress);
    spasswordRef.current?.addEventListener('keydown', handleKeyPress);
    conform_spasswordRef.current?.addEventListener('keydown', handleKeyPress);
    // Add more event listeners for other fields

    // Cleanup the event listeners when the component is unmounted
    return () => {
      emailInputRef.current?.removeEventListener('keydown', handleKeyPress);

      usernameInputRef.current?.removeEventListener('keydown', handleKeyPress);
      passwordInputRef.current?.removeEventListener('keydown', handleKeyPress);
      roleInputRef.current?.removeEventListener('keydown', handleKeyPress);
      spasswordRef.current?.removeEventListener('keydown', handleKeyPress);
      conform_spasswordRef.current?.removeEventListener('keydown', handleKeyPress);
      // Remove event listeners for other fields
    };
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    if (token) {
      setTimeout(() => {
        navigat(`/${sessionStorage.getItem('user')}`)
      }, 20);
    }
  }, [])



  useEffect(() => {
    if (message.length > 0)
      setTimeout(() => {
        setMessage((p) => p.slice(1,))
      }, 7000);
  }, [message])

  const handleRoleChange = (event: any) => {
    if (event.target.value === '') {
      setSelectedRole(null)
      return;
    }
    else if (event.target.value === 'admin') {
      formData.username = '';//admin nothave username
    }

    setSelectedRole(event.target.value);
  };

  const validateloginform = (email: string, password: string, selectedRole: string | null, username: string) => {

    let isvalid = true;

    if (email === '') {
      emailInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'Fill the Email'])
      isvalid = false;
    }
    if (password === '') {
      passwordInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'Fill the password'])

      isvalid = false;
    }
    if (!selectedRole) {
      roleInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'select user'])
      isvalid = false;


    }
    else if (selectedRole !== 'admin') {
      if (username === '') {

        usernameInputRef.current?.style.setProperty('border-color', 'red');
        setMessage((p) => [...p, 'enter username'])
        isvalid = false;
      }
      else if (username.length < 5) {
        usernameInputRef.current?.style.setProperty('border-color', 'red');
        setMessage((p) => [...p, 'Username include atleast 5 characters'])
        isvalid = false;
      }
    }

    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailvalid) {
      emailInputRef.current?.style.setProperty('border-color', 'red');
      setMessage((p) => [...p, 'Email not valid'])
      isvalid = false;
    }

    return isvalid;
  }

  const handleSubmit = async () => {
    set_loading(true);

    try {


      const { email, password, username } = formData;

      if (!validateloginform(email, password, selectedRole, username)) {
        throw new Error('Fix the Error');
      }
      console.log(selectedRole)
      const response = await fetch(`${sessionStorage.getItem(selectedRole === 'admin' ? 'api' : selectedRole === 'teacher' ? 'teacher_api' : 'student_api')}?page=${selectedRole}&action=login`, {
        method: 'post',
        //headers: {
        // 
        //},
        headers: {
          'Content-Type': 'text/plain', // Replace with your App Script URL
        },
        body: JSON.stringify({ email, password, username, selectedRole }),
      });

      if (!response.ok) {
        throw new Error(`Network Error:${response.status}`);
      }

      const data = await response.json();

      console.log(data);

      if (data.hasOwnProperty('message'))
        setMessage((p) => [...p, data.message]);

      if (data.hasOwnProperty('set_password')) {
        //for teacher ,student
        sessionStorage.setItem('Admin_Sheet_Id', data.Admin_Sheet_Id);
        set_opensetpassword_comp(true);
      }


      //for admin handle
      if (selectedRole === 'admin') {
        if (!data.hasOwnProperty('username') || !data.hasOwnProperty('token' || !data.hasOwnProperty('sheet_exist'))) {
          throw new Error("Items not received");
        }
        sessionStorage.setItem('user', 'admin');
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('email', email);

        sessionStorage.setItem('student_data_key', `${email}_Student_Data`)
        sessionStorage.setItem('teacher_data_key', `${email}_Teacher_Data`)

        //set all user data in localstorage
        const obj: { user: string, username: string, token: string, email: string } = { 'user': 'admin', username: data.username, token: data.token, email }
        localStorage.setItem('User_data', JSON.stringify(obj));

        //if sheet valid then add sheet_exist in session so then it can go to home screen
        if (data.sheet_status === 'valid') {
          sessionStorage.setItem('sheet_exist', 'Y');
        }

        setTimeout(() => {
          navigat('/admin');
        }, 300);
      }

      //for teacher and student handle

      if (selectedRole === 'teacher') {
        if (!data.hasOwnProperty('token') || !data.hasOwnProperty('set_Password')) {
          throw new Error('Server Error : Items not received')
        }
        sessionStorage.setItem('user', 'teacher');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('email', email);
        //login only when sheet exist
        sessionStorage.setItem('sheet_exist', 'Y');
        //key , we get data from localstorage by key
        sessionStorage.setItem('student_imgs_key', `${email}_Student_Img_Data`)
        sessionStorage.setItem('subject_names_key', `${email}_Subject_Name_Data`)

        //set all user data in localstorage
        const obj: { user: string, username: string, token: string, email: string } = { 'user': 'teacher', username: username, token: data.token, email }
        localStorage.setItem('User_data', JSON.stringify(obj));
        if (data.set_Password === true) {
          set_opensetpassword_comp(true)
        } else {
          setTimeout(() => {
            navigat('/teacher');
          }, 300);
        }

      }

      if (selectedRole === 'student') {
        //check if sheet db has student img or not if not then take him to upload comp 
        if (!data.hasOwnProperty('token') || !data.hasOwnProperty('set_Password')) {
          throw new Error('Server Error : Items not received')
        }
        sessionStorage.setItem('user', 'student');
        sessionStorage.setItem('username', username);
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('email', email);
        //login only when sheet exist
        sessionStorage.setItem('sheet_exist', 'Y');
        //set all user data in localstorage
        const obj: { user: string, username: string, token: string, email: string } = { 'user': 'student', username: username, token: data.token, email }
        localStorage.setItem('User_data', JSON.stringify(obj));
        if (data.set_Password === true) {
          set_opensetpassword_comp(true)
        } else {
          setTimeout(() => {
            navigat('/student');
          }, 300);
        }

      }


      set_loading(false);

    }
    catch (e: any) {
      console.log(e.message);
      set_loading(false);
    }


  }

  const validatesetpasswdform = (email: string, password: string, selectedRole: string | null, username: string, spassword: string, s_conformpassword: string, adminsheetid: string | null) => {

    let isvalid = true;

    if (email === '' || password === '' || selectedRole === null || username === '') {
      setMessage((p) => ['Error'])
      return false;
    }

    if (spassword.length < 7 || s_conformpassword.length < 7) {
      setMessage((p) => [...p, 'password size atleast 7']);
      conform_spasswordRef.current?.style.setProperty('border-color', 'red');
      spasswordRef.current?.style.setProperty('border-color', 'red');
      isvalid = false;
    }
    if (spassword === '') {
      setMessage((p) => [...p, 'fill new password']);
      spasswordRef.current?.style.setProperty('border-color', 'red');
      isvalid = false;
    }
    if (s_conformpassword === '') {
      setMessage((p) => [...p, 'fill conform password']);
      conform_spasswordRef.current?.style.setProperty('border-color', 'red');
      isvalid = false;
    }
    if (spassword !== s_conformpassword) {
      setMessage((p) => [...p, 'password not match']);
      conform_spasswordRef.current?.style.setProperty('border-color', 'red');
      spasswordRef.current?.style.setProperty('border-color', 'red');
      isvalid = false;
    }

    return isvalid;

  }


  async function handle_setPasswordSubmit() {
    set_loading(true);
    setMessage([]);
    try {

      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        set_opensetpassword_comp(false)
        throw new Error('Error : No Token Found')
      }
      const response = await fetch(`${sessionStorage.getItem(selectedRole === 'student' ? 'student_api' : 'teacher_api')}?page=${selectedRole}&action=set_password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ newpassword: spassword, token }),
      })
      if (!response.ok) {
        throw new Error('Network error');
      }

      const data = await response.json(); //convert json to object

      if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
        setTimeout(() => {
          navigat('/sheet invalid')
        }, 2000);
        throw new Error("Sheet Invalid: Contact to Admin");
      }



      if (data.hasOwnProperty('message'))
        setMessage((p) => [...p, data.message]);

      if (data.hasOwnProperty('password_set')) {
        setTimeout(() => {
          navigat(`/${selectedRole}`);
        }, 2000);
        setMessage([data.password_set])
      }
      set_loading(false);

    }
    catch (e: any) {
      set_loading(false);
      console.log(e.message);
    }
  }

  return (
    <>
      <div className="mx-auto bg-gray-750 pt-4 pb-4 md:p-8">

        <div className=" p-8 m-auto h-max min-h-[calc(100vh-32px)]  md:min-h-[calc(100vh-64px)] md:w-7/12 lg:w-5/12  bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">


          {//login comp
            !open_setpassword_comp ?
              <div className=' mb-8'>
                <h1 className=" text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">LOGIN</h1>

                <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>

                  <div className=" mb-8">
                    <label htmlFor="email" className={`block ${formData.email.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      ref={emailInputRef}
                      name="email"
                      maxLength={60}
                      placeholder='Enter Email'
                      aria-placeholder='example@gmial.com'

                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className=" w-full   text-black px-3 py-2  rounded-md border-2"
                    />
                  </div>

                  <div className="mb-8">
                    <label htmlFor="password" className={`block ${formData.password.length === 0 && 'hidden'} text-sm p-1 md:text-xl  opacity-75`}>
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      ref={passwordInputRef}
                      maxLength={30}

                      placeholder='password'
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full text-black px-3 py-2 border-2 rounded-md"
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="role" className={`block ${selectedRole === null && 'hidden'}text-sm p-1 md:text-xl  opacity-75 `}>
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      ref={roleInputRef}
                      onFocus={(e) => e.target.style.setProperty('border-color', 'black')}
                      value={selectedRole?.toString()}
                      onChange={handleRoleChange}
                      className="w-full text-black px-3 py-2 border-2 rounded-md"
                    >

                      <option value='' >select user</option>
                      <option value="admin">Admin</option>
                      <option value="teacher">Teacher</option>
                      <option value="student">Student</option>
                    </select>
                  </div>

                  {selectedRole !== null && selectedRole != 'admin' && (
                    <div className="mb-2">
                      <label htmlFor="username" className={`block ${formData.username.length === 0 && 'hidden'} text-sm p-1 md:text-xl  opacity-75`}>
                        Username
                      </label>
                      <input
                        type="text"
                        id="username"
                        name="username"
                        maxLength={50}
                        ref={usernameInputRef}
                        placeholder='Username'
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full text-black px-3 py-2 border-2 rounded-md"
                      />
                    </div>
                  )}


                  {message.length !== 0 && message.map((message, i) => (
                    <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
                      <p className="text-sm">{message}</p>
                    </div>
                  ))}

                  <div className='text-center flex flex-col items-center pt-5 gap-y-2'>

                    {
                      !loading
                      &&



                      <button
                        onClick={handleSubmit}
                        className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                      >
                        Submit
                      </button>
                    }

                    <div className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                    >
                      <Link to="/forget_password" className=''>
                        Forget Password
                      </Link>
                    </div>
                    <div className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                    >
                      <Link to="/signup">
                        Signup
                      </Link>
                    </div>

                  </div>
                </div>

                {loading &&
                  <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
                }
              </div>
              :
              <div className='mb-8'>
                <h1 className=" text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">Set Password</h1>

                <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>
                  <div className="mb-8">
                    <label htmlFor="newPassword" className={`block ${spassword.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name='newPassword'
                      ref={spasswordRef}
                      placeholder='Enter new Password'
                      value={spassword}
                      maxLength={50}

                      onChange={(e) => set_spassword(e.target.value)}
                      className="w-full text-black px-3 py-2 border-2 rounded-md"
                    />
                  </div>
                  <div className="mb-8">
                    <label htmlFor="confirmPassword" className={`block ${s_conformpassword.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="conformPassword"
                      name='conformPassword'
                      ref={conform_spasswordRef}
                      value={s_conformpassword}
                      placeholder='ReEnter Password'
                      maxLength={50}
                      onChange={(e) => set_sconformpassword(e.target.value)}
                      className="w-full text-black px-3 py-2 border-2 rounded-md"
                    />
                  </div>
                </div>
                {message.length !== 0 && message.map((message, i) => (
                  <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
                    <p className="text-sm">{message}</p>
                  </div>
                ))}

                <div className='text-center flex flex-col items-center pt-5 gap-y-2'>

                  {
                    loading
                      ?

                      <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
                      :
                      <button
                        onClick={handle_setPasswordSubmit}
                        className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                      >
                        set Password
                      </button>
                  }
                </div>

              </div>
          }

        </div>

      </div>
    </>
  );
};

export default Login;


