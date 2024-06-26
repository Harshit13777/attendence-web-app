import React, { useState, useEffect } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
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
import { get_api } from '../static_api';
import Joyride, { ACTIONS, CallBackProps, EVENTS, STATUS } from 'react-joyride';
import { Teacher_overview } from '../overview/teacher_overview';

const NavBar = ({ open, setOpen }: { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

    const navigate = useNavigate();
    const location = useLocation()
    const [route, set_route] = useState<string>('')
    const handleOnClick = () => {
        setOpen(prevState => !prevState);
    };

    useEffect(() => {//get current route
        const pathname = location.pathname;
        const routes = pathname.split('/');
        const current_route = routes.pop()
        if (current_route)
            set_route(current_route)
        else set_route('teacher')

    }
    )
    const logout = () => {
        sessionStorage.clear();
        localStorage.removeItem('User_data')
        setTimeout(() => {
            navigate('/');
        }, 200);
    };

    return (
        <>
            <div className={`${open ? 'w-64' : ' w-16'} fixed h-full min-h-screen md:h-screen p-2 pt-8 bg-slate-900  transition-all duration-300 top-0`}
                onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
            >
                <div className={`flex  rounded-md pt-2 pb-2 text-gray-300 text-sm items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `} >

                    {
                        !open ?
                            <img src={navbarIcon} className=' w-12' onTouchStart={() => setOpen(true)} alt="" />
                            :
                            <img src={navbarIcon} className=' rotate-180  translate-x-28 w-12' onTouchStart={() => setOpen(false)} alt="" />
                    }
                </div>

                <ul className="pt-6 menu">
                    <Link to='/teacher/'>
                        <li className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm  items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={require('../.icons/overview.png')} className={`${open ? 'w-8 h-8' : ''} ${route === 'teacher' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                    </Link>
                    <Link to='/teacher/add_subject'>
                        <li data-testid="add-attendance-sheet-link" className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm  items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={require('../.icons/add_sheet.png')} className={`${open && 'w-8 h-8'} ${route === 'add_subject' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Add Attendance Sheet
                            </span>
                        </li>
                    </Link>

                    <Link to='/teacher/take_attendance'>
                        <li data-testid="take-attendance-link" className={`flex pt-2 pb-2 cursor-pointer text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={require('../.icons/add_attendance.png')} className={`${open && 'w-8 h-8'} ${route === 'take_attendance' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Take Attendance
                            </span>
                        </li>
                    </Link>

                    <Link to='/teacher/get_attendance_sheet'>
                        <li data-testid="get-attendance-link" className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={require('../.icons/get_sheet.png')} className={`${open && 'w-8 h-8'} ${route === 'get_attendance_sheet' && 'p-2 bg-gray-700 rounded-lg'}`} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Get Attendance Sheet
                            </span>
                        </li>
                    </Link>

                    <li className={`flex pt-2 pb-2 cursor-pointer  text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-10 menu-items `} >
                        <img src={require('../.icons/logout.png')} className={`${open && 'w-8 h-8'} `} alt="" />
                        <span className={` origin-left duration-200 ${!open && "hidden"}`} onClick={logout}>
                            Log-out
                        </span>
                    </li>
                </ul>
            </div>
        </>
    )
};

interface store_student_imgs {
    [key: string]: { roll_id: string, img_arr: number[] };
}

interface store_subjects {
    [key: string]: string;
}

const HomePage = () => {
    const [wdth, setWdth] = useState(window.innerWidth);//width of scroll bar 16
    const [is_sync, set_issync] = useState(false)
    const [sync_message, set_sync_message] = useState<string[]>([])
    const navigate = useNavigate();
    const innerwidth = window.innerWidth;
    const [open, setOpen] = useState(false);
    const [show_tutorial, set_showtutorial] = useState(false)

    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])


    useEffect(() => {


        const syncing_data = async () => {


            // Check attendance sheet name presence and sync
            const student_imgs_key = sessionStorage.getItem('student_imgs_key');
            const subject_names_key = sessionStorage.getItem('subject_names_key');
            const last_sync_time_key = sessionStorage.getItem('LAST_SYNC_TIME')

            if (!student_imgs_key || !subject_names_key || !last_sync_time_key) {
                set_sync_message(['Error']);
                console.log("Error syncing: No store key found")
                return;
            } else {

                const sync_student_imgs_data = async (all_studnts_imgs_store_ids: string[], Last_sync_time: string) => {
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

                        const response: Response = await fetch(`${get_api().teacher_api}?page=teacher&action=sync_students_imgs`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: JSON.stringify({
                                token, all_studnts_imgs_store_ids, Last_sync_time
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok')
                        }

                        const data = await response.json();

                        console.log("response", data)

                        if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
                            sessionStorage.removeItem('sheet_exist')
                            setTimeout(() => {
                                navigate('/sheet invalid')
                            }, 50);
                        }



                        if (data.hasOwnProperty('Add_data') && data.hasOwnProperty('Delete_data')) {
                            //add data which received in localstorage
                            const json = localStorage.getItem(student_imgs_key)
                            let updated_data: store_student_imgs = {};
                            const receve_add_data: store_student_imgs = data.Add_data;
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
                            localStorage.setItem(student_imgs_key, JSON.stringify(updated_data))
                            console.log('updated_data', updated_data)
                            set_sync_message((p) => [...p, 'Successfully Sync Students Imgs'])
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
                const sync_subjects_data = async (all_subjects_store_ids: string[], Last_sync_time: string) => {
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

                        const response: Response = await fetch(`${get_api().teacher_api}?page=teacher&action=sync_subjects_data`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: JSON.stringify({
                                token, all_subjects_store_ids, Last_sync_time
                            }),
                        });

                        if (!response.ok) {
                            throw new Error('Network response was not ok')
                        }

                        const data = await response.json();

                        console.log("response", data)

                        if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
                            sessionStorage.removeItem('sheet_exist')
                            setTimeout(() => {
                                navigate('/sheet invalid')
                            }, 50);
                        }



                        if (data.hasOwnProperty('Add_data') && data.hasOwnProperty('Delete_data')) {
                            //add data which received in localstorage
                            const json = localStorage.getItem(subject_names_key)
                            let updated_data: store_subjects = {};
                            const receve_add_data: store_subjects = data.Add_data;
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
                            localStorage.setItem(subject_names_key, JSON.stringify(updated_data))
                            set_sync_message((p) => [...p, 'Successfully Sync subjects data'])
                            set_issync(false)
                            //save last time sync
                            localStorage.setItem(last_sync_time_key, new Date().toISOString())
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
                const dataJson = localStorage.getItem(student_imgs_key);
                let students_imgs_all_store_ids: string[] = []
                if (dataJson) {
                    const Student_imgs_data = JSON.parse(dataJson);
                    students_imgs_all_store_ids = Object.keys(Student_imgs_data)
                }
                console.log('saved ids student', students_imgs_all_store_ids)
                set_sync_message((p) => ['Syncing Student Data'])
                await sync_student_imgs_data(students_imgs_all_store_ids, LAST_SYNC_TIME)

                // Check attendance sheet name presence and sync
                const subjectsdataJson = localStorage.getItem(subject_names_key);
                let subjects_all_store_ids: string[] = []
                if (subjectsdataJson) {
                    const subject_data = JSON.parse(subjectsdataJson);
                    subjects_all_store_ids = Object.keys(subject_data)
                }
                console.log(' teacher saved IDs', subjects_all_store_ids)
                set_sync_message((p) => [...p, 'Syncing Teacher Data'])
                await sync_subjects_data(subjects_all_store_ids, LAST_SYNC_TIME)

            }

        };

        syncing_data()

    }, []);



    return (
        <div className='relative overflow-hidden'>



            <JoyrideTut show_tutorial={show_tutorial} set_show_tutorial={set_showtutorial} setOpen={setOpen} />

            <div className='flex flex-row bg-gradient-to-tr from-slate-500 to-slate-700 h-fit min-h-screen w-screen'>
                <div className='z-50'>
                    <NavBar open={open} setOpen={setOpen} />
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
                        <div className={` ml-16 items-center `} style={{ width: '100%', maxWidth: 'calc(100% - 64px)' }}>
                            <Routes>
                                <Route path="/" element={<Teacher_overview set_show_tutorial={set_showtutorial} />} />
                                <Route path="/add_subject" element={<AddAttendanceSheet />} />
                                <Route path="/get_attendance_sheet" element={<GetAttendanceSheet />} />
                                <Route index path='/take_attendance' element={<TakeAttendance />} />
                            </Routes>
                        </div>
                }
            </div>
        </div>
    );

}

export default HomePage;


const JoyrideTut = ({ show_tutorial, set_show_tutorial, setOpen }: { show_tutorial: boolean, set_show_tutorial: React.Dispatch<React.SetStateAction<boolean>>, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {

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
        if (index == 1) {
            setOpen(true);
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
            target: '[data-testid="add-attendance-sheet-link"]',
            content: 'Here, you add subjects , the attendance sheet will created from subject name',
        },
        {//2 navigate to add_teacher
            target: '[data-testid="take-attendance-link"]',
            content: 'Here, you open your camera to take facial attendance and mark attendace.',
        },
        {//3 input field teacher screen 
            target: '[data-testid="get-attendance-link"]',
            content: 'HEre, you can see all attendance data of subjects',
        },
    ];




    return (<>
        <Joyride stepIndex={stepIndex} callback={handleJoyrideCallback} run={show_tutorial} steps={steps} locale={{ next: 'Next', back: 'Back' }} showSkipButton={true} continuous={true} />
    </>)
}