import { BrowserRouter as Router, Link, Route, Routes,useNavigate } from 'react-router-dom';
import { useEffect } from 'react';







export const Main: React.FC = () => {
    
  //check the 
  const navigate = useNavigate();
  
   
  
//if  admin not login in 
  if (sessionStorage.getItem('email')) {
    
    if(!sessionStorage.getItem('sheet_exist')){
      return (<>            
          <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
            <p className="text-sm">Sheet Not exist contact to admin</p>
          </div>
            </>)  
      }
      
    else 
      return (<> 
        </>);

  }
  else{
    setInterval(()=>{
      navigate('/login');
    },3000);
    return(

    <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
      <p className="text-sm">Account Not Login in</p>
    </div>
    
    );
  }


};