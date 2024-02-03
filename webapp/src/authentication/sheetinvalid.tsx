import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Admin_sheet_access_valid } from "../admin/sheet/check_sheet_access_valid";
import { HandlecheckSheetStatusTeacher } from "../teacher/check sheet access";
import { Admin_sheet_query } from "../admin/sheet/handle_sheet_query";


export const Sheet_invalid=()=>{
  const user=sessionStorage.getItem('user');
  return(
    user==='admin'?
      <Admin_sheet_query/>
      :
      <HandlecheckSheetStatusTeacher/>
  )
}