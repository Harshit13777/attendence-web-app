import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Admin_sheet_access_valid } from "../admin/sheet/check_sheet_access_valid";
import { HandlecheckSheetStatusTeacher } from "../teacher/check sheet access";


export const Sheet_invalid=()=>{
  const user=sessionStorage.getItem('user');
  return(
    user==='Admin'?
      <Admin_sheet_access_valid/>
      :
      <HandlecheckSheetStatusTeacher/>
  )
}