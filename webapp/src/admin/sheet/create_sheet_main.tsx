import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import navbar_open from "../../.icons/navbar.png";
import { get_api } from '../../static_api';
import { motion } from 'framer-motion';

export const Create_sheet_Main = () => {
  const [autoset, setauto] = useState(false);
  const [userset, setuser] = useState(false);
  const [showopenChooseoption, set_openChoose] = useState(true)
  const handleauto = () => {
    setuser(false);
    setauto(true);
    set_openChoose(false)
  }
  const handleUser = () => {
    setauto(false)
    set_openChoose(false);
    setuser(true);

  }

  const handle_openchooseoption = () => {
    set_openChoose(true);
    setauto(false);
    setuser(false);
  }

  return (

    <>
      <div className='relative'>
        {/* translate not happening if comp will not there  */}
        <div className={` ${!showopenChooseoption && ' -translate-y-full duration-1000'}`}>
          <div className={` flex-col flex gap-y-4 text-center items-center`}>
            <h3 className={` md:w-2/4 m-10 border-solid border-8 text-5xl rounded-lg bg-slate-800 text-slate-200 ml-6 mr-6 p-4 font-extrabold `}>Choose interface</h3>
            <div className='flex-col gap-y-2 flex  border-slate-800 m-2 '>
              <button className={`bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ${!showopenChooseoption && '   -translate-y-3/4 duration-700'}`} onClick={handleauto}>Auto Create SpreadSheet</button>
              <button className={`bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ${!showopenChooseoption && ' -translate-y-full duration-700'}`} onClick={handleUser}>Manual Create SpreadSheet</button>
            </div>
          </div>
        </div>

        <div className={`${showopenChooseoption ? '-translate-x-16 duration-300 ' : ''}  absolute top-0 `}>
          <img className=' rotate-180 rounded-full bg-slate-200 w-14 h-14  hover:bg-red-200' onClick={handle_openchooseoption} src={navbar_open} alt="" />
        </div>


        <div className=' absolute top-10 md:w-full'>
          {
            autoset &&
            <AutoSheetCreator />
          }
          {
            userset &&
            <UserCreatedSheet />
          }
        </div>

      </div>
    </>

  )
}


