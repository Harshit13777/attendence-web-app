import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { HomePage } from './home';

export const Main: React.FC = () => {

  //check the 
  const navigate = useNavigate();



  //if  student not login in 
  if (!sessionStorage.getItem('token')) {//token + email 

    setTimeout(() => {
      navigate('/')
    }, 5000);

    return (
      <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p className="text-sm">Account Not Login in</p>
      </div>)
  }
  //if user not admin
  else if (!sessionStorage.getItem('user') || sessionStorage.getItem('user') !== 'student') {

    return (
      <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
        <p className="text-sm">User not valid</p>
      </div>
    )
  }
  else {

    if (!sessionStorage.getItem('sheet_exist')) {
      setTimeout(() => {
        navigate('/sheet invalid')
      }, 500);
      return (

        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">Validating Sheet...</p>
        </div>
      )

    }
    else

      return (
        <>
          <HomePage />
        </>
      );


  }


};