import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { HomePage } from '../home';

export const Admin_sheet_access_valid: React.FC<{ get_sheet_status: () => Promise<void> }> = ({ get_sheet_status }) => {
  const [show_instruction, set_show] = useState(false);
  const handleOnClick = () => set_show((prevState) => !prevState);
  const [message, setMessage] = useState('');
  const navigat = useNavigate();
  const [loading, set_loading] = useState(false);

  const handleOnCheck = async () => {
    set_loading(true);
    await get_sheet_status();
    set_loading(false)
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

      <button className='bg-blue-500 text-2xl border-2 text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl ' onClick={() => { }}>Delete Sheet</button>

    </div>

  </>)
}
export default Admin_sheet_access_valid;