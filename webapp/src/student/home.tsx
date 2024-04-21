import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Link } from 'react-router-dom';
import logout from "../.icons/logout.png";
import navbar_open from "../.icons/navbar.png";
import overview from "../.icons/overview.png";
import { Upload_Img } from "./Upload_Img";
import { get_api } from '../static_api';
import { Attendance_show } from './attendance';




export const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const [wdth, setWdth] = useState(window.innerWidth);//width of scroll bar 16
    const [is_sync, set_issync] = useState(false)
    const [sync_message, set_sync_message] = useState<string[]>([])
    const [uploaded_img, set_uploaded_img] = useState(false)

    useEffect(() => {
        setWdth(window.innerWidth)
        console.log('hello')
    }, [window.innerWidth])


    const sync_student_img_status = async () => {
        try {
            set_issync(true)
            set_sync_message([])
            const token = sessionStorage.getItem('token');
            if (!token) {
                sessionStorage.clear();
                setTimeout(() =>
                    navigate('/login')
                    , 5000);
                throw new Error('Error : No Token Found')
            }

            const response: Response = await fetch(`${get_api().student_api}?page=student&action=sync_student_img_status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    token
                }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();


            if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
                setTimeout(() => {
                    navigate('/sheet invalid')
                }, 2000);
                throw new Error("Sheet Invalid: Contact to Admin");
            }


            if (data.hasOwnProperty('is_img_uploaded')) {
                const is_img_uploaded = data.is_img_uploaded;
                if (is_img_uploaded === true) {
                    set_uploaded_img(true);
                }
                else if (is_img_uploaded === false) {
                    set_uploaded_img(false)
                }
                set_issync(false)
                return;
            }
            //else 
            set_sync_message(['Server Error'])



        } catch (error: any) {

            set_sync_message((p) => [...p, error.message])
            //setMessage('Error. Please try again later.');
            console.error(error);
        }
    };



    useEffect(() => {

        console.log('syncing...')

        if (!is_sync) sync_student_img_status();


    }, [])

    const Logout = () => {
        sessionStorage.clear();
        localStorage.removeItem('User_data')
        setTimeout(() => {
            navigate('/login')
        }, 300);
    }

    return (
        <>

            <div className='flex flex-col bg-gradient-to-tr from-slate-500 to-slate-700 h-fit min-h-screen w-screen'>
                <div className="relative">
                    <button className='bg-red-500 right-0 absolute text-2xl border-2 text-white px-4 py-2 from-red-600 to-red-900 bg-gradient-to-r hover:from-red-800 hover:to-red-400 rounded-3xl ' onClick={() => { Logout() }}>Logout</button>
                </div>
                <div>


                    {
                        is_sync ?

                            <div className='mt-10 w-full  flex flex-col text-center items-center justify-center gap-y-10'>

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

                            uploaded_img
                                ?

                                <Attendance_show />
                                :
                                <Upload_Img set_uploaded_img_status={set_uploaded_img} />

                    }
                </div>
            </div>

        </>
    )
};


export default HomePage;