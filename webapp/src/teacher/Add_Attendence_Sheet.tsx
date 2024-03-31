import { BrowserRouter as Router, Link, Route, Routes, useNavigate } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { loadavg } from 'os';


interface store_subjects {
  [key: string]: string;
}

const Add_Attendence_Sheet = () => {



  const [dataRows, setDataRows] = useState<string[]>(['']);
  const [message, setMessage] = useState<string[]>([]);

  const subject_storage_key = sessionStorage.getItem('subject_names_key') as string;
  const [Datarow_error_message, set_Datarow_error_message] = useState<string[]>([''])


  const navigate = useNavigate();
  const [saved_subject_names, set_saved_subject_names] = useState<string[] | null>(null)

  const MAX_HISTORY_LENGTH = 10; // Set a suitable limit
  const history = useRef([{ subjectRows: dataRows, error_row: Datarow_error_message }]);
  const currentIndex = useRef(0);
  const [historyon, history_on] = useState(false);

  const [rowsToAddCount, setRowsToAddCount] = useState(1); // Default value for row count to add
  const [rowsToDeleteCount, setRowsToDeleteCount] = useState(1); // Default value for row count to delete


  const [loading, setloading] = useState(false);


  useEffect(() => {

    const debouncedUpdateHistory = _debounce(() => {
      const error_mes = JSON.parse(JSON.stringify(Datarow_error_message));
      const newHistory = [...history.current.slice(0, currentIndex.current + 1), { subjectRows: [...dataRows], error_row: error_mes }].slice(-MAX_HISTORY_LENGTH);
      history.current = newHistory;
      //console.log(newHistory)
      currentIndex.current = (newHistory.length - 1);
    }, 300);

    if (!historyon)
      debouncedUpdateHistory();
    else
      history_on(false);

  }, [dataRows])

  useEffect(() => {
    const sheet_name_json = localStorage.getItem(subject_storage_key)
    if (sheet_name_json) {
      const subject_sheet_arr: store_subjects = JSON.parse(sheet_name_json);
      //get all subject names from key value pair 
      set_saved_subject_names(Object.keys(subject_sheet_arr))
    }
  }, [])


  const handleInputChange = (index: number, value: string) => {

    Datarow_error_message[index] = ''

    const updatedDataRows = [...dataRows];

    if (updatedDataRows.find((pre, i) => pre === value)) {//if value found in datarow
      Datarow_error_message[index] = 'Already Filled'
    }

    if (saved_subject_names) {
      if (saved_subject_names.includes(value))
        Datarow_error_message[index] = "Already Saved";
    }


    updatedDataRows[index] = value.toLowerCase();
    setDataRows(updatedDataRows);
  };



  useEffect(() => {
    if (message.length > 0)
      setTimeout(() => {
        setMessage((p) => p.slice(1,))
      }, 7000);
  }, [message])


  const handleAddRows = () => {

    if (rowsToAddCount > 0) {
      if (dataRows.length < 10) {

        //make data row
        const newRows = new Array(rowsToAddCount).fill('').map(() => (''));
        setDataRows((p) => [...p, ...newRows]);
        //make datarow for error message
        const newErrorRow = new Array(rowsToAddCount).fill('').map(() => (''));
        set_Datarow_error_message((p) => [...p, ...newErrorRow])

        setRowsToAddCount(1);
      }
      else {
        setMessage(['Row Length must be less than 10'])
        setRowsToAddCount(1);
      }
    };
  }

  const handleDeleteRow = (index: number) => {
    if (dataRows.length > 1) {
      // Create a new array without the deleted element and set it as the updated state
      const updatedDataRows = dataRows.filter((_, i) => i !== index);
      setDataRows(updatedDataRows);
    } else {
      setDataRows(['']);
      set_Datarow_error_message([''])
    }

  };


  const handleDeleteRows = () => {
    if (rowsToDeleteCount < dataRows.length) {

      setDataRows(dataRows.slice(0, dataRows.length - rowsToDeleteCount));
      set_Datarow_error_message(Datarow_error_message.slice(0, Datarow_error_message.length - rowsToDeleteCount));

    }
    else {

      //reset this
      setDataRows(['']);
      set_Datarow_error_message([''])
    }
  };


  const handleUndo = () => {
    if (currentIndex.current > 0) {
      history_on(true);
      currentIndex.current = (currentIndex.current - 1);
      setDataRows(history.current[currentIndex.current]['subjectRows']);
      set_Datarow_error_message(history.current[currentIndex.current]['error_row']);

    }
  };

  const handleRedo = () => {
    if (currentIndex.current < history.current.length - 1) {
      history_on(true);
      currentIndex.current = (currentIndex.current + 1);
      setDataRows(history.current[currentIndex.current]['subjectRows']);
      set_Datarow_error_message(history.current[currentIndex.current]['error_row']);
    }
  };

  const isValidData = (subjects: string[]) => {

    let isvalid = true;
    let errodata = Datarow_error_message;
    let saved_names: { [key: string]: boolean } = {};
    //add all already saved subject name in saved_namess
    if (saved_subject_names)
      saved_subject_names.map((subject, index) => saved_names[subject] = true);

    for (let i in dataRows) {
      const subject = dataRows[i]
      if (subject === '')
        errodata[i] = 'Fill this'
      if (saved_names[subject])
        errodata[i] = 'Already added'
      else
        saved_names[subject] = true;
    }


    errodata.map((err, i) => {
      if (err !== '') {
        setMessage((p) => [...p, `Fix the error in ${i + 1}th row`])
        isvalid = false
      }
    })

    return isvalid;

  }


  async function submitData(subjects: string[]) {
    setloading(true);

    try {
      if (!isValidData(subjects)) {
        throw new Error('Error');
      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }

      const response = await fetch(`${sessionStorage.getItem('teacher_api')}?page=teacher&action=add_subjects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ Subject_Names: subjects, token }),
      });

      if (!response.ok) {
        throw new Error('Network Error');
      }

      const data = await response.json();


      if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
        sessionStorage.removeItem('sheet_exist')
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 500);
      }

      if (data.hasOwnProperty('message')) {
        setMessage((p) => [...p, ...data.message]);
      }

      if (data.hasOwnProperty('sheet_added')) {

        const sjson = localStorage.getItem(subject_storage_key);

        let upd_subject_data: store_subjects;

        const saved_subject_sheet_name: [string | false] = data.sheet_added;
        const saved_data: store_subjects = {}
        if (saved_subject_sheet_name.length !== subjects.length) {
          throw new Error('Data Incomplete')
        }
        let already_added_subjects: string[] = [];

        saved_subject_sheet_name.map((sheet_name, index) => {
          //make key value pair from id received in response to subjects 
          if (sheet_name !== false) {
            saved_data[subjects[index]] = sheet_name
          }
          else {
            //mean it already saved
            already_added_subjects.push(subjects[index])
          }

        })

        if (sjson) {
          const pre_data: store_subjects = JSON.parse(sjson)
          upd_subject_data = { ...pre_data, ...saved_data }
        }
        else {
          upd_subject_data = saved_data
        }
        //update local storage
        const ujson = JSON.stringify(upd_subject_data)
        localStorage.setItem(subject_storage_key, ujson);

        //rest all variable

        if (already_added_subjects.length !== 0) {
          setDataRows(already_added_subjects);
          const errr_arr = new Array(already_added_subjects.length).fill('').map(() => ('Already added'));
          set_Datarow_error_message(errr_arr)
          setMessage((p) => [...p, 'Error: Already added'])
          history.current = [{ subjectRows: already_added_subjects, error_row: errr_arr }]
        } else {
          setDataRows([''])
          set_Datarow_error_message([''])
          history.current = [{ subjectRows: [''], error_row: [''] }]
        }
        set_saved_subject_names(Object.keys(upd_subject_data))
        setMessage(['Data Added'])
        return
      }

      throw new Error('Error')

    } catch (error: any) {
      setloading(false);
      setMessage((p) => [...p, error.message])
      console.log(error.message)
    }
  }



  return (
    <div className=" text-center p-2 md:p-8">


      <h1 className="flex  mb-4 text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
        <span className="bg-clip-text text-transparent bg-gradient-to-tl from-slate-300 to-gray-300 bg-lime-50 p-3 rounded-lg">
          Add Attendance Sheet
        </span>
      </h1>

      <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>

        <div className="  mb-4  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >

          <div className="flex mt-4  bg-gradient-to-br from-blue-200 to-red-100 p-4 rounded-xl overflow-x-scroll">
            <div className="flex  gap-x-1 md:gap-x-3  w-4/12  justify-center">
              <img src={undo_icon}
                title='Undo'
                onClick={handleUndo}
                className=" bg-slate-300 text-white  rounded-xl hover:opacity-50 "
              />

              <img
                src={redo_icon}
                title='Redo'
                onClick={handleRedo}
                className="bg-slate-300 text-white rounded-xl hover:opacity-50"
              />


            </div>

            <div className="flex  gap-x-1 md:gap-x-3 w-4/12 justify-center">
              <input
                type="number"

                size={4}

                maxLength={2}
                value={rowsToAddCount}
                onChange={(e) => setRowsToAddCount(parseInt(e.target.value))}
                className=" w-8/12 md:w-3/12 text-center text-xl md:text-3xl border-2 border-lime-200 p-1 md:p-2 font-bold  focus:outline-none focus:border-blue-400  rounded-xl  hover:bg-slate-200"
              />
              <img src={add_icon}
                title='Add Rows'
                onClick={handleAddRows}
                className=" bg-slate-300 text-white rounded-lg hover:opacity-50"
              />

            </div>
            <div className="flex  gap-x-1 md:gap-x-3 w-4/12 justify-center">
              <input
                type="number"
                size={4}

                maxLength={50}
                value={rowsToDeleteCount}
                onChange={(e) => setRowsToDeleteCount(parseInt(e.target.value))}
                className=" w-8/12 md:w-3/12  text-center text-xl md:text-3xl border-2 border-lime-200 p-1 md:p-2 font-bold    rounded-xl focus:outline-none focus:border-blue-400 hover:bg-slate-200"
              />
              <img src={minus_icon}
                title='Delete Rows'
                onClick={handleDeleteRows}
                className="bg-slate-300 text-white rounded-lg hover:opacity-50"
              />

            </div>
          </div>

          <h1 className="mt-10 mb-5 flex text-center items-center justify-center text-xl md:text-3xl font-extrabold text-gray-900 ">
            <span className="bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 to-red-500 bg-lime-50 rounded-lg">
              Fill the Form
            </span>
          </h1>

          <div className="overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2">
            <table className="w-full table-auto rounded-2xl">
              <thead className='text-center items-center'>
                <tr className=''>
                  <th className="px-4 py-2 font-bold flex flex-row pl-5 text-xl">Subject Name</th>
                </tr>
              </thead>
              <tbody>
                {dataRows.map((row, rowIndex) => (
                  <tr key={rowIndex} className=''>
                    <td className="px-4 py-2">
                      <input
                        value={row}
                        placeholder="Enter Subject name"
                        aria-placeholder='Subject name'
                        maxLength={30}
                        onChange={(e) => handleInputChange(rowIndex, e.target.value)}
                        className={`w-full md:w-3/5 ${Datarow_error_message[rowIndex] !== '' ? 'border-red-300 border-4' : ' focus:border-4 focus:border-blue-400 border'} rounded-xl font-bold  p-2 focus:outline-none  hover:bg-slate-100 hover:text-black`}
                      />
                      {Datarow_error_message[rowIndex].length !== 0 && <h5 className=''>{Datarow_error_message[rowIndex]}</h5>}

                    </td>
                    <td className="px-4 py-2 flex-row">
                      <button
                        onClick={() => handleDeleteRow(rowIndex)}
                        className="bg-red-500 text-white px-2 py-1 rounded-lg from-red-800 :to-red-200 bg-gradient-to-r hover:bg-white hover:text-red-700 hover:bg-light-white"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <button
          onClick={() => { submitData(dataRows) }}
          className=" bg-gradient-to-t text-xl font-bold hover:bg-gradient-to-b from-red-400 to-blue-400  text-white px-4 py-2 rounded-lg">
          Submit
        </button>

      </div>
      {loading &&
        <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
      }
      {message.map((message, i) => (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}




    </div>
  );
};

export default Add_Attendence_Sheet;