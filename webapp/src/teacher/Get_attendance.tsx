import { useEffect, useRef, useState } from "react";

const Get_Attendence_Sheet=()=>{


    const [subject_names,set_subject_names]=useState<{[subject: string]: string;}|null>(null)
    const [selectedSheet, setSelectedSheet] = useState<{subject:string,id:string}|null>(null);
    const Admin_sheet=sessionStorage.getItem('Admin_Sheet_Id');

    const handleSelectChange = (e:any) => {
        if(e.target.value===''){
            setSelectedSheet(null);
            return;
        }
        if(subject_names ){
            const id=subject_names[e.target.value];
            setSelectedSheet({subject:e.target.value,id:id});
        }
      };

    useEffect(()=>{
        const sheet_name_json=localStorage.getItem('Subject_Names')
        if(sheet_name_json){
            const sheet_arr=JSON.parse(sheet_name_json);
            set_subject_names(sheet_arr)
          }
          
      },[])


    
    
    return(
    

        !subject_names 
        ? 
        <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2 ">
            <h1 className="text-4xl font-bold text-gray-900">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
                No Subject Added
              </span>
            </h1>
        </div>
        :

    
        <div className=" text-center relative">

            <div className="absolute left-20 right-20">
                

                
                <select
                  className=" mt-2 p-2 rounded-md border-4 border-blue-950 font-semibold text-center"
                  onChange={handleSelectChange}
                  value={selectedSheet?.subject}
                  >
                 <option value={''}>Select a Subject</option>
                  {Object.entries(subject_names).map(([sheetName,id], index) => (
                      <option className="font-semibold text-center border-r-8" key={index} value={sheetName}>
                      {sheetName}
                    </option>
                  ))}
                </select>            
            </div>
                  {/* You can render additional content related to the selected sheet here */}
         
                {
                    selectedSheet
                    &&
                    <iframe className="overflow-auto h-screen pt-20" src={`https://docs.google.com/spreadsheets/d/${Admin_sheet}/#gid=${selectedSheet.id}`} width="100%" >Loading...</iframe>
                }
        </div>
       

 
    )
}
export default Get_Attendence_Sheet;