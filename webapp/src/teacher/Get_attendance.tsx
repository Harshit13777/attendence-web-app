import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { get_api } from "../static_api";



interface store_subjects {
  [key: string]: string;
}

const Get_Attendence_Sheet = () => {


  const subject_names_key = sessionStorage.getItem('subject_names_key') as string;
  const [subject_names, set_subject_names] = useState<string[] | null>(null)
  const [selectedSheet, setSelectedSheet] = useState<string>("");
  const [subject_sheetData_obj, set_subject_sheetData_obj] = useState<{ [key: string]: (string[] | number[])[] }>({})
  const [loading, setloading] = useState(false)
  const [message, set_message] = useState('')
  const navigate = useNavigate()

  const handleSelectChange = async (e: any) => {
    const subject = e.target.value;
    if (subject === '') {
      setSelectedSheet('');
      return;
    }


    //sheet Data not exist, call api
    if (!subject_sheetData_obj.hasOwnProperty(subject))
      getSheetData(subject)
    else {
      setSelectedSheet(subject)
    }

  };

  const getSheetData = async (subject: string) => {
    set_message('')
    try {
      console.log('Hello')
      setloading(true);
      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }

      const response = await fetch(`${get_api().teacher_api}?page=teacher&action=get_subject_sheet_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ subject, token }),
      });

      if (!response.ok) {
        throw new Error('Network Error');
      }

      const data = await response.json();

      if (data.hasOwnProperty('message')) {
        set_message(data.message)
      }

      if (data.hasOwnProperty('sheet_data')) {
        const sheet_data = data.sheet_data;
        subject_sheetData_obj[subject] = sheet_data;
        setSelectedSheet(subject)
      } else {
        throw new Error('Error: Data not received')
      }

      setloading(false)

    } catch (error: any) {
      setloading(false)
      set_message(error.message)
      console.log(error.message)
    }
  }


  useEffect(() => {
    const subject_sheet_json = localStorage.getItem(subject_names_key)
    if (subject_sheet_json) {
      const sub_sht_obj: store_subjects = JSON.parse(subject_sheet_json)
      const names = Object.keys(sub_sht_obj)
      set_subject_names(names)

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


      <div className=" text-center">

        <div className={`relative ${loading && 'opacity-50 pointer-events-none'} `}>

          <div className="">

            <select
              className=" mt-2 p-2 rounded-md border-4 border-blue-950 font-semibold text-center"
              onChange={handleSelectChange}
              value={selectedSheet}
            >
              <option value={''}>Select a Subject</option>
              {(subject_names).map((sheetName, index) => (
                <option className="font-semibold text-center border-r-8" key={index} value={sheetName}>
                  {sheetName}
                </option>
              ))}
            </select>

          </div>

          {
            subject_sheetData_obj.hasOwnProperty(selectedSheet) &&

            <div className=" mt-20 m-5  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >
              <h1 className="mt-5  flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
                <span className="p-5 bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 to-red-500 bg-lime-50 rounded-lg">
                  {selectedSheet}
                </span>
              </h1>
              <div className="overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2">
                <table className="w-full table-auto rounded-2xl">

                  <tbody>
                    {
                      subject_sheetData_obj[selectedSheet].map((row, rowIndex) => (
                        <tr key={rowIndex} className=' border-b-2'>
                          {
                            row.map((data, index) => (
                              index !== 0 &&
                              <td className={`px-4 py-2 ${index === 1 && 'font-bold'}`} >
                                {data.toString().length !== 0 ? data : 0}
                              </td>
                            ))
                          }

                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

            </div>
          }

          {/* You can render additional content related to the selected sheet here */}
        </div>

        {loading &&
          <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
        }
        {message !== '' && (
          <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>



  )
}
export default Get_Attendence_Sheet;