const AutoSheetCreator = () => {
  const scope = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/userinfo.profile";
  const [accessToken, setaccessToken] = useState('');
  const [message, setmessage] = useState('');
  const navigat = useNavigate();
  const [loading, set_loading] = useState(false);

  const createSheet = async (accessToken: string) => {
    try {

      setmessage('');
      const token = sessionStorage.getItem('token')
      if (!token || !accessToken) {
        throw new Error('Error:token not found')
      }
      console.log(accessToken, token)
      const response = await fetch(`${get_api().admin_api}?page=admin&action=create_admin_sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          'google_accessToken': accessToken,
          token
        })
      }
      );

      console.log('data sent');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();
      console.log(data);

      if (data.hasOwnProperty('sheet_created')) {

        sessionStorage.setItem('sheet_exist', 'Y');
        setmessage('Sheet Created Successfully')

        setTimeout(() => {
          navigat('/admin/');
        }, 30);
        return;
      }
      else {
        setmessage(data.message)
      }
      set_loading(false);

    } catch (error: any) {
      set_loading(false)
      setmessage(error.message);
      console.log(error.message);
    }
  };

  const GoogleLogin = useGoogleLogin({

    onSuccess: tokenResponse => {

      console.log('token received')
      createSheet(tokenResponse.access_token);
    }
    ,
    onNonOAuthError: (e) => { console.log(e); setmessage('Error'); set_loading(false) },
    scope,
    onError: (e) => { console.log(e); setmessage('Error'); set_loading(false) }
  }
  )


  return (

    <div className='  flex flex-col items-center text-center gap-y-4 '>
      <h3 className={` m-10 border-solid border-8 text-2xl md:text-5xl rounded-lg bg-slate-800 text-slate-200 p-4 font-extrabold text-center`} >Auto SpreadSheet Creater</h3>
      <div className=''>

        You can make spreadsheet by simply one click.
      </div>

      {
        loading
          ?
          <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
          :

          <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={() => { set_loading(true); GoogleLogin() }}>Create sheet</button>
      }

      {message !== '' &&
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      }
    </div>

  )
}



const UserCreatedSheet = () => {
  const [SheetId, setSheetId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, set_loading] = useState(false);
  const [show_instruction, set_show] = useState(false);
  const handleOnClick = () => set_show((prevState) => !prevState);

  let navigat = useNavigate();

  const handleSubmit = async (sheetid: string) => {
    try {
      setMessage('');
      if (SheetId === '')
        throw new Error('Enter Sheet Id');

      const token = sessionStorage.getItem('token');
      if (!token)
        throw new Error('Error')

      set_show(false);

      const response: any = await fetch(`${get_api().admin_api}?page=admin&action=add_admin_sheet_id_manual`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          admin_sheet_id: SheetId,
          token
        }),
      });

      console.log('data sent');
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      const data = await response.json();



      if (data.hasOwnProperty('sheet_added')) {

        sessionStorage.setItem('sheet_exist', 'Y');
        setMessage('Sheet Added Succesfully')
        setTimeout(() => {
          navigat('/admin/');
        }, 30);

      }
      else {
        setMessage(data.message)
      }

      set_loading(false);
    }
    catch (error: any) {
      set_loading(false)
      setMessage(error.message);
      console.log(error.message);
    }
  };

  return (<>
    <div className='  flex flex-col items-center text-center gap-y-4 '>
      <h3 className={` m-10  border-solid border-8 text-2xl md:text-5xl rounded-lg bg-slate-800 text-slate-200 p-4 font-extrabold text-center`} >Manual SpreadSheet Creater</h3>
      <div className=' relative m-2' >

        <button title={`${show_instruction ? 'Close' : 'show Instruction'}`} className={`  m-2 border-solid border-yellow-700 duration-700  ${show_instruction ? ' z-50 fixed p-1 pl-4 pr-4 border-4  left-3/4  translate-x-full text-red-400 bg-yellow-200  rounded-full duration-500' : ' p-2  font-bold rounded-lg text-slate-600 bg-yellow-200 text-xl'} `} onClick={handleOnClick}>{show_instruction ? '' : 'show instruction'}</button>
        <div className={`${!show_instruction && 'hidden'} bg-yellow-100 rounded-md`}>
          <div className=' p-1 border-solid   rounded-md'>
            <HowWorks hidestep={set_show} />
          </div>
        </div>

      </div>

      <div className='flex flex-col gap-y-4 bg-green-100 rounded-lg w-9/12 p-5 text-center items-center'>
        <div className='flex md:flex-row flex-col gap-x-6 p-5'>
          <label htmlFor="SheetId" className=' text-lg font-bold '>Sheet Id:</label>
          <input
            className=' rounded-lg   font-semibold  focus:text-slate-700 border-solid border-2 hover:text-xl md:w-96 p-1 border-green-700 focus:border-black'
            type="text"
            id="SheetId"
            value={SheetId}
            onChange={(e) => setSheetId(e.target.value)}
          />
        </div>
        {
          loading
            ?
            <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
            :
            <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={() => { set_loading(true); handleSubmit(SheetId); }}>Save</button>
        }
      </div>


      {message !== '' &&
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      }
    </div>
  </>)
}

export default Create_sheet_Main;


const HowWorks = ({ hidestep }: { hidestep: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const [open_step, set_openStep] = useState(false);//this false then all step are shown,this is because tracing bean calculate all height

  const stepsData = [
    {
      image: '',
      header: 'Go to this Link',
      description:
        'https://docs.google.com/spreadsheets/',
    },
    {
      image: require('../../screenshots/create sheet 0.png'),
      header: 'Create a new Spreadsheet',
      description:
        '',
    },
    {
      image: require('../../screenshots/create sheet 1.png'),
      header: 'Click on Share button',
      description:
        ''
    },
    {
      image: require('../../screenshots/create sheet 2.png'),
      header: 'Enter the Name',
      description:
        'AI-Attend-admin-sheet'
    },
    {
      image: require('../../screenshots/create sheet 3.png'),
      header: 'Add the below Server Email id',
      description:
        'omnamahshivay7777777@gmail.com'
    },
    {
      image: require('../../screenshots/create sheet 4.png'),
      header: 'Click on send',
      description: ''
    }, {
      image: require('../../screenshots/create sheet 5.png'),
      header: 'CLick on share anyway',
      description: ''
    },
    {
      image: require('../../screenshots/create sheet 6.png'),
      header: 'Copy this id',
      description: ''
    },
    {
      image: require('../../screenshots/create sheet 7.png'),
      header: 'Copy and Paste the Id',
      description: 'Click on Save'
    },

  ];



  return (

    <div className="bg-gray-900 shadow-md min-h-screen rounded-lg p-2  m-2 md:m-5">
      <div className=" relative md:p-10 pt-10 text-center">
        <div>
          <div className="flex items-center justify-center flex-col mt-5 md:mt-10 ">

            <div className={`${open_step ? ' translate-y-full' : ''} duration-1000`}>

              <h1 className="text-xl font-bold text-gray-400 mb-2">
                Steps To create Spreadsheet
              </h1>
              <div className="flex items-center flex-col" onClick={() => { hidestep(false) }}>
                <p className=" font-semibold text-sm text-gray-200">{open_step ? 'Show' : 'Hide'} Steps</p>
                <div className="w-10 h-10">

                  <img src={require('../../.icons/hide_eye.png')} alt="icon"></img>

                </div>
              </div>
            </div>
          </div>
          <div className={`shadow-md md:p-8 p-4 rounded-lg  ${open_step ? 'hidden' : ''}`}>
            <ol className=" list-none list-inside text-gray-200 gap-y-10">
              {
                stepsData.map((obj, i) => (

                  <motion.div
                    initial={{ opacity: 0.5, y: 100 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.3,
                      duration: 0.8,
                      ease: "easeInOut",
                    }} className=' '>
                    <li className={` mb-4 flex-col items-center justify-center shadow-xl border-2 border-blue-200 rounded-xl p-4 md:p-8`}>

                      <h3 className=" text-center font-medium m-2">
                        Step {i + 1}.
                      </h3>



                      <div className="flex-col items-center">
                        <div className=" space-y-5 mb-5">

                          <strong>{obj.header}</strong>
                          <p>
                            {i == 0 ?
                              <a href={obj.description} target="_blank">{obj.description}</a>
                              :
                              obj.description

                            }
                          </p>
                        </div>
                      </div>{obj.image !== '' &&
                        <img
                          src={obj.image}
                          alt={obj.header}
                          className="mb-2 md:mb-4"
                        />
                      }
                    </li>
                  </motion.div>
                ))
              }



            </ol>
          </div>

        </div>


      </div>
    </div>
  );
};