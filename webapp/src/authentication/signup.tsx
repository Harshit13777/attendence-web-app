import { localservices } from 'googleapis/build/src/apis/localservices';
import React, { useState, useEffect } from 'react';
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
  const [message, setMessage] = useState('');

  const locat = useLocation();
  const navigat = useNavigate();

  useEffect(() => {/*to move to next */}, [navigat, locat]);

  function validateForm() {
    const { name, email, password } = formData;
    if (name === '' && email === '') {
      alert('Fill the form');
      return false;
    }

    const pattern = [/\w{7,14}/, /[A-Z]/, /[a-z]/, /\d/];

    for (let x of pattern) {
      if (x.test(password) === false) {
        alert('Password must fulfill the requirements');
        return false;
      }
    }
    return true;
  }

  function handleSubmit(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    event.preventDefault();
    if (validateForm()) {
      setMessage('creating ...');
      fetch(`${sessionStorage.getItem('api')}?page=admin&action=signup`, {
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
            username:'',
            name: '',
            email: '',
            password: '',
          });

          
          setTimeout(() => {
            navigat('/admin/login');
            setMessage('loading...');
          }, 5000);
        });
    }
  }

  return (
    <>
      <div className="container mx-auto">
        <div className="mt-8 p-8 max-w-lg m-auto h-[calc(100vh-50px)] pb-6 bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">
          <h1 className="text-3xl font-semibold text-center mb-4">SIGN UP</h1>
          <form>
            <div className="mb-4">
              <label htmlFor="name" className="block text-lg font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full text-black px-3 py-2 border rounded-md"
              />
            </div>
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
                className="w-full text-black px-3 py-2 border rounded-md"
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
              <p className="testresult" style={{ WebkitTextFillColor: 'white' }}>
                Password must contain:
                <br />
                at least 1 capital letter
                <br />
                digit: 1-9
                <br />
                max size 14, min size 7
              </p>
            </div>
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
              onClick={handleSubmit}
            >
              Submit
            </button>
            <div className="mt-4 w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 flex items-center justify-center">
              <Link to="/admin/login">
                Login
              </Link>
            </div>
          </form>
        </div>
        <p className="text-center mt-4">{message}</p>
      </div>
    </>
  );
  
 };

export default Signup;
