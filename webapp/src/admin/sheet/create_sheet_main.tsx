import React, { useEffect, useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import { useLocation, useNavigate } from 'react-router-dom';
import AutoSheetCreator from './create_sheet_auto';
import UserCreatedSheet from './create_sheet_manual';


const Create_sheet_Main=()=>{
  const [autoset,setauto]=useState(false);
  const [userset,setuser]=useState(false);
  const handleauto = () => setauto((prevState) => !prevState);
  const handleUser= () => setuser((prevState) => !prevState);

  return(
    <>
      <div><h3>Choose interface</h3>
        <button onClick={handleauto}></button>
        <button onClick={handleUser}></button>
      </div>
      <div className={`${!autoset && 'hidden'}`}>
        <h1>Auto sheet Create</h1>
          <AutoSheetCreator/>
      </div>
      <div className={`${!userset && 'hidden'}`}>
        <h1>Manual sheet Create</h1>
          <UserCreatedSheet/>
      </div>

    </>
  )
}
export default Create_sheet_Main;
