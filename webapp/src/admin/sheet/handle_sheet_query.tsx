import { useEffect, useState } from "react"
import Create_sheet_Main from "./create_sheet_main";
import Admin_sheet_access_valid from "./check_sheet_access_valid";
import { useNavigate } from "react-router-dom";
import { setEmitFlags } from "typescript";
import { get_api } from "../../static_api";


export const Admin_sheet_query = () => {

    const [sheet_status, set_sheet_status] = useState('')
    const [message, set_message] = useState('');
    const navigate = useNavigate();
    const [loading, set_loading] = useState(false);

    //calling api for sheet status
    async function get_sheet_info() {
        try {
            set_message('');
            set_loading(true);
            const token = sessionStorage.getItem('token')
            if (!token) {
                sessionStorage.clear();
                setTimeout(() =>
                    navigate('/login')
                    , 200);
                throw new Error('Error : No Token Found')
            }
            console.log('send')
            const response = await fetch(`${get_api().admin_api}?page=admin&action=get_sheet_status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({ token }),
            });

            if (!response.ok) {
                throw new Error("Network Response Not Ok");

            }

            const data = await response.json(); // convert json to object



            if (data.hasOwnProperty('sheet_status')) {
                set_sheet_status(data.sheet_status)
                set_loading(false);
                set_message(data.sheet_status)
                return;
            }
            else if (data.hasOwnProperty(message)) {
                set_message(data.message)
            }
            else {
                set_message('server error')
            }
            //else show message

            set_loading(false);
        } catch (e: any) {
            set_loading(false);
            set_message(e.message)
            console.error('error on calling get_sheet_info', e.message)
        }
    }
    useEffect(() => {
        //call api to check what problem
        get_sheet_info()
    }, [])

    const gotoAdmin = () => {
        sessionStorage.setItem('sheet_exist', 'yes')
        setTimeout(() => {
            navigate('/admin')
        }, 100);
    }

    const Logout = () => {
        sessionStorage.clear();
        localStorage.removeItem('User_data');
        setTimeout(() => {
            navigate('/login')
        }, 500);
    }

    return (

        <div className="gap-y-11 flex flex-col">
            <div className="relative">
                <button className='bg-red-500 right-0 absolute text-2xl border-2 text-white px-4 py-2 from-red-600 to-red-900 bg-gradient-to-r hover:from-red-800 hover:to-red-400 rounded-3xl ' onClick={() => { Logout() }}>Logout</button>
            </div>

            <div className="">

                {//loading
                    sheet_status === '' ?
                        loading &&
                        <div className="animate-spin rounded-lg ml-auto mr-auto mt-16 mb-16 border-blue-500 border-solid border-8 h-10 w-10"></div>

                        ://create sheet
                        sheet_status === 'Sheet_Not_Exist'
                            ?
                            <Create_sheet_Main />
                            ://get access from sheet
                            sheet_status === 'Exist_without_Access'
                                ?
                                <Admin_sheet_access_valid get_sheet_status={() => get_sheet_info()} />
                                :
                                sheet_status === 'Exist_with_Access'
                                    ?//go to admin
                                    <div className="bg-blue-100 mt-20 text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                                        <button
                                            onClick={() => gotoAdmin()}
                                            className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                                        >
                                            Go to Home
                                        </button>
                                    </div>
                                    ://else error 
                                    <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                                        <p className="text-sm">Server Error</p>
                                    </div>
                }

                {message.length !== 0 && <div className="bg-red-100 w-max  align-middle ml-auto mr-auto rounded-lg text-center border border-blue-500 text-blue-700 px-4 py-3 m-10" role="alert">
                    <p className="text-sm">{message}</p>
                </div>}
            </div>
        </div>


    )

}