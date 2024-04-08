
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { setFlagsFromString } from 'v8';
import { get_api } from '../static_api';

const ChangePassword: React.FC = () => {

    const [email, setEmail] = useState('');
    const [username, setusername] = useState('');
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [message, setMessage] = useState<string[]>([]);
    const [ForgetCompOn, setForgetCompOn] = useState(true);

    const [token, set_token] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigat = useNavigate();
    const [loading, set_loading] = useState(false);

    const emailInputRef = useRef<HTMLInputElement | null>(null);
    const selectInputRef = useRef<HTMLSelectElement | null>(null);
    const usernameInputRef = useRef<HTMLInputElement | null>(null);
    const newPasswordInputRef = useRef<HTMLInputElement | null>(null);
    const conformPassInputRef = useRef<HTMLInputElement | null>(null);
    const OtpInputRef = useRef<HTMLInputElement | null>(null);

    const location = useLocation()

    useEffect(() => {
        const handleKeyPress = (e: any) => {
            e.target.style.setProperty('border-color', 'black');
            if (e.key === 'Enter') {

                switch (e.target.name) {

                    case 'role':
                        // Check if role is not admin before moving to the username field

                        usernameInputRef.current?.focus();
                        break;
                    case 'username':

                        emailInputRef.current?.focus();
                        break;


                    case 'newPassword':
                        conformPassInputRef.current?.focus();
                        break;
                    case 'confirmPassword':
                        OtpInputRef.current?.focus();
                        break;
                    case 'Otp':
                        handleChangePasswordSubmit();
                        break;
                    default:
                        break;
                }
            }

        };

        // Add event listeners to the input fields
        emailInputRef.current?.addEventListener('keydown', handleKeyPress);
        usernameInputRef.current?.addEventListener('keydown', handleKeyPress);
        selectInputRef.current?.addEventListener('keydown', handleKeyPress);
        newPasswordInputRef.current?.addEventListener('keydown', handleKeyPress);
        conformPassInputRef.current?.addEventListener('keydown', handleKeyPress);
        OtpInputRef.current?.addEventListener('keydown', handleKeyPress);
        // Add more event listeners for other fields

        // Cleanup the event listeners when the component is unmounted
        return () => {
            usernameInputRef.current?.removeEventListener('keydown', handleKeyPress);
            emailInputRef.current?.removeEventListener('keydown', handleKeyPress);
            selectInputRef.current?.removeEventListener('keydown', handleKeyPress);
            newPasswordInputRef.current?.removeEventListener('keydown', handleKeyPress);
            conformPassInputRef.current?.removeEventListener('keydown', handleKeyPress);
            OtpInputRef.current?.removeEventListener('keydown', handleKeyPress);
            // Remove event listeners for other fields
        };
    }, []);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tok = searchParams.get('token');
        const email = searchParams.get('email');
        const username = searchParams.get('username');
        const role = searchParams.get('user')
        if (tok && email && username && role) {
            //set token in state var
            set_token(tok)
            setEmail(email)
            setusername(username)
            setSelectedRole(role)
            console.log(tok, email, username, role)
        }
        else {
            setMessage(['No token Found'])
        }

    }, [])

    const validatesetpasswdform = (email: string, selectedRole: string | null, username: string, newPassword: string, confirmPassword: string, token: string | null) => {

        let isvalid = true;

        if (email === '' || selectedRole === null || username === '' || !token) {
            setMessage((p) => ['Error'])
            return false;
        }

        if (newPassword === '') {
            setMessage((p) => [...p, 'fill new password']);
            newPasswordInputRef.current?.style.setProperty('border-color', 'red');
            isvalid = false;
        }

        if (newPassword.length < 7 || confirmPassword.length < 7) {
            setMessage((p) => [...p, 'password size atleast 7']);
            conformPassInputRef.current?.style.setProperty('border-color', 'red');
            newPasswordInputRef.current?.style.setProperty('border-color', 'red');
            isvalid = false;
        }
        if (confirmPassword === '') {
            setMessage((p) => [...p, 'fill conform password']);
            conformPassInputRef.current?.style.setProperty('border-color', 'red');
            isvalid = false;
        }
        if (newPassword !== confirmPassword) {
            setMessage((p) => [...p, 'password not match']);
            conformPassInputRef.current?.style.setProperty('border-color', 'red');
            newPasswordInputRef.current?.style.setProperty('border-color', 'red');
            isvalid = false;
        }

        return isvalid;

    }

    const handleChangePasswordSubmit = async () => {
        // Check if the new password and confirm password match
        setMessage([]);

        try {


            if (!validatesetpasswdform(email, selectedRole, username, newPassword, confirmPassword, token)) {
                throw new Error();
            }
            set_loading(true);

            const response = await fetch(`${selectedRole === 'admin' ? get_api().admin_api : selectedRole === 'teacher' ? get_api().teacher_api : get_api().student_api}?page=${selectedRole}&action=change_password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    token,
                    newPassword: newPassword,
                    email,
                    username,
                }),
            });

            if (!response.ok) {
                setMessage(['Network Error']);
                throw new Error('Network Error');
            }

            const data = await response.json();

            if (data.hasOwnProperty('message')) {
                setMessage([data.message]);
            }

            if (data.hasOwnProperty('changed')) {
                setTimeout(() => {
                    navigat(`/login`);
                }, 3000);
                setMessage([data.changed])
            }

            set_loading(false);

        }
        catch (e: any) {
            console.log(e.message);
            set_loading(false);
        }

    };

    return (
        <div className=" mx-auto pt-4 pb-4 md:p-8">
            <div className=" p-8 m-auto h-max min-h-[calc(100vh-32px)]  md:min-h-[calc(100vh-64px)] md:w-7/12 lg:w-5/12  bg-gray-800 text-white rounded-md shadow-lg hover:shadow-xl transition duration-300">
                {
                    token !== null
                    &&
                    <div className='mb-8'>
                        <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>

                            <h1 className=" text-3xl text-center  text font-bold m-10 bg-gradient-to-r  from-gray-600 to-gray-800">Change Password</h1>

                            <div className="mb-8">
                                <label htmlFor="newPassword" className={`block ${newPassword.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                                    New password
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    ref={newPasswordInputRef}
                                    name='newPassword'
                                    value={newPassword}
                                    placeholder='Enter New Password'
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full text-black px-3 py-2 border-2 rounded-md"
                                />
                            </div>
                            <div className="mb-8">
                                <label htmlFor="confirmPassword" className={`block ${confirmPassword.length === 0 && 'hidden'}  text-sm p-1 md:text-xl  opacity-75`}>
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    ref={conformPassInputRef}
                                    placeholder='conform New Password'
                                    name='confirmPassword'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full text-black px-3 py-2 border-2 rounded-md"
                                />
                            </div>


                            <div className='text-center flex flex-col items-center pt-5 gap-y-2'>


                                <button
                                    onClick={handleChangePasswordSubmit}
                                    className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                                >
                                    Change Password
                                </button>

                            </div>
                        </div>
                        {loading &&
                            <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
                        }
                    </div>

                }
                {message.map((message, i) => (
                    <div className="bg-blue-100  text-center rounded-md  border-t border-b border-red-500 text-red-700  px-4 py-3" role="alert">
                        <p className="text-sm">{message}</p>
                    </div>
                ))}

            </div>
        </div>
    );

};
export default ChangePassword;
