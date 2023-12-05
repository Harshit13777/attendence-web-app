import { localservices } from 'googleapis/build/src/apis/localservices';
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';


interface FormData {
  username:string;
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    username:'',
    name: '',
    email: '',
    password: '',
  });
  const [message, setMessage] = useState(['']);

  const locat = useLocation();
  const navigat = useNavigate();
  const [loading,set_loading]=useState(false);
 
  const nameInputRef = useRef<HTMLInputElement|null>(null);
  const emailInputRef = useRef<HTMLInputElement|null>(null);
  const passwordInputRef = useRef<HTMLInputElement|null>(null);
  const usernameInputRef = useRef<HTMLInputElement|null>(null);


  useEffect(() => {
    const handleKeyPress = (e:any) => {
      if (e.key === 'Enter') {
        switch (e.target.name) {
          case 'name':
            usernameInputRef.current?.focus();
            break;
            case 'username':
              emailInputRef.current?.focus();
              break;
          case 'email':
            passwordInputRef.current?.focus();
            break;
          case 'password':
            handleSubmit();
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
    passwordInputRef.current?.addEventListener('keydown', handleKeyPress);
    nameInputRef.current?.addEventListener('keydown', handleKeyPress);
    usernameInputRef.current?.addEventListener('keydown', handleKeyPress);
    // Add more event listeners for other fields
    
    // Cleanup the event listeners when the component is unmounted
    return () => {
      emailInputRef.current?.removeEventListener('keydown', handleKeyPress);
      passwordInputRef.current?.removeEventListener('keydown', handleKeyPress);
      nameInputRef.current?.removeEventListener('keydown', handleKeyPress);
      usernameInputRef.current?.removeEventListener('keydown', handleKeyPress);
      // Remove event listeners for other fields
    };
  }, []);
  


  useEffect(()=>{
    const token=sessionStorage.getItem('token');
    if(token){
      navigat(`/${sessionStorage.getItem('user')}`)
    }
  },[])


  function validateForm(name: string,username: string,email: string,password: string) {

    let isvalid=true;
    if (name === ''){
      nameInputRef.current?.style.setProperty('border-color','red');
      isvalid=false;
      setMessage((p)=>[...p,'Fill the Name'])
    }
    if(username===''){
      usernameInputRef.current?.style.setProperty('border-color','red');
      isvalid=false;
      setMessage((p)=>[...p,'Fill the Username'])
    }
    if(email===''){
      emailInputRef.current?.style.setProperty('border-color','red');
      isvalid=false;
      setMessage((p)=>[...p,'Fill the Email'])
    }
    if(password===''){
      passwordInputRef.current?.style.setProperty('border-color','red');
      isvalid=false;
      setMessage((p)=>[...p,'Fill the Password'])
    }
    
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if(!validEmail){
      emailInputRef.current?.style.setProperty('border-color','red');
      isvalid=false;
      setMessage((p)=>[...p,'Email not valid'])
    }

    return isvalid;
  }


  async function handleSubmit() {
    const {email,name,password,username}=formData;
    setMessage([])
    try{

    if (!validateForm(name,username,email,password)){
      throw new Error();
    }
    
    
    const response=await fetch(`${sessionStorage.getItem('api')}?page=admin&action=signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({name,email,username,password}),
      })
      
    if (!response.ok) {
      setMessage(['Network error']);
      throw new Error('Network response was not ok');
    }

    const data=await  response.json(); //convert json to object
         
    if(data.hasOwnProperty('error')){
      setMessage(['server error']);
      throw new Error('server error')
    }
    if(data.hasOwnProperty('account_created')){
      setTimeout(() => {
        navigat('/login');
      }, 5000);
    }
    setMessage([data.message]);
    set_loading(false);
      
    }catch(e:any){
      set_loading(false);
      console.log(e.message);
    }
  }
  

  return (
    <>
      <div className="mx-auto bg-gray-750 pt-4 pb-4 md:p-8">
        <div className="p-8 m-auto  h-max min-h-[calc(100vh-32px)]  md:min-h-[calc(100vh-64px)]  md:h-screen md:w-7/12 lg:w-5/12  bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">
            <h1 className="text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">Signup</h1>

            <div className="mb-8">
              <label htmlFor="name" className={`block ${formData.name.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                ref={nameInputRef}
                placeholder='Enter Name'
                value={formData.name}
                maxLength={50}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full   text-black px-3 py-2  rounded-md border-2"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="username" className={`block ${formData.username.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                maxLength={50}
                ref={usernameInputRef}
                placeholder='Enter Username'
                aria-placeholder='admin@137'
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full   text-black px-3 py-2  rounded-md border-2"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="email" className={`block ${formData.email.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                maxLength={50}
                ref={emailInputRef}
                placeholder='Enter Email'
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full   text-black px-3 py-2  rounded-md border-2"
              />
            </div>
            <div className="mb-8">
              <label htmlFor="password" className={`block ${formData.password.length===0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                maxLength={50}
                ref={passwordInputRef}
                placeholder='Enter Password'
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full   text-black px-3 py-2  rounded-md border-2"
              />  
            </div>
            <div className=' m-10 text-center flex flex-col items-center pt-5 gap-y-2'>
        
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
                <Link to="/login">
                  Login
                </Link>
              </div>
            </div>
        
            { message.map((message,i)=> (
        <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}
        </div>
      </div>
    </>
  );
  
 };

export default Signup;
