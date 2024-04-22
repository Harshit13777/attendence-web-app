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
import { Admin_overview } from '../overview/admin_overview';
import Joyride, { ACTIONS, EVENTS, ORIGIN, STATUS, CallBackProps, Placement, Styles } from 'react-joyride';
import { act } from 'react-dom/test-utils';
import { stat } from 'fs';


// HomePage.tsx



const NavBar = ({ open, setOpen, datamenuopen, setdatamenuOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>>, datamenuopen: boolean, setdatamenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {


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
            navigate('/')
        }, 300);
    }









    return (
        <div className=' relative overflow-visible'>


            <div className={`${open ? 'w-64' : 'w-16'}  fixed h-full min-h-screen md:h-screen p-2 pt-8 bg-slate-900  transition-all duration-300 top-0`}
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

                <ul data-testid="navbartop" className=" pt-6 overflow-y-auto menu">

                    <Link to="/admin/" className='' data-testid="overview-link">
                        <li
                            className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={overview} className={`${open ? 'w-8 h-8' : ''} ${route === 'admin' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                    </Link>


                    <li data-testid="data-management-link"
                        className={` rounded-lg pt-2 pb-2 cursor-pointer  hover:bg-gray-50 hover:text-slate-900 hover:bg-light-white text-gray-300 text-sm items-center 
                                        mt-2 menu-items `} >


                        <div className=' flex origin-left gap-x-4'>
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
                                <Link to="/admin/add_teacher" >
                                    <li data-testid="add-teacher-link" className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Add Teacher
                                    </li>
                                </Link>
                                <Link to="/admin/edit_teacher" data-testid="edit-teacher-link">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Edit Teacher
                                    </li>
                                </Link>
                                <Link to="/admin/add_student" data-testid="add-student-link">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Add Student
                                    </li>
                                </Link>
                                <Link to="/admin/edit_student" data-testid="edit-student-link">
                                    <li className='rounded-md p-2 text-center cursor-pointer hover:bg-slate-900 hover:text-white'>
                                        Edit Student
                                    </li>
                                </Link>

                            </ul>
                        </div>


                    </li>

                    <Link to='/admin/login_email_status' data-testid="check-email-link">
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                    mt-2 menu-items `} >
                            <img src={check_email} className={`${open ? 'w-8 h-8' : ''} ${route === 'login_email_status' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Check Email Login Status
                            </span>
                        </li>
                    </Link>
                    <Link to='student_img_status' data-testid="student-img-link">
                        <li
                            className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                            mt-2 menu-items `} >
                            <img src={require('../.icons/student upload image icon.png')} className={`rounded-lg ${open ? 'w-8 h-8' : ''} ${route === 'student_img_status' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Check Student img status
                            </span>
                        </li>
                    </Link>
                    {/*
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


        </div>
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
    const [show_tutorial, set_showtutorial] = useState(false)
    const [open, setOpen] = useState(false);
    const [datamenuopen, setdatamenuOpen] = useState(false);


    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])

    const syncing_student = async () => {


        // Check attendance sheet name presence and sync
        const student_store_key = sessionStorage.getItem('student_data_key');
        const teacher_store_key = sessionStorage.getItem('teacher_data_key');
        const last_sync_time_key = sessionStorage.getItem('LAST_SYNC_TIME')


        if (!student_store_key || !teacher_store_key || !last_sync_time_key) {
            set_sync_message(['Error']);
            return;
        } else {
            const sync_student_data = async (all_store_ids: string[], Last_sync_time: string) => {
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
                    console.log('Request data', all_store_ids, Last_sync_time)
                    const response: Response = await fetch(`${get_api().admin_api}?page=admin&action=sync_student_data`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'text/plain',
                        },
                        body: JSON.stringify({
                            token, all_store_ids, Last_sync_time
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }

                    const data = await response.json();



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
            const sync_teacher_data = async (all_store_ids: string[], Last_sync_time: string) => {
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
                            token, all_store_ids, Last_sync_time
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Network response was not ok')
                    }

                    const data = await response.json();



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
                        //save last time sync
                        localStorage.setItem(last_sync_time_key, new Date().toISOString())

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

            const LAST_SYNC_TIME = localStorage.getItem(last_sync_time_key) ?? new Date('2000-04-06T08:30:00.000Z').toISOString()
            const dataJson = localStorage.getItem(student_store_key);
            let S_all_store_ids: string[] = []
            if (dataJson) {
                const Student_data = JSON.parse(dataJson);
                S_all_store_ids = Object.keys(Student_data)
            }
            //console.log('saved ids student', S_all_store_ids)
            set_sync_message((p) => ['Syncing Student Data'])
            await sync_student_data(S_all_store_ids, LAST_SYNC_TIME)

            // Check attendance sheet name presence and sync
            const TdataJson = localStorage.getItem(teacher_store_key);
            let T_all_store_ids: string[] = []
            if (TdataJson) {
                const Teacher_data = JSON.parse(TdataJson);
                T_all_store_ids = Object.keys(Teacher_data)
            }
            //console.log(' teacher saved IDs', T_all_store_ids)
            set_sync_message((p) => [...p, 'Syncing Teacher Data'])
            await sync_teacher_data(T_all_store_ids, LAST_SYNC_TIME)

        }

    };




    useEffect(() => {

        console.log('syncing...')

        // if (!is_sync) syncing_student();


    }, [])

    return (
        <div className='relative overflow-hidden'>
            <JoyrideTut show_tutorial={show_tutorial} set_show_tutorial={set_showtutorial} setOpen={setOpen} setdatamenuOpen={setdatamenuOpen} />
            <div className='flex flex-row bg-gradient-to-tr from-slate-500 to-slate-700 h-fit min-h-screen w-screen'>

                <div className=''>
                    <NavBar open={open} setOpen={setOpen} datamenuopen={datamenuopen} setdatamenuOpen={setdatamenuOpen} />
                </div>
                {
                    is_sync ?

                        <div className='ml-16 w-full  flex flex-col text-center items-center justify-center gap-y-10'>

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
                                <Route index path="/" element={<Admin_overview set_show_tutorial={set_showtutorial} />} />
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

        </div>
    )
};

const JoyrideTut = ({ show_tutorial, set_show_tutorial, setOpen, setdatamenuOpen }: { show_tutorial: boolean, set_show_tutorial: React.Dispatch<React.SetStateAction<boolean>>, setOpen: React.Dispatch<React.SetStateAction<boolean>>, setdatamenuOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const [stepIndex, setStepIndex] = useState(0);
    const navigate = useNavigate()

    const handleJoyrideCallback = (data: CallBackProps) => {
        const { action, index, origin, status, type } = data;

        if (action === ACTIONS.CLOSE) {
            // do something
            navigate('./')
        }

        if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
            // Update state to advance the tour
            setStepIndex(index + (action === ACTIONS.PREV ? -1 : 1));
        } else if (status === STATUS.SKIPPED || status === STATUS.FINISHED || status === STATUS.ERROR) {
            // You need to set our running state to false, so we can restart if we click start again.
            set_show_tutorial(false);
            setStepIndex(0)
            navigate('./')
            setOpen(false)
        }

        if (index === 1) {
            setOpen(true)
            setdatamenuOpen(true)
        }
        else if (index === 2) {
            setOpen(true)
            //navigate to add teacher 
            navigate('./add_teacher')
        }
        else if (index == 3) {
            //add teacher sceren
            setOpen(false)

        }
        else if (index === 7) {
            setOpen(true);
            setdatamenuOpen(true);
            navigate('./edit_teacher')
            //going to navbar to highlight edit teacher 
        }
        else if (index === 8) {
            setOpen(true);
            setdatamenuOpen(true);
            navigate('./add_student')
            //going to navbar to highlight add student 
        }
        else if (index === 9) {
            setOpen(true);
            setdatamenuOpen(true);
            navigate('./edit_student')
            //going to navbar to highlight edit student 
        }
        else if (index === 10) {
            setOpen(true);
            setdatamenuOpen(false);
            //going to navbar to highlight edit student 
        }
        else if (index === 11) {
            setOpen(true);
            //going to navbar to highlight edit student 
        }





        console.log(data); //eslint-disable-line no-console

    };

    const steps = [
        {
            placement: 'center' as 'center',
            disableBeacon: true,
            target: '[data-testid="Hellotut"]',
            content: "Welcome to AI-Attend! Let's get started.",
        },
        {
            target: '[data-testid="data-management-link"]',
            content: 'Manage your database here.',
        },
        {//2 navigate to add_teacher
            target: '[data-testid="add-teacher-link"]',
            content: 'Add a new teacher.',
        },
        {//3 input field teacher screen 
            target: '[data-testid="add-teacher-input-field"]',
            content: 'Enter the teacher name and email.',
        },
        {//4 select colum pasteclipboard 
            target: '[data-testid="add-teacher-select_paste_Clipboard"]',
            content: 'Copy a column from Excel and paste it here.',
        },
        {//5 paste clipboard 
            target: '[data-testid="add-teacher-paste_clipboard"]',
            content: 'Paste the copied column here.',
        },
        {//6 save button
            target: '[data-testid="add-teacher-save-button"]',
            content: 'Click Save after filling the form. An email will be sent to the teacher.',
        },
        {//7    navbar edit teacher
            target: '[data-testid="edit-teacher-link"]',
            content: 'Edit or delete teacher data here.',
        },
        {//8    navbar add student
            target: '[data-testid="add-student-link"]',
            content: 'Add new student data. Login email will be sent after adding.',
        },
        {//9    navbar edit student
            target: '[data-testid="edit-student-link"]',
            content: 'Edit student data.',
        },
        {//10  check login status
            target: '[data-testid="check-email-link"]',
            content: 'Check if teachers or students have logged in for the first time.',
        },
        {//11 check student image status
            target: '[data-testid="student-img-link"]',
            content: 'Check if students have uploaded their face images.',
        },
    ];




    return (<>
        <Joyride stepIndex={stepIndex} callback={handleJoyrideCallback} run={show_tutorial} steps={steps} locale={{ next: 'Next', back: 'Back' }} showSkipButton={true} continuous={true} />
    </>)
}


const customStyles = {
    borderRadius: '10px', padding: '30px', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', backgroundColor: '#fff', color: '#333', fontSize: '20px', lineHeight: '1.5', textAlign: 'center',
    beacon: { top: '20px', right: '20px', backgroundColor: '#222', color: '#fff', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.5)', },
    beaconInner: { width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '50%', },
    beaconOuter: { width: '20px', height: '20px', Position: 'relative', },
    buttonBack: { backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', marginRight: '10px', cursor: 'pointer', },
    buttonClose: { backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', },
    buttonNext: { backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', marginLeft: '10px', cursor: 'pointer', },
    buttonSkip: { backgroundColor: '#333', color: '#fff', border: 'none', borderRadius: '5px', padding: '10px 20px', cursor: 'pointer', },
    options: { zIndex: 9999, },
    overlay: { backgroundColor: 'rgba(55, 55, 55, 0.5)', Position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', },
    overlayLegacy: { backgroundColor: 'rgba(55, 55, 55, 0.5)', Position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', },
    overlayLegacyCenter: { backgroundColor: 'rgba(55, 55, 55, 0.5)', Position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', },
    spotlight: { borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.3)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', },
    spotlightLegacy: { borderRadius: '10px', backgroundColor: 'rgba(255, 255, 255, 0.8)', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)', },
    tooltip: { backgroundColor: '#333', color: '#fff', borderRadius: '5px', padding: '10px 20px', boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.2)', },
    tooltipContainer: { Position: 'fixed', zIndex: 9999, },
    tooltipContent: { padding: '10px', TextAlign: 'center', },
};

export default customStyles;