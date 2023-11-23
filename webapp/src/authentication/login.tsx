import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

interface FormData {
  email: string;
  password: string;
  username:string;
}
interface user{

}

const Login: React.FC = () => {

  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    username:''
  });
  const [open_setpassword_comp,set_opensetpassword_comp]=useState(false);
  const [spassword,set_spassword]=useState('');
  const [s_conformpassword,set_sconformpassword]=useState('');

  
  const locat = useLocation();
  const navigat = useNavigate();

  function logout(){
    sessionStorage.clear();
  }

  const handleRoleChange = (event:any) => {
    setSelectedRole(event.target.value);
  };

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const { email, password,username } = formData;
    if (email === '' || password === '') {
      alert('Please fill in all fields');
    } 
    else {
      setMessage('loging...');
      // Perform login logic here
      sessionStorage.setItem('Admin_Sheet_Id','Admin_Sheet_Id');
      sessionStorage.setItem('admin_sheet_access_valid','Y');
      sessionStorage.setItem('username','Ram');
      setTimeout(() => {
        navigat('/admin/');
      }, 3000);
      /*
      fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({email,password,username,selectedRole}),
      })
        .then((response:any) => {
          if (!response.ok) {
            setMessage('Network error');
          }
          if(response.hasOwnProperty('error')){
            setMessage('Server error');
            console.log(response.error);
            return;
        }
          return response.json(); //convert json to object
        })
        .then((data) => {
            setMessage(data.message);
            console.log(data.error);

          
            
            
            //for admin handle
            if(selectedRole==='admin'){
              
              if(data.admin_sheet_Exists){
                sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
              }
              if(data.admin_sheet_access_valid){
                sessionStorage.setItem('admin_sheet_access_valid','Y');
              }
              sessionStorage.setItem('username',data.username);
            setTimeout(() => {
              navigat('/admin');
            }, 3000);
            
            
          }//for teacher and student handle
          else {
            setMessage(data.message);
            if(data.message=='Seting_password'){
              set_opensetpassword_comp(true);
              sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);

              return;
            }
            if(data.hasOwnProperty('Admin_Sheet_Id')){

              sessionStorage.setItem('email',email);
              sessionStorage.setItem('sheet_exist','T');
              sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
              
              if(selectedRole==='student'){
                //check if sheet db has student img or not if not then take him to upload comp 
                if(!data.student_img_upload){
                  sessionStorage.setItem('upload_img','T');
                }
              }
              setTimeout(() => {
                navigat(`/${selectedRole}`);   
              }, 3000);
            }
            else{
              setMessage('Error: contact to admin');
            }
          }
          setFormData({
          email: '',
          password: '',
          username:''
        });
          

        });
        */
    }
  }

  function handle_setPasswordSubmit(){
    const {email,password,username}=formData;
    if(spassword==='' || s_conformpassword===''){
      setMessage('Fill the form');
      return;
    }
    if(spassword !==s_conformpassword){
      setMessage('password not same');
      return;
    }
    const Admin_Sheet_Id=sessionStorage.getItem('Admin_Sheet_Id');
    if(!Admin_Sheet_Id){
      setMessage('Reload this page');
      return ;
    }

    fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=set_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({newpassword:spassword,Admin_Sheet_Id,email,selectedRole}),
    })
      .then((response:any) => {
        if (!response.ok) {
          setMessage('Network error');
        }
        if(response.hasOwnProperty('error')){
          setMessage('Server error');
          console.log(response.error);
          return;
      }
        return response.json(); //convert json to object
      })
      .then((data) => {
          setMessage(data.message);
          console.log(data.error);

          
          
          setMessage(data.message);

          if(data.message=='password set'){
            setMessage('Your new password set');
            sessionStorage.setItem('email',email);
            sessionStorage.setItem('sheet_exist','T');
            sessionStorage.setItem('upload_img','T');
              
            
            return;
        }
          if(data.hasOwnProperty('sheet_access') && !data.sheet_access){
              setMessage(data.message);
              return;
          }
      });
  }

  return (
    <>
      <div className="container mx-auto">
        
        {//login comp
          !open_setpassword_comp && 
          <div className="mt-8 p-8 max-w-lg m-auto h-[calc(100vh-50px)] pb-6 bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">
          <h1 className="text-3xl font-semibold text-center mb-4">LOGIN UP</h1>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-lg font-medium">
                Email address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className=" w-full  text-black px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-lg font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full text-black px-3 py-2 border rounded-md"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="block text-lg font-medium">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={selectedRole}
                onChange={handleRoleChange}
                className="w-full text-black px-3 py-2 border rounded-md"
              >choose
               
                <option   value='' >select user</option>
                <option  value="admin">Admin</option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
            </div>

            {selectedRole !=='' && selectedRole!='admin' && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-lg font-medium">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full text-black px-3 py-2 border rounded-md"
                />
              </div>
            )}

            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>

            <div className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center justify-center">
              <Link to="/forget_password" className=''>
                Forget Password
              </Link>
            </div>
            <div className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center justify-center">
              <Link to="/signup">
                Signup
              </Link>
            </div>

          </form>
        </div>}
        {//set password comp
        open_setpassword_comp &&
        <div>
        <h1 className="text-3xl font-semibold text-center mb-4">set Password</h1>
        <form onSubmit={handle_setPasswordSubmit}>
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-lg font-medium">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              value={spassword}
              onChange={(e) => set_spassword(e.target.value)}
              className="w-full text-black px-3 py-2 border rounded-md"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-lg font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={s_conformpassword}
              onChange={(e) => set_sconformpassword(e.target.value)}
              className="w-full text-black px-3 py-2 border rounded-md"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
          >
            Set Password
          </button>
        </form>
      </div>
        }
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 p-6 shadow-md">
        <p className="text-xl">{message}</p>
      </div>
      </div>
    </>
  );
 };

export default Login;
