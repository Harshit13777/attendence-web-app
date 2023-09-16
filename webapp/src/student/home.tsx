import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate,Link } from 'react-router-dom';
import logout from "../.icons/logout.png";
import navbar_open from "../.icons/navbar.png";
import overview from "../.icons/overview.png";

const NavBar=()=> {
    
    const [open, setOpen] = useState(false);
    const [datamenuopen, setdatamenuOpen] = useState(false);
    
    const handleOnClick = () => setOpen((prevState) => !prevState);
    const handleOndatamenu = (e:any) =>{
        e.stopPropagation();
        setdatamenuOpen((prevState) => !prevState);
    } 
    

    return (
        <>
            <div className= {`  contain h-screen  `}  onMouseEnter={handleOnClick} onMouseLeave={handleOnClick}>
                <div className={`${
                    open ? 'w-64' : ' w-16'} h-screen p-2 pt-8 bg-slate-900 fixed transition-all duration-300 top-0`}
                    style={{
                        backgroundImage: `url('your-favicon-image-url')`,
                        backgroundSize: open ? 'auto' : 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                      }}    >
                    <div className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}> 
                        <img src={navbar_open} alt="" onClick={handleOnClick} />
                    </div>
                
                    <ul className="pt-6 h-screen menu">
                    
                        <li
                            className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={overview} className='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                        
                      
                        
                       
                    
                       

            
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer  text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                            <img src={logout} className=' ' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Log-out
                            </span>
                        </li>
                        {/* Item5 */}
                        
                    </ul>
                </div>
                <div>
                </div>
            </div>
        </>
    )
}

export const HomePage =()=>{
    const navigate =useNavigate();
  return (
    <>
       
            <div className='flex'>
                <div className='w-1/7'>
                    <NavBar/>
                </div>

                <div className='w-6/7 ml-16'>
                    <Routes>
                            
                    </Routes>
                </div>
            </div>
        
    </>
  )
}
export default HomePage;