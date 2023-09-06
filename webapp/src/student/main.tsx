import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';










export const Main: React.FC = () => {
    
    //check the 
    const navigate = useNavigate();

    useEffect(() => {
    const sessionId = sessionStorage.getItem('StudentLogin');
    
    if (!sessionId) {
      navigate('/student/home/signup');
    }
    }, []);
    
    return (
      
        <Routes>
          
          
        
        </Routes>
   
    );
  };
  

