import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Add_Attendence_Sheet from "./Add_Attendence_Sheet";
import { Take_Attendence } from "./Take_attendence";
import Get_Attendance_Sheet from './Get_attendance'

import add_data_icon from '../.icons/add.png';
import setting from '../.icons/setting.png';
import overview from "../.icons/overview.png";
import logout_icon from "../.icons/logout.png";
import navbar_open from "../.icons/navbar.png";
import system_control from "../.icons/system_control.png";
import check_email from '../.icons/check_email_status.png';
import { setDefaultResultOrder } from 'dns/promises';
import { setMaxIdleHTTPParsers } from 'http';
import Get_Attendence_Sheet from './Get_attendance';

const NavBar = () => {



    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const handleOnClick = () => {

        setOpen((prevState) => !prevState);

    }


    const logout = () => {
        sessionStorage.clear();
        setTimeout(() => {
            navigate('/login');
        }, 200);
    }


    return (
        <>

            <div className={`${open ? 'w-64' : ' w-16'} h-screen p-2 pt-8 bg-slate-900  transition-all duration-300 top-0`}
                onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
            >
                <div className={`flex  rounded-md pt-2 pb-2 text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `} >

                    {
                        !open ?
                            <img src={navbar_open} onTouchStart={() => setOpen(true)} alt="" />
                            :
                            <img src={navbar_open} className=' rotate-180  translate-x-28' onTouchStart={() => setOpen(false)} alt="" />}


                </div>

                <ul className="pt-6 menu">

                    <li
                        className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                        <img src={overview} className='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            Overview
                        </span>
                    </li>


                    <li
                        className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src={add_data_icon} alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/add_subject'>Add Attendence Sheet</Link>
                        </span>
                    </li>
                    <li
                        className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/take_attendance'>Take_Attendence</Link>
                        </span>
                    </li>
                    <li
                        className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/get_attendence_sheet'>Get Attendence Sheet</Link>
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

        </>
    )
}



const HomePage = () => {
    //syncing attendence sheet name in local storage

    return (
        <>
            <div className='flex flex-row w-screen'>
                <div className=''>
                    <NavBar />

                </div>

                <div className='w-full'>
                    <Routes>
                        <Route path="/add_subject" element={<Add_Attendence_Sheet />} />
                        <Route path="/get_attendence_sheet" element={<Get_Attendence_Sheet />} />
                        <Route index path='/take_attendance' element={<Take_Attendence />} />
                    </Routes>
                </div>
            </div>

        </>
    )
};

export default HomePage;