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

  const locat = useLocation();
  const navigat = useNavigate();


  const handleRoleChange = (event:any) => {
    setSelectedRole(event.target.value);
  };

  useEffect(() => {if(sessionStorage.getItem('username')){navigat('/admin/Checking_admin_sheet_exist')}}, [navigat, locat]);//if somebody logined 

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    const { email, password } = formData;
    if (email === '' || password === '') {
      alert('Please fill in all fields');
    } else {
      setMessage('loging...');
      // Perform login logic here

      fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
        .then((response) => {
          if (!response.ok) {
            setMessage('Network error');
            throw new Error('Network response was not ok');
          }

          return response.json(); //convert json to object
        })
        .then((data) => {
            setMessage(data.message);
            console.log(data.error);

          setFormData({
            email: '',
            password: '',
            username:''
          });

          
          sessionStorage.setItem('username',data.username);
          
          if(selectedRole==='admin'){

            if(data.admin_sheet_Exists){
              sessionStorage.setItem('Admin_Sheet_Id',data.Admin_Sheet_Id);
            }
            if(data.admin_sheet_access_valid){
              sessionStorage.setItem('admin_sheet_access_valid','Y');
            }
            setTimeout(() => {
              navigat('/admin/home');
              setMessage('loading...');
            }, 5000);
            
          }
          else {
            if(data.canlogin){
              setTimeout(() => {
                navigat(`${selectedRole}/home`);
                setMessage('loading...');
              }, 5000);
            }
            else{
                setMessage('Error: contact to admin');
              }
          }
          

        });
    }
  }

  return (
    <>
      <div className="container mx-auto">
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
              <Link to="/admin/forget_password" className=''>
                Forget Password
              </Link>
            </div>
            <div className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center justify-center">
              <Link to="/admin/signup">
                Signup
              </Link>
            </div>

          </form>
        </div>
        <p className="text-center mt-4">{message}</p>
      </div>
    </>
  );
 };

export default Login;
