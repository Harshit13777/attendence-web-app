import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';








export const Main: React.FC = () => {
    
    //check the 
    const navigate = useNavigate();

    useEffect(() => {
    const sessionId = sessionStorage.getItem('TeacherLogin');
    
    if (!sessionId) {
      navigate('/Teacher/home/login');
    }
    }, []);
    
    return (
      
        <Routes>
          
        
        </Routes>
   
    );
  };
  

