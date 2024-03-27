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
        localStorage.removeItem('User_data')
        setTimeout(() => {
            navigate('/login');
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
                            <img src={navbarIcon} onTouchStart={() => setOpen(true)} alt="" />
                            :
                            <img src={navbarIcon} className=' rotate-180  translate-x-28' onTouchStart={() => setOpen(false)} alt="" />
                    }
                </div>

                <ul className="pt-6 menu">
                    <Link to='/teacher/'>
                        <li className={`flex  rounded-md pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm  items-center  hover:bg-gray-50 gap-x-4 hover:text-slate-900 
                                        mt-2 menu-items `}>
                            <img src={overviewIcon} className='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Overview
                            </span>
                        </li>
                    </Link>
                    <Link to='/teacher/add_subject'>
                        <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm md:text-xl items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src={addDataIcon} alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Add Attendance Sheet
                            </span>
                        </li>
                    </Link>

                    <Link to='/teacher/take_attendance'>
                        <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Take Attendance
                            </span>
                        </li>
                    </Link>

                    <Link to='/teacher/get_attendance_sheet'>
                        <li className={`flex pt-2 pb-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 hover:bg-gray-50 hover:text-slate-900 rounded-md
                                        mt-2 menu-items `} >
                            <img src='' alt="" />
                            <span className={` origin-left duration-200 ${!open && "hidden"}`}>
                                Get Attendance Sheet
                            </span>
                        </li>
                    </Link>



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

interface store_student_imgs {
    [key: string]: number[];
}

interface store_subjects {
    [key: string]: string;
}

const HomePage = () => {
    const [wdth, setWdth] = useState(window.innerWidth);//width of scroll bar 16
    const [is_sync, set_issync] = useState(false)
    const [sync_message, set_sync_message] = useState<string[]>([])
    const navigate = useNavigate();

    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])


    useEffect(() => {


        const syncing_data = async () => {


            // Check attendance sheet name presence and sync
            const student_imgs_key = sessionStorage.getItem('student_imgs_key');
            const subject_names_key = sessionStorage.getItem('subject_names_key');

            if (!student_imgs_key || !subject_names_key) {
                set_sync_message(['Error']);
                console.log("Error syncing: No store key found")
                return;
            } else {

                const sync_student_imgs_data = async (all_studnts_imgs_store_ids: string[]) => {
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

                        const response: Response = await fetch(`${sessionStorage.getItem('teacher_api')}?page=teacher&action=sync_students_imgs`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: JSON.stringify({
                                token, all_studnts_imgs_store_ids
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
                const sync_subjects_data = async (all_subjects_store_ids: string[]) => {
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

                        const response: Response = await fetch(`${sessionStorage.getItem('teacher_api')}?page=teacher&action=sync_subjects_data`, {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'text/plain',
                            },
                            body: JSON.stringify({
                                token, all_subjects_store_ids
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


                const dataJson = localStorage.getItem(student_imgs_key);
                let students_imgs_all_store_ids: string[] = []
                if (dataJson) {
                    const Student_imgs_data = JSON.parse(dataJson);
                    students_imgs_all_store_ids = Object.keys(Student_imgs_data)
                }
                console.log('saved ids student', students_imgs_all_store_ids)
                set_sync_message((p) => ['Syncing Student Data'])
                await sync_student_imgs_data(students_imgs_all_store_ids)

                // Check attendance sheet name presence and sync
                const subjectsdataJson = localStorage.getItem(subject_names_key);
                let subjects_all_store_ids: string[] = []
                if (subjectsdataJson) {
                    const subject_data = JSON.parse(subjectsdataJson);
                    subjects_all_store_ids = Object.keys(subject_data)
                }
                console.log(' teacher saved IDs', subjects_all_store_ids)
                set_sync_message((p) => [...p, 'Syncing Teacher Data'])
                await sync_subjects_data(subjects_all_store_ids)

            }

        };

        syncing_data().then(() =>
            //testing
            set_issync(false)
        )

    }, []);



    return (

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
                    <div className={` ml-16 items-center `} style={{ width: `${((wdth - 64) / wdth) * 100}%` }}>
                        <Routes>
                            <Route path="/add_subject" element={<AddAttendanceSheet />} />
                            <Route path="/get_attendance_sheet" element={<GetAttendanceSheet />} />
                            <Route index path='/take_attendance' element={<TakeAttendance />} />
                        </Routes>
                    </div>
            }
        </div>

    );

}

export default HomePage;
