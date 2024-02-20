import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import { Add_data_teacher } from './add_teachers';
import { Login_Email_Status } from './home_login_email_staus';
import { Student_Img_Status } from './home_student_img_status';

import add_data_icon from '../.icons/add_data_icon.png';
import setting from '../.icons/setting.png';
import overview from "../.icons/overview.png";
import logout from "../.icons/logout.png";
import navbar_open from "../.icons/navbar.png";
import system_control from "../.icons/system_control.png";
import check_email from '../.icons/check_email_status.png';
import Add_data_student from './add_student';
import { Edit_student } from './edit_student';
import { Edit_teacher } from './edit_teacher';


// HomePage.tsx



const NavBar = () => {

    const [open, setOpen] = useState(false);
    const [datamenuopen, setdatamenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleOnClick = () => setOpen((prevState) => !prevState);
    const [isfetching, set_isfetching] = useState(false);
    const handleOndatamenu = (e: any) => {
        e.stopPropagation();
        setdatamenuOpen((prevState) => !prevState);
    }

    const handlelogout = () => {
        sessionStorage.clear();
        setTimeout(() => {
            navigate('/login')
        }, 300);
    }



    return (
        <>

            <div className={`${open ? 'w-64' : 'w-16'} fixed h-full min-h-screen md:h-screen p-2 pt-8 bg-slate-900  transition-all duration-300 top-0`}
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

                <ul className="pt-6  menu">

                    <li
                        className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                        <img src={overview} className='' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            Overview
                        </span>
                    </li>


                    <li
                        className={` rounded-lg pt-2 pb-2 cursor-pointer  hover:bg-gray-50 hover:text-slate-900 hover:bg-light-white text-gray-300 text-sm items-center 
                                        mt-2 menu-items `} >


                        <div className='flex origin-left gap-x-4'>
                            <img src={add_data_icon} className='' alt='' />
                            <span className={` ${!open && "hidden"}   duration-200 `} onClick={handleOndatamenu}>
                                Data Management
                                <span className={` hover:text-slate-500  ml-10`} >
                                    ☰
                                </span>
                            </span>
                        </div>
                        <div className={` ${!open && "hidden"}  block ${!datamenuopen && "hidden"}`}>
                            <ul className='pt-5  menu'>
                                <Link to="/admin/add_teacher">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Add Teacher
                                    </li>
                                </Link>
                                <Link to="/admin/add_student">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Add Student
                                    </li>
                                </Link>
                                <Link to="/admin/edit_student">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Edit Student
                                    </li>
                                </Link>
                                <Link to="/admin/edit_teacher">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Edit Teacher
                                    </li>
                                </Link>

                            </ul>
                        </div>


                    </li>

                    <Link to='/admin/login_email_status'>
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={check_email} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Check Email Login Status
                            </span>
                        </li>
                    </Link>
                    <Link to='student_img_status'>
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Check Student img status
                            </span>
                        </li>
                    </Link>

                    <li
                        className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                        <img src={system_control} alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            System Control
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
                                        mt-10 menu-items `} onClick={() => handlelogout()} >
                        <img src={logout} className=' ' alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                            Log-out
                        </span>
                    </li>
                    {/* Item5 */}

                </ul>
            </div >

        </>
    )
}





export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [wdth, setWdth] = useState(window.innerWidth);//width of scroll bar 16

    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])



    return (
        <>

            <div className='flex flex-row bg-gradient-to-tr from-slate-500 to-slate-700 h-fit min-h-screen w-screen'>
                <div className=''>
                    <NavBar />
                </div>

                <div className='ml-16' style={{ width: `${((wdth - 64) / wdth) * 100}%` }}>
                    <Routes>
                        <Route index path="/add_teacher" element={<Add_data_teacher />} />
                        <Route path="/add_student" element={<Add_data_student />} />
                        <Route path="/edit_student" element={<Edit_student />} />
                        <Route path="/edit_teacher" element={<Edit_teacher />} />
                        <Route path="/login_email_status" element={<Login_Email_Status />} />
                        <Route path="/student_img_status" element={<Student_Img_Status />} />
                    </Routes>
                </div>
            </div>

        </>
    )
};

