import React, { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';

const ForgotPassword: React.FC = () => {

  const [email, setEmail] = useState('');
  const [username,setusername]=useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [ForgetCompOn,setForgetCompOn]=useState(true);

  const [Otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRoleChange = (event:any) => {
  setSelectedRole(event.target.value);
  };


  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  let navigat=useNavigate();

  const handleForgetPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(email==='' && selectedRole !=='')
      setMessage('Please fill the form');
    try {
      const response:any = await fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=send-forget-password-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,username
        }),
      });

      if(response.hasOwnProperty('error')){
        setMessage('Server error');
        console.log(response.error);
        return;
    }
      const data = await response.json();
      
      setMessage(data.message);

      setForgetCompOn(false);//show change password component
      
  

    } catch (error) {
      setMessage('Error sending email. Please try again later.');
    }
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) =>  {
    // Check if the new password and confirm password match
    if (newPassword !== confirmPassword) {
      setMessage('New password and confirm password do not match.');
      return;
    }
        const response:any = await fetch(`${sessionStorage.getItem('api')}?page=${selectedRole}&action=change-password`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Otp: Otp,
            newPassword: newPassword,
            email:sessionStorage.getItem('email'),
            username
          }),
        });
        if(response.hasOwnProperty('error')){
          setMessage('Server error');
          console.log(response.error);
          return;
      }
        const data = await response.json();
        setMessage(data.message);
        console.log(data.error);

        // For this example, we'll assume the API call was successful and display a success message
      
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => {
          navigat(`/${selectedRole}/login`);
          setMessage('Loading...');
        }, 3000);
    

  };

  return (
    <div className="container mx-auto">
      <div className="mt-8 p-8 max-w-lg m-auto h-[calc(100vh-50px)] pb-6 bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">
        {ForgetCompOn ? (
          <div>
            <h1 className="text-3xl font-semibold text-center mb-4">Forgot Password</h1>
            <form onSubmit={handleForgetPasswordSubmit}>
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
                >
                  <option value=''>Select User</option>
                  <option value="admin">Admin</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              {selectedRole !== '' && selectedRole !== 'admin' && (
                <div className="mb-4">
                  <label htmlFor="username" className="block text-lg font-medium">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={(e) => setusername(e.target.value)}
                    className="w-full text-black px-3 py-2 border rounded-md"
                  />
                </div>
              )}
              <div className="mb-4">
                <label htmlFor="email" className="block text-lg font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  className="w-full text-black px-3 py-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Send Reset Email
              </button>
            </form>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-semibold text-center mb-4">Change Password</h1>
            <form onSubmit={handleChangePasswordSubmit}>
              <div className="mb-4">
                <label htmlFor="newPassword" className="block text-lg font-medium">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
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
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-black px-3 py-2 border rounded-md"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="Otp" className="block text-lg font-medium">
                  OTP
                </label>
                <input
                  type="text"
                  id="Otp"
                  value={Otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full text-black px-3 py-2 border rounded-md"
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              >
                Change Password
              </button>
              <p>{message}</p>
            </form>
          </div>
        )}
        <p className="text-center mt-4">{message}</p>
      </div>
    </div>
  );
  
};
export default ForgotPassword;
