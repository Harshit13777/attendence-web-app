import { useEffect, useRef, useState } from "react";



interface store_subjects {
  [key: string]: string;
}

const Get_Attendence_Sheet = () => {


  const [subject_names, set_subject_names] = useState<string[] | null>(null)
  const [selectedSheet, setSelectedSheet] = useState<{ subject: string, sheet_name: string } | null>(null);
  const subject_names_key = sessionStorage.getItem('subject_names_key') as string;
  const subject_sheet_obj = useRef<store_subjects | null>(null)
  const Admin_sheet = '1'

  const handleSelectChange = (e: any) => {
    if (e.target.value === '') {
      setSelectedSheet(null);
      return;
    }
    if (subject_sheet_obj.current) {
      const sheet_name = subject_sheet_obj.current[e.target.value];
      setSelectedSheet({ subject: e.target.value, sheet_name });
    }
  };

  useEffect(() => {
    const subject_sheet_json = localStorage.getItem(subject_names_key)
    if (subject_sheet_json) {
      const sub_sht_obj: store_subjects = JSON.parse(subject_sheet_json)
      subject_sheet_obj.current = sub_sht_obj;
      set_subject_names(Object.keys(sub_sht_obj))
    }

  }, [])




  return (


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
            {(subject_names).map((sheetName, index) => (
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
          <iframe className="overflow-auto h-screen pt-20" src={`https://docs.google.com/spreadsheets/d/${Admin_sheet}/#gid=${selectedSheet.sheet_name}`} width="100%" >Loading...</iframe>
        }
      </div>



  )
}
export default Get_Attendence_Sheet;