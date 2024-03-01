import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import navbar_open from "../../.icons/navbar.png";

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
  const scope = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";
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
      const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=create_admin_sheet`, {
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

      const response: any = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=add_admin_sheet_id_manual`, {
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
      <div className=' relative w-11/12' >

        <button className={`  m-2 border-solid border-yellow-700  ${show_instruction ? 'absolute p-1 pl-4 pr-4 border-4  left-3/4  translate-x-full text-red-400 bg-yellow-200  rounded-full duration-500 ' : ' p-2  font-bold rounded-lg text-slate-600 bg-yellow-200 text-xl'} `} onClick={handleOnClick}>{show_instruction ? '' : 'show instruction'}</button>
        <div className={`${!show_instruction && 'hidden'} bg-yellow-100 rounded-md`}>
          <div className=' p-2 border-solid   rounded-md'>
            instruction...
          </div>
        </div>

      </div>

      <div className='flex flex-col gap-y-4 bg-green-100 rounded-lg w-9/12 p-5 text-center items-center'>
        <div className='flex flex-row gap-x-6 '>
          <label htmlFor="SheetId" className=' text-lg font-bold '>Sheet Id:</label>
          <input
            className=' rounded-lg font-semibold focus:bg-green-200  focus:text-slate-700 border-solid border-2 focus:w-7/12 w-2/4 p-1 border-green-700 focus:border-black'
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
