import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate,Link } from 'react-router-dom';
import axios from 'axios';
import Add_Attendence_Sheet from "./Add_Attendence_Sheet";
import { Take_Attendence } from "./Take_attendence";

import add_data_icon from '../.icons/add.png';
import setting from '../.icons/setting.png';
import overview from "../.icons/overview.png";
import logout_icon from "../.icons/logout.png";
import navbar_open from "../.icons/navbar.png";
import system_control from "../.icons/system_control.png";
import check_email from '../.icons/check_email_status.png';
import { setDefaultResultOrder } from 'dns/promises';
import { setMaxIdleHTTPParsers } from 'http';



const NavBar=()=> {

    
    
    const [open, setOpen] = useState(false);
    const [datamenuopen, setdatamenuOpen] = useState(false);
    const navigate=useNavigate();
    const handleOnClick = () => setOpen((prevState) => !prevState);
    const handleOndatamenu = (e:any) =>{
        e.stopPropagation();
        setdatamenuOpen((prevState) => !prevState);
    } 

    const logout=()=>{
        sessionStorage.clear();
        setInterval(()=>{
            navigate('/login');
        },200);
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
                    //overview
                        <li
                            className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={overview} className='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                        
                      
                     //add attendence sheet   
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={add_data_icon}  alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                <Link to='/add_attendence_sheet'>Add Attendence Sheet</Link>
                            </span>
                        </li>
                    //take attendece
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src=''  alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                <Link to='/take_attendence'>Take_Attendence</Link>
                            </span>
                        </li>
                    //get attendece sheet
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src=''  alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                <Link to='/get_attendence_sheet'>Get Attendence Sheet</Link>
                            </span>
                        </li>
                        
                       
                        

                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                            <img src={setting} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Settings
                            </span>
                        </li>
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer  text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                            <img src={logout_icon} className=' ' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`} onClick={logout}>
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



const HomePage=({setMessage}:any)=>{
//syncing attendence sheet name in local storage

    const navigate =useNavigate();
    const sheet_name_json=localStorage.getItem('Attendence_Sheet_Name')
    const student_imgs_json=localStorage.getItem('Student_Imgs');
   
    if(!sheet_name_json){
      return (
          <Add_Attendence_Sheet pre_sheet_arr={['']}/>
        
      )
    }
    if(!student_imgs_json){
        return(<><h1>No Student Imgs found</h1></>)
    }

    const sheet_name_arr:string[]=JSON.parse(sheet_name_json);
  return (
    <>
       
            <div className='flex'>
                <div className='w-1/7'>
                    <NavBar/>
                </div>

                <div className='w-6/7 ml-16'>
                    <Routes>
                        <Route path="/add_attendence_sheet" element={<Add_Attendence_Sheet pre_sheet_arr={sheet_name_arr}/>} />
                        <Route path="/take_attendence" element={<Take_Attendence student_imgs_json={student_imgs_json} sheet_name={sheet_name_arr}/>} />
                    </Routes>                
                </div>
            </div>
        
    </>
  )
};

export default HomePage;