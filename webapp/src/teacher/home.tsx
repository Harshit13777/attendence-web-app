import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import AddAttendanceSheet from './Add_Attendence_Sheet';
import TakeAttendance from './Take_attendence';
import GetAttendanceSheet from './Get_attendance';

import addDataIcon from '../.icons/add.png';
import overviewIcon from "../.icons/overview.png";
import logoutIcon from "../.icons/logout.png";
import navbarIcon from "../.icons/navbar.png";
import settingIcon from "../.icons/setting.png";
import checkEmailIcon from '../.icons/check_email_status.png';
import systemControlIcon from "../.icons/system_control.png";

const NavBar = () => {
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const handleOnClick = () => {
        setOpen(prevState => !prevState);
    };

    const logout = () => {
        sessionStorage.clear();
        setTimeout(() => {
            navigate('/login');
        }, 200);
    };

    return (
        <>
            <div className={`${open ? 'w-64' : ' w-16'} h-screen p-2 pt-8 bg-slate-900  transition-all duration-300 top-0`}
                onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
            >
                <div className={`flex  rounded-md pt-2 pb-2 text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `} >

                    {
                        !open ?
                            <img src={navbarIcon} onTouchStart={() => setOpen(true)} alt="" />
                            :
                            <img src={navbarIcon} className=' rotate-180  translate-x-28' onTouchStart={() => setOpen(false)} alt="" />
                    }
                </div>

                <ul className="pt-6 menu">
                    <li className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                        <img src={overviewIcon} className='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            Overview
                        </span>
                    </li>

                    <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src={addDataIcon} alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/add_subject'>Add Attendance Sheet</Link>
                        </span>
                    </li>

                    <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/take_attendance'>Take Attendance</Link>
                        </span>
                    </li>

                    <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            <Link to='/teacher/get_attendance_sheet'>Get Attendance Sheet</Link>
                        </span>
                    </li>

                    <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                        <img src={settingIcon} alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            Settings
                        </span>
                    </li>

                    <li className={`flex pt-2 pb-2 cursor-pointer  text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                        <img src={logoutIcon} className=' ' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`} onClick={logout}>
                            Log-out
                        </span>
                    </li>
                </ul>
            </div>
        </>
    )
};

const HomePage = () => {
    return (
        <>
            <div className='flex flex-row w-screen'>
                <div className=''>
                    <NavBar />
                </div>

                <div className='w-full'>
                    <Routes>
                        <Route path="/add_subject" element={<AddAttendanceSheet />} />
                        <Route path="/get_attendance_sheet" element={<GetAttendanceSheet />} />
                        <Route index path='/take_attendance' element={<TakeAttendance />} />
                    </Routes>
                </div>
            </div>
        </>
    )
};

export default HomePage;
