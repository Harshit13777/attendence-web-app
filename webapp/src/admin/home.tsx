import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link, useLocation } from 'react-router-dom';
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
import { get_api } from '../static_api';


// HomePage.tsx



const NavBar = () => {

    const [open, setOpen] = useState(false);
    const [datamenuopen, setdatamenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleOnClick = () => setOpen((prevState) => !prevState);
    const [isfetching, set_isfetching] = useState(false);
    const handleOndatamenu = (e: any) => {
        e.stopPropagation();
        setdatamenuOpen((prevState) => !prevState);
    }


    const [route, set_route] = useState<string>('')


    useEffect(() => {//get current route
        const pathname = location.pathname;
        const routes = pathname.split('/');
        const current_route = routes.pop()
        if (current_route)
            set_route(current_route)
        else set_route('admin')

    }
    )

    const handlelogout = () => {
        sessionStorage.clear();
        localStorage.removeItem('User_data')
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

                <ul className="pt-6 overflow-y-auto menu">

                    <Link to="/admin/">
                        <li
                            className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={overview} className={`${open ? 'w-8 h-8' : ''} ${route === 'admin' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                    </Link>


                    <li
                        className={` rounded-lg pt-2 pb-2 cursor-pointer  hover:bg-gray-50 hover:text-slate-900 hover:bg-light-white text-gray-300 text-sm items-center 
                                        mt-2 menu-items `} >


                        <div className='flex origin-left gap-x-4'>
                            <img src={add_data_icon} className={`${open ? 'w-8 h-8' : ''} ${/^(add_teacher|add_student|edit_student|edit_teacher)$/.test(route) && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
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

                    {
                        <Link to='/admin/login_email_status'>
                            <li
                                className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                    mt-2 menu-items `} >
                                <img src={check_email} className={`${open ? 'w-8 h-8' : ''} ${route === 'login_email_status' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                                <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                    Check Email Login Status
                                </span>
                            </li>
                        </Link>
                        /*
                        <Link to='student_img_status'>
                            <li
                                className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                            mt-2 menu-items `} >
                                <img className={`${open ? 'w-8 h-8' : ''} ${route === 'student_img_status' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                                <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                    Check Student img status
                                </span>
                            </li>
                        </Link>
        
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                            mt-2 menu-items `} >
                            <img src={system_control}  className={`${open ? 'w-8 h-8' : ''} ${route === '' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                System Control
                            </span>
                        </li>
        
        
        
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                            mt-10 menu-items `} >
                            <img src={setting}  className={`${open ? 'w-8 h-8' : ''} ${route === 'setting' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Settings
                            </span>
                        </li>
                                */
                    }
                    <li
                        className={`flex pt-2 pb-2 cursor-pointer  text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} onClick={() => handlelogout()} >
                        <img src={logout} className={`${open ? 'w-8 h-8' : ''}`} alt="" />
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

interface DataRow_Student {
    Student_Name: string;
    Student_Roll_No: string;
    Student_Email: string;
    [key: string]: string; // Index signature to allow dynamic properties
}
type Store_Student_Data = {
    [key: string]: DataRow_Student;
}


interface DataRow_Teacher {
    Teacher_Name: string;
    Teacher_Email: string;
    [key: string]: string; // Index signature to allow dynamic properties
}

type Store_Teacher_Data = {
    [key: string]: DataRow_Teacher;
}


export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [wdth, setWdth] = useState(window.innerWidth);//width of scroll bar 16
    const [is_sync, set_issync] = useState(false)
    const [sync_message, set_sync_message] = useState<string[]>([])

    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])

    const syncing_student = async () => {


        // Check attendance sheet name presence and sync
        const student_store_key = sessionStorage.getItem('student_data_key');
        const teacher_store_key = sessionStorage.getItem('teacher_data_key');

        if (!student_store_key || !teacher_store_key) {
            set_sync_message(['Error']);
            return;
        } else {
            const sync_student_data = async (all_store_ids: string[]) => {
                try {
                    set_issync(true)
                    const token = sessionStorage.getItem('token');
                    if (!token) {
                        sessionStorage.clear();
                        setTimeout(() =>
                            navigate('/login')
                            , 5000);
                        throw new Error('Error : No Token Found')
                    }

                    const response: Response = await fetch(`${get_api().admin_api}?page=admin&action=sync_student_data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify({
                            token, all_store_ids
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }

                    const data = await response.json();

                    console.log("response", data)

                    if (data.hasOwnProperty('sheet_invalid')) {
                        sessionStorage.removeItem('sheet_exist')
                        setTimeout(() => {
                            navigate('/sheet invalid')
                        }, 50);
                    }

                    if (data.hasOwnProperty('sheet_Erased')) {
                        if (data.sheet_Erased.includes('Student')) {
                            localStorage.removeItem(student_store_key)
                        }
                        else if (data.sheet_Erased.includes('Teacher')) {
                            localStorage.removeItem(teacher_store_key)
                        }
                        setTimeout(() => {
                            navigate('/admin')
                        }, 1000);
                        throw new Error(data.sheet_Erased);

                    }


                    if (data.hasOwnProperty('Add_data') && data.hasOwnProperty('Delete_data')) {
                        //add data which received in localstorage
                        const json = localStorage.getItem(student_store_key)
                        let updated_data: Store_Student_Data = {};
                        const receve_add_data: Store_Student_Data = data.Add_data;
                        const delete_id: string[] = data.Delete_data;
                        if (json) {
                            const saved_data = JSON.parse(json)

                            //delete id from stored data
                            delete_id.map((id, i) => {
                                delete saved_data[id]
                            })

                            updated_data = { ...saved_data, ...receve_add_data }
                        }
                        else {
                            //if no store data then no need to delete data
                            updated_data = receve_add_data
                        }
                        localStorage.setItem(student_store_key, JSON.stringify(updated_data))
                        console.log('updated_data', updated_data)
                        set_sync_message((p) => [...p, 'Successfully Sync'])
                        set_issync(false)
                    }
                    else {
                        throw new Error("Not Received data");
                    }


                } catch (error: any) {

                    set_sync_message((p) => [...p, error.message])
                    //setMessage('Error. Please try again later.');
                    console.error(error);
                }
            };
            const sync_teacher_data = async (all_store_ids: string[]) => {
                try {
                    set_issync(true)
                    const token = sessionStorage.getItem('token');
                    if (!token) {
                        sessionStorage.clear();
                        setTimeout(() =>
                            navigate('/login')
                            , 5000);
                        throw new Error('Error : No Token Found')
                    }

                    const response: Response = await fetch(`${get_api().admin_api}?page=admin&action=sync_teacher_data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify({
                            token, all_store_ids
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }

                    const data = await response.json();

                    console.log("response", data)

                    if (data.hasOwnProperty('sheet_invalid')) {
                        sessionStorage.removeItem('sheet_exist')
                        setTimeout(() => {
                            navigate('/sheet invalid')
                        }, 50);
                    }

                    if (data.hasOwnProperty('sheet_Erased')) {
                        if (data.sheet_Erased.includes('Student')) {
                            localStorage.removeItem(student_store_key)
                        }
                        else if (data.sheet_Erased.includes('Teacher')) {
                            localStorage.removeItem(student_store_key)
                        }
                        setTimeout(() => {
                            navigate('/admin')
                        }, 1000);
                        throw new Error(data.sheet_Erased);

                    }


                    if (data.hasOwnProperty('Add_data') && data.hasOwnProperty('Delete_data')) {
                        //add data which received in localstorage
                        const json = localStorage.getItem(teacher_store_key)
                        let updated_data: Store_Teacher_Data = {};
                        const receve_add_data: Store_Teacher_Data = data.Add_data;
                        const delete_id: string[] = data.Delete_data;
                        if (json) {
                            const saved_data = JSON.parse(json)

                            //delete id from stored data
                            delete_id.map((id, i) => {
                                delete saved_data[id]
                            })

                            updated_data = { ...saved_data, ...receve_add_data }
                        }
                        else {
                            //if no store data then no need to delete data
                            updated_data = receve_add_data
                        }
                        localStorage.setItem(teacher_store_key, JSON.stringify(updated_data))
                        set_sync_message((p) => [...p, 'Successfully Sync'])
                        set_issync(false)
                    }
                    else {
                        throw new Error("Not Received data");

                    }


                } catch (error: any) {

                    set_sync_message((p) => [...p, error.message])
                    //setMessage('Error. Please try again later.');
                    console.error(error);
                }
            };

            const dataJson = localStorage.getItem(student_store_key);
            let S_all_store_ids: string[] = []
            if (dataJson) {
                const Student_data = JSON.parse(dataJson);
                S_all_store_ids = Object.keys(Student_data)
            }
            console.log('saved ids student', S_all_store_ids)
            set_sync_message((p) => ['Syncing Student Data'])
            await sync_student_data(S_all_store_ids)

            // Check attendance sheet name presence and sync
            const TdataJson = localStorage.getItem(teacher_store_key);
            let T_all_store_ids: string[] = []
            if (TdataJson) {
                const Teacher_data = JSON.parse(TdataJson);
                T_all_store_ids = Object.keys(Teacher_data)
            }
            console.log(' teacher saved IDs', T_all_store_ids)
            set_sync_message((p) => [...p, 'Syncing Teacher Data'])
            await sync_teacher_data(T_all_store_ids)

        }

    };

    useEffect(() => {

        console.log('syncing...')

        syncing_student();
        //testing 
        set_issync(false)

    }, [])

    return (
        <>

            <div className='flex flex-row bg-gradient-to-tr from-slate-500 to-slate-700 h-fit min-h-screen w-screen'>
                <div className=''>
                    <NavBar />
                </div>
                {
                    is_sync ?

                        <div className='absolute top-1/4  left-1/2 right-1/2 text-center items-center justify-center gap-y-10'>

                            <h1 className=" text-2xl md:text-5xl font-extrabold text-gray-900 ">
                                Syncing...
                            </h1>
                            {sync_message.length !== 0 &&
                                sync_message.map((message, i) => (
                                    <div className="bg-blue-100 w-52 text-center mt-5 border-t border-b border-blue-300 text-blue-700 px-4 py-3" role="alert">
                                        <p className="text-lg">{message}</p>
                                    </div>
                                ))}
                        </div>

                        :
                        <div className='ml-16' style={{ width: '100%', maxWidth: 'calc(100% - 64px)' }}>
                            <Routes>
                                <Route index path="/add_teacher" element={<Add_data_teacher />} />
                                <Route path="/add_student" element={<Add_data_student />} />
                                <Route path="/edit_student" element={<Edit_student />} />
                                <Route path="/edit_teacher" element={<Edit_teacher />} />
                                <Route path="/login_email_status" element={<Login_Email_Status />} />
                                <Route path="/student_img_status" element={<Student_Img_Status />} />
                            </Routes>
                        </div>
                }
            </div>

        </>
    )
};

function syncing() {
    throw new Error('Function not implemented.');
}

