import { useEffect, useState } from "react"
import Create_sheet_Main from "./create_sheet_main";
import Admin_sheet_access_valid from "./check_sheet_access_valid";
import { useNavigate } from "react-router-dom";


export const Admin_sheet_query=()=>{

    const [sheet_status,set_sheet_status]=useState('Sheet_Not_Exist')
    const [message,set_message]=useState('');
    const navigate=useNavigate();

    useEffect(()=>{
        //call api to check what problem
        async function get_sheet_info(){
            try{
                const token=sessionStorage.getItem('token')
                const response = await fetch(`api?page=admin&action=get_sheet_status`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ token }),
                  });
                  
                  if (!response.ok) {
                    set_message('Network error');
                    console.log('Network response was not ok');
                    return;
                  }
                  
                  const data = await response.json(); // convert json to object
                  if(data.sheet_status){
                    set_sheet_status(data.sheet_status)
                    set_message('');
                    return;
                  }
                  //else show message
                  set_message(data.message);
            }catch(e){
                console.error('error on calling get_sheet_info',e)
                set_message('Error');
            }
        }
        get_sheet_info()
    },[])

    const gotoAdmin=()=>{
        setTimeout(() => {
            navigate('/admin')
        }, 100);
    }

    return(
        
        
    <div>
        {//loading
        sheet_status===''?
        <div className="animate-spin rounded-lg ml-auto mr-auto mt-16 mb-16 border-blue-500 border-solid border-8 h-10 w-10"></div> 
        ://create sheet
        sheet_status==='Sheet_Not_Exist'
        ?
        <Create_sheet_Main/>
        ://get access from sheet
        sheet_status==='Exist_without_Access'
            ?
            <Admin_sheet_access_valid/>
            :
            sheet_status==='Exist_with_Access'
                ?//go to admin
                <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                <button
                    onClick={gotoAdmin}
                    className="bg-blue-500 text-2xl text-white px-4 py-2 from-blue-600 to-blue-900 bg-gradient-to-r hover:from-blue-800 hover:to-blue-400 rounded-3xl"
                    >
                    Submit
                  </button>
                </div>
                ://else error 
                <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
                    <p className="text-sm">Server Error</p>
                </div>
        }
        
        <div className="bg-blue-100 align-middle text-center border-t border-b border-blue-500 text-blue-700 px-4 py-3 m-10" role="alert">
          <p className="text-sm">{message}</p>
        </div>
    </div>

        
        
    )

}