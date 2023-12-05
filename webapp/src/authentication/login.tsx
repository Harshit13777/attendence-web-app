import { admin } from 'googleapis/build/src/apis/admin';
import { throttle } from 'lodash';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setFlagsFromString } from 'v8';

interface FormData {
  email: string;
  password: string;
  username:string;
}
interface user{

}

const Login: React.FC = () => {

  const [selectedRole, setSelectedRole] = useState<string|null>(null);
  const [message, setMessage] = useState(['']);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username:''
  });
  const [open_setpassword_comp,set_opensetpassword_comp]=useState(false);
  const [spassword,set_spassword]=useState('');
  const [s_conformpassword,set_sconformpassword]=useState('');
  const [loading,set_loading]=useState(false);
  const navigat = useNavigate();


  const emailInputRef = useRef<HTMLInputElement|null>(null);
  const passwordInputRef = useRef<HTMLInputElement|null>(null);
  const usernameInputRef = useRef<HTMLInputElement|null>(null);
  const roleInputRef = useRef<HTMLSelectElement|null>(null);
  const spasswordRef=useRef<HTMLInputElement|null>(null);
  const conform_spasswordRef=useRef<HTMLInputElement|null>(null);


  useEffect(() => {
    const handleKeyPress = (e:any) => {
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
      else{
        e.target.style.setProperty('border-color','black');
      }
    };

    // Add event listeners to the input fields
    
    emailInputRef.current?.addEventListener('keydown', handleKeyPress);
    usernameInputRef.current?.addEventListener('keydown',handleKeyPress);
    passwordInputRef.current?.addEventListener('keydown', handleKeyPress);
    roleInputRef.current?.addEventListener('keydown', handleKeyPress);
    spasswordRef.current?.addEventListener('keydown', handleKeyPress);
    conform_spasswordRef.current?.addEventListener('keydown', handleKeyPress);
    // Add more event listeners for other fields
    
    // Cleanup the event listeners when the component is unmounted
    return () => {
      emailInputRef.current?.removeEventListener('keydown', handleKeyPress);
      
    usernameInputRef.current?.removeEventListener('keydown',handleKeyPress);
      passwordInputRef.current?.removeEventListener('keydown', handleKeyPress);
      roleInputRef.current?.removeEventListener('keydown', handleKeyPress);
      spasswordRef.current?.removeEventListener('keydown', handleKeyPress);
      conform_spasswordRef.current?.removeEventListener('keydown', handleKeyPress);
      // Remove event listeners for other fields
    };
  }, []);
  


  useEffect(()=>{
    const token=sessionStorage.getItem('token');
    if(token){
      navigat(`/${sessionStorage.getItem('user')}`)
    }
  },[])

  const handleRoleChange = (event:any) => {
    if(event.target.value===''){
      setSelectedRole(null)
      return;
    }
    if(event.target.value==='admin'){
      setusername('');
    }
    else
      setSelectedRole(event.target.value);
  };

  const validateloginform=(email:string,password: string,selectedRole: string|null,username:string)=>{

    let isvalid=true;

    if (email === ''){
      emailInputRef.current?.style.setProperty('border-color','red');
      setMessage((p)=>[...p,'Fill the Email'])
      isvalid=false;
    } 
    if (password === ''){
      passwordInputRef.current?.style.setProperty('border-color','red');
      setMessage((p)=>[...p,'Fill the password'])
      
      isvalid=false;
    } 
    if (!selectedRole){
      roleInputRef.current?.style.setProperty('border-color','red');
      setMessage((p)=>[...p,'select user'])
      isvalid=false;
      
     
    }
    else if( selectedRole!=='admin' && username===''){
      usernameInputRef.current?.style.setProperty('border-color','red');
      setMessage((p)=>[...p,'enter username'])
      isvalid=false;
    }
    
    const emailvalid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!emailvalid){
      emailInputRef.current?.style.setProperty('border-color','red');
      setMessage((p)=>[...p,'Email not valid'])
      isvalid=false;
    }

    return isvalid;
  }

  const handleSubmit= async()=> {
    set_loading(true);
    
   try{

   
    const { email, password,username } = formData;
    setMessage([]);
    if (!validateloginform(email,password,selectedRole,username)) {
        throw new Error();
    } 
    
      /*
      sessionStorage.setItem('Admin_Sheet_Id','113ynMauHpX_XTgu9tP9PPJieVS90qZK8Y_P1t1NUtKo');
      sessionStorage.setItem('sheet_exist','Y');
      sessionStorage.setItem('email','Ram');
      setTimeout(() => {
        navigat('/teacher');
      }, 3000);
      */
     
    const response=await  fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,password,username,selectedRole}),
      });

      if (!response.ok) {
        setMessage(['Network Error']);
        throw new Error('Network Error');
      }  
      const data=await response.json();
       
      if(data.hasOwnProperty('error')){
        setMessage((p)=>[...p,'Server Error'])
        throw new Error('server error')
      }
         
      
      if(data.hasOwnProperty('set_password')){
        //for teacher ,student
        sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
        set_opensetpassword_comp(true);
      }

      if(data.hasOwnProperty('logind')){


        //for admin handle
            if(selectedRole==='admin'){
              sessionStorage.setItem('user','admin');
              sessionStorage.setItem('username',data.username);
              sessionStorage.setItem('token',data.token);

              if(data.admin_sheet_Exists){
                sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
              }
              if(data.admin_sheet_access_valid){
                sessionStorage.setItem('admin_sheet_access_valid','Y');
              }
            setTimeout(() => {
              navigat('/admin');
            }, 300);
          }
                   
          //for teacher and student handle
            
            if(selectedRole==='teacher'){
              sessionStorage.setItem('user','teacher');
              sessionStorage.setItem('email',email);
              sessionStorage.setItem('sheet_exist','T');
              sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
              sessionStorage.setItem('Token',data.token)
              setTimeout(()=>navigat('/teacher'),300);
            }
              
            if(selectedRole==='student'){
              //check if sheet db has student img or not if not then take him to upload comp 
             
            }
        }

      set_loading(false);
      setMessage([data.message]);
      
   }
   catch(e:any){
    console.log(e.message);
    set_loading(false);
   }
      

  }
  
  const validatesetpasswdform=(email:string,password: string,selectedRole: string|null,username:string,spassword: string,s_conformpassword: string,adminsheetid: string|null)=>{

    let isvalid=true;
   
    if (email === '' || password === '' || selectedRole===null || username==='' || !adminsheetid ) {
      setMessage((p)=>['Error'])
      return false;
    } 
   
    if(spassword.length<7||s_conformpassword.length<7){
      setMessage((p)=>[...p,'password size atleast 7']);
      conform_spasswordRef.current?.style.setProperty('border-color','red');
      spasswordRef.current?.style.setProperty('border-color','red');
      isvalid= false;
    }
    if(spassword===''){
      setMessage((p)=>[...p,'fill new password']);
      spasswordRef.current?.style.setProperty('border-color','red');
      isvalid= false;
    }
    if(s_conformpassword===''){
      setMessage((p)=>[...p,'fill conform password']);
      conform_spasswordRef.current?.style.setProperty('border-color','red');
      isvalid= false;
    }
    if(spassword !==s_conformpassword){
      setMessage((p)=>[...p,'password not match']);
      conform_spasswordRef.current?.style.setProperty('border-color','red');
      spasswordRef.current?.style.setProperty('border-color','red');
      isvalid= false;
    }

    return isvalid;
    
  }
  

  async function handle_setPasswordSubmit(){
    set_loading(true);
    setMessage([]);
    try{

    const {email,password,username}=formData;
    const adminsheetid=sessionStorage.getItem('Admin_Sheet_Id');

    if(!validatesetpasswdform(email,password,selectedRole,username,spassword,s_conformpassword,adminsheetid)){
      throw new Error();
    }

    const response=await fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=set_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({newpassword:spassword,prepassword:password,Admin_Sheet_Id:adminsheetid,email,selectedRole}),
    })
    if (!response.ok) {
          setMessage(['Network error']);
          throw new Error('Network error');
    }

    const data=await  response.json(); //convert json to object

    if(data.hasOwnProperty('error')){
      setMessage(['server rrror']);
      throw new Error('server error');
    }
          
    if(data.hasOwnProperty('password_set')){
      sessionStorage.setItem('user',selectedRole as string);
      sessionStorage.setItem('email',email);//admin ,student
      sessionStorage.setItem('sheet_exist','T'); 
      sessionStorage.setItem('token',data.token) 
      setTimeout(()=>navigat(`/${selectedRole}`),5000);
    }
    setMessage([data.message]);
    set_loading(false);

  }
  catch(e:any){
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
         
         

            <div className=" mb-8">
              <label htmlFor="email" className={`block ${formData.email.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
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
              <label htmlFor="password" className={`block ${formData.password.length===0 && 'hidden'} text-sm p-1 md:text-xl  opacity-75`}>
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
              <label htmlFor="role" className={`block ${selectedRole===null && 'hidden'}text-sm p-1 md:text-xl  opacity-75 `}>
                Role
              </label>
              <select
                id="role"
                name="role"
                ref={roleInputRef}
                onFocus={(e)=>e.target.style.setProperty('border-color','black')}
                value={selectedRole?.toString()}
                onChange={handleRoleChange}
                className="w-full text-black px-3 py-2 border-2 rounded-md"
              >
               
                <option   value='' >select user</option>
                <option  value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {selectedRole !==null && selectedRole!='admin' && (
              <div className="mb-2">
                <label htmlFor="username" className={`block ${formData.username.length===0 && 'hidden'} text-sm p-1 md:text-xl  opacity-75`}>
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

            <div className='text-center flex flex-col items-center pt-5 gap-y-2'>
        
              {
                    loading
                    ?
                    <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
                   :
                   <button
                    onClick={handleSubmit}
                    className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                    >
                    Submit
                  </button>
              }

              <div  className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                   >
                <Link to="/forget_password" className=''>
                  Forget Password
                </Link>
              </div>
              <div  className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                   >
                <Link to="/signup">
                  Signup
                </Link>
              </div>

            </div>
        
        </div>
        :
        <div className='mb-8'>
       <h1 className=" text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">Set Password</h1>
         
          <div className="mb-8">
            <label htmlFor="newPassword" className={`block ${spassword.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
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
            <label htmlFor="confirmPassword" className={`block ${s_conformpassword.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
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

          <div className='text-center flex flex-col items-center pt-5 gap-y-2'>
        
          {
              loading
              ?
              <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
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
        {message.map((message,i)=> (
        <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}
      </div>
       
      </div>
    </>
  );
 };

export default Login;
function setusername(arg0: string) {
  throw new Error('Function not implemented.');
}

