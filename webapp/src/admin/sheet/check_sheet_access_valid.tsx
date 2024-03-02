import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { HomePage } from '../home';

export const Admin_sheet_access_valid: React.FC<{ get_sheet_status: () => Promise<void> }> = ({ get_sheet_status }) => {
  const [show_instruction, set_show] = useState(false);
  const handleOnClick = () => set_show((prevState) => !prevState);
  const [message, set_message] = useState('');
  const navigat = useNavigate();
  const [loading, set_loading] = useState(false);

  const handleOnCheck = async () => {
    set_loading(true);
    await get_sheet_status();
    set_loading(false)
  }

  async function handledeleteSheet() {

    try {
      set_message('');
      set_loading(true);
      const token = sessionStorage.getItem('token')
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigat('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }
      console.log('send')
      const response = await fetch(`${sessionStorage.getItem('api')}?page=admin&action=delete_admin_sheet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        set_message('Network error');
        console.log('Network response was not ok');
        set_loading(false);
        return;
      }

      const data = await response.json(); // convert json to object



      if (data.hasOwnProperty('deleted_sheet')) {

        set_message(data.deleted_sheet)
        get_sheet_status();
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
      console.error('error on calling api', e.message)
    }
  }


  return (<>
    <div className='  flex flex-col items-center text-center gap-y-4 '>
      <h3 className={` m-10  border-solid border-8 text-2xl md:text-5xl rounded-lg bg-slate-800 text-slate-200 p-4 font-extrabold text-center`} >Check Sheet Status</h3>
      <div className=' relative w-11/12' >

        <button className={`  m-2 border-solid border-yellow-700  ${show_instruction ? 'absolute p-1 pl-4 pr-4 border-4  left-3/4  translate-x-full text-red-400 bg-yellow-200  rounded-full duration-500 ' : ' p-2  font-bold rounded-lg text-slate-600 bg-yellow-200 text-xl'} `}
          onClick={handleOnClick}>{show_instruction ? '' : 'show instruction'}</button>
        <div className={`${!show_instruction && 'hidden'} bg-yellow-100 rounded-md`}>
          <div className=' p-2 border-solid   rounded-md'>
            instruction of sheet access...
          </div>
        </div>

      </div>



      {
        loading
          ?
          <div className="animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
          :
          <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={handleOnCheck}>Check</button>
      }

      <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={() => { handledeleteSheet() }}>Delete Sheet</button>

      {message.length !== 0 && <div className="bg-red-100 w-max  align-middle ml-auto mr-auto rounded-lg text-center border border-blue-500 text-blue-700 px-4 py-3 m-10" role="alert">
        <p className="text-sm">{message}</p>
      </div>}
    </div>

  </>)
}
export default Admin_sheet_access_valid;