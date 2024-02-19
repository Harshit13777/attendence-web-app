import React, { useState, useEffect, useRef } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { last } from 'lodash';
import { paste } from '@testing-library/user-event/dist/paste';
import { useNavigate } from 'react-router-dom';
import Add_data_student from './add_student';


interface DataRow_Teacher {
  Teacher_Name: string;
  Teacher_Email: string;
  [key: string]: string; // Index signature to allow dynamic properties
}

const SpreadsheetInterface = () => {
  const Empty_data_Teacher = { Teacher_Name: '', Teacher_Email: '' };

  const [Teacher_dataRows, set__teacherDatarows] = useState<DataRow_Teacher[]>([{ ...Empty_data_Teacher }])
  const [Datarow_error_message, set_Datarow_error_message] = useState<DataRow_Teacher[]>([{ ...Empty_data_Teacher }])

  const [storage_datarows, set_storage_dataRows] = useState<DataRow_Teacher[] | null>(null);


  const [message, setMessage] = useState(['']);
  const MAX_HISTORY_LENGTH = 10; // Set a suitable limit
  const history = useRef([{ teacherRows: Teacher_dataRows, error_row: Datarow_error_message }]);
  const currentIndex = useRef(0);
  const [historyon, setHistoryon] = useState(false);

  const [selectedColumn, setSelectedColumn] = useState('');//data for copy clipboard 
  const [rowsToAddCount, setRowsToAddCount] = useState(1); // Default value for row count to add
  const [rowsToDeleteCount, setRowsToDeleteCount] = useState(1); // Default value for row count to delete

  const [open_copyPaste, set_open_copyPaste] = useState(false);
  const [loading, set_loading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    const debouncedUpdateHistory = _debounce(() => {
      const error_mes = JSON.parse(JSON.stringify(Datarow_error_message));
      const newHistory = [...history.current.slice(0, currentIndex.current + 1), { teacherRows: [...Teacher_dataRows], error_row: error_mes }].slice(-MAX_HISTORY_LENGTH);
      history.current = newHistory;
      console.log(newHistory)
      currentIndex.current = (newHistory.length - 1);
    }, 300);


    if (!historyon)
      debouncedUpdateHistory();
    else
      setHistoryon(false);

  }, [Teacher_dataRows])

  useEffect(() => {//get data form localstorge
    const sjson = localStorage.getItem('Student_Data');
    if (sjson) {
      const Student_data: DataRow_Teacher[] = JSON.parse(sjson);
      set_storage_dataRows(Student_data);
    }
  }, [])


  const handleInputChange_Teacher = (index: number, field: string, value: string) => {
    //add data change in dataRows 

    Datarow_error_message[index][field] = ''



    if (field === 'Teacher_Email') {
      //if name is empty then make border red
      const Namevalue = Teacher_dataRows[index]['Teacher_Name'] === '';
      if (Namevalue) {
        Datarow_error_message[index]['Teacher_Name'] = 'Fill this'
      }



      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      const isValidEmail = emailPattern.test(value);

      // Update the border color based on email validity
      if (!isValidEmail) {
        Datarow_error_message[index]['Teacher_Email'] = 'Email Not valid'

      }
      if (storage_datarows)//check if email exist already
        CheckEmailExist(value, index);


    }


    const newDataRows = Teacher_dataRows.map((row, rowIndex) =>
      rowIndex === index ? { ...row, [field]: value } : row
    );
    set__teacherDatarows(newDataRows);


  };


  const CheckEmailExist = async (input_email: string, index: number) => {
    const exist = storage_datarows?.find((row) => row.Student_Email === input_email);
    if (exist) {
      Datarow_error_message[index]['Teacher_Email'] = 'Email already Added'
    } else {
      Datarow_error_message[index]['Teacher_Email'] = ''
    }
  }


  useEffect(() => {
    if (message.length > 0)
      setTimeout(() => {
        setMessage((p) => p.slice(1,))
      }, 7000);
  }, [message])

  const handleColumnSelection = (columnName: string) => {//choose coloum for clipboard
    if (selectedColumn === columnName) {
      setSelectedColumn('');
    }
    else
      setSelectedColumn(columnName);
  };

  const handleAddRows = () => {
    if (rowsToAddCount > 0) {
      if (Teacher_dataRows.length < 100) {

        const newRows = new Array(rowsToAddCount).fill('').map(() => ({ ...Empty_data_Teacher }));
        set__teacherDatarows([...Teacher_dataRows, ...newRows]);

        const newErrorRow = new Array(rowsToAddCount).fill('').map(() => ({ ...Empty_data_Teacher }));
        set_Datarow_error_message([...Datarow_error_message, ...newErrorRow])

        setRowsToAddCount(1);
      }
      else {
        setMessage(['Row Length must be less than 50'])
        setRowsToAddCount(1);
        return
      }
    }
  };

  //by delete button
  const handleDeleteRow_Teaher = (index: number) => {
    if (Teacher_dataRows.length > 1) {
      //delete datarow
      const updatedDataRows = Teacher_dataRows.filter((row, rowIndex) => rowIndex !== index);
      set__teacherDatarows(updatedDataRows);
      //delte error message datarow
      const updateddeleteDataRows = Datarow_error_message.filter((row, rowIndex) => rowIndex !== index);
      set_Datarow_error_message(updateddeleteDataRows);


    }
    else {
      set__teacherDatarows(new Array(1).fill('').map(() => ({ ...Empty_data_Teacher })));
      set_Datarow_error_message(new Array(1).fill('').map(() => ({ ...Empty_data_Teacher })));
    }
    setRowsToDeleteCount(1)
  };


  const handleDeleteRows = () => {
    if (rowsToDeleteCount < Teacher_dataRows.length) {

      set__teacherDatarows(Teacher_dataRows.slice(0, Teacher_dataRows.length - rowsToDeleteCount));
      //delte error message datarow
      set_Datarow_error_message(Datarow_error_message.slice(0, Datarow_error_message.length - rowsToDeleteCount));

    }
    else {
      set__teacherDatarows(new Array(1).fill('').map(() => ({ ...Empty_data_Teacher })));
      set_Datarow_error_message(new Array(1).fill('').map(() => ({ ...Empty_data_Teacher })))
    }
  };

  const handleUndo = () => {
    if (currentIndex.current > 0) {
      setHistoryon(true);
      currentIndex.current = (currentIndex.current - 1);
      set__teacherDatarows(history.current[currentIndex.current]['teacherRows']);
      set_Datarow_error_message(history.current[currentIndex.current]['error_row']);


    }
  };

  const handleRedo = () => {
    if (currentIndex.current < history.current.length - 1) {
      setHistoryon(true);
      currentIndex.current = (currentIndex.current + 1);
      set__teacherDatarows(history.current[currentIndex.current]['teacherRows']);
      set_Datarow_error_message(history.current[currentIndex.current]['error_row']);
    }
  };

  const isValidData = (sdatarows: DataRow_Teacher[]) => {
    let res = true;
    //check all row are filled

    // Check if Teacher_Name and Teacher_Email are not empty

    for (let i in sdatarows) {
      let obj = sdatarows[i];
      // Check if Student_Name and Student_Email are not empty
      Object.keys(obj).map((key) => {
        if (obj[key] === '') {

          Datarow_error_message[i][key] = 'Fill this'
          res = false
        }
      })
    }


    //check if any email repeated or not
    const seen: { [key: string]: boolean } = {};
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    for (let i in sdatarows) {
      //if email vaild
      if (emailPattern.test(sdatarows[i]['Teacher_Email'])) {
        //if email already in storage
        if (seen[sdatarows[i].Teacher_Email]) {
          setMessage((p) => [...p, `Email repeated in ${parseInt(i) + 1}th row, it must be unique`])
          Datarow_error_message[i]['Teacher_Email'] = 'Email repeated'
          res = false // Found a duplicate
        }
        if (sdatarows[i].Teacher_Email !== '')
          seen[sdatarows[i].Teacher_Email] = true; // Record the string as seen
      } else {
        Datarow_error_message[i]['Teacher_Email'] = 'Email Not valid'
      }
    }

    //check emial exist in storage
    sdatarows.map((row, index) => CheckEmailExist(row['Teacher_Email'], index));

    //check if all length are 0 in Datarow_error_message 
    Datarow_error_message.map((row, index) => {
      if (row.Teacher_Name !== '' || row.Teacher_Email !== '') {
        setMessage((p) => [...p, `Fix Error in ${index + 1}th row`])
        res = false;
      }
    })

    return res

  }

  async function submitData(sdatarows: DataRow_Teacher[]) {
    set_loading(true);
    try {
      if (!isValidData(sdatarows)) {
        throw new Error("Error:Fix all Error");

      }

      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }

      const response = await fetch(`api?page=admin&action=add_data_teacher`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Teacher_dataRows, token }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }


      const data = await response.json(); // convert json to object


      if (data.hasOwnProperty('error')) {
        throw new Error("Server Error");
      }

      if (data.hasOwnProperty('sheet_invalid')) {
        sessionStorage.clear();
        setTimeout(() => {
          navigate('/login')
        }, 5000);
      }
      //if data added on sheet
      if (data.hasOwnProperty('is_data_added')) {
        if (data.is_data_added === 'yes' && data.hasOwnProperty('Sheet_Column_Length')) {

          const tjson = localStorage.getItem('Teacher_Data')//get exist data in localstorage

          let upd_Teacher_data;
          // merge if previous data exist with new data
          if (tjson) {
            const pre_Teacher_data: DataRow_Teacher[] = JSON.parse(tjson);//get previous data
            upd_Teacher_data = [...pre_Teacher_data, ...sdatarows];
          }
          //mean no data exist in localstorage then add new data
          else {
            upd_Teacher_data = sdatarows
          }
          //get length of updata coloum
          const upd_length = upd_Teacher_data.length;

          //if length of colum on database and locastorgae same then save
          if (upd_Teacher_data === data.Sheet_Column_Length) {
            //update local storage
            const ujson = JSON.stringify(upd_Teacher_data)
            localStorage.setItem('Teacher_Data', ujson);
          }
          else {
            //error column not equal 
            //run syncing funtion of student data
          }

          set__teacherDatarows(new Array(rowsToAddCount).fill('').map(() => ({ ...Empty_data_Teacher })))
        }
        else {
          setMessage((p) => [...p, 'Data Not Added'])
        }
      }

      setMessage((p) => [...p, data.message]);

    } catch (error: any) {
      set_loading(false)
      console.error('An error occurred:', error.message);
      setMessage((p) => [...p, 'An error occurred:' + error.message]);
    }
  }



  const handlePasteClipboard = async () => {
    if (selectedColumn === '') {
      return; // No column selected
    }

    try {
      const clipboardText = await navigator.clipboard.readText();
      const pastedData = clipboardText.split('\r\n').filter(data => data.trim() !== ''); // Remove empty lines

      if (pastedData.length === 0) {
        return; // No data to paste
      }


      // Find the last filled row in the selected column
      const lastFilledRow = Teacher_dataRows
        .slice()
        .reverse()
        .find(row => row[selectedColumn].trim() !== '' || null);

      // If there's no filled row, start pasting from the first row
      const lastfilledIndex: any = lastFilledRow
        ? Teacher_dataRows.indexOf(lastFilledRow) + 1
        : 0;

      // Ensure the pasted data fits within the array
      const rowsToAdd = Math.max(0, pastedData.length - (Teacher_dataRows.length - lastfilledIndex));

      const newRows = new Array(rowsToAdd).fill('').map(() => ({ ...Empty_data_Teacher }));
      const updatedDataRows = [...Teacher_dataRows, ...newRows];

      // Fill in the data from the clipboard
      pastedData.forEach((data, index) => {
        updatedDataRows[lastfilledIndex + index][selectedColumn] = data;
      });


      set__teacherDatarows(updatedDataRows);
      setSelectedColumn('');

      // Add the updated dataRows to history

    } catch (error) {
      console.error('Error reading clipboard data:', error);
    }
  };



  return (

    <div className=" text-center p-2 md:p-8 rounded-lg h-full">

      <h1 className="flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
        <span className="bg-clip-text text-transparent bg-gradient-to-tl from-slate-300 to-gray-300 bg-lime-50 p-3 rounded-lg">
          Add Teacher
        </span>
      </h1>

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

        <h1 className="mt-10 mb-5 flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-tl from-blue-500 to-red-500 bg-lime-50 rounded-lg">
            Fill the Form
          </span>
        </h1>
        <div className='overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2'>
          <table className="table-auto w-full ">
            <thead className=' text-center items-center '>
              <tr className=''>
                <th colSpan={2} className=" text-xl md:text-3xl font-bold px-4 py-2">Teachers</th>

              </tr>
              <tr className=' '>
                <th className="text-lg md:text-2xl font-bold py-2 pr-20">Name</th>
                <th className="text-lg md:text-2xl font-bold py-2 pr-20">Email</th>
                {/* Add more column headers */}
              </tr>
            </thead>
            <tbody >
              {Teacher_dataRows.map((row, rowIndex) => (
                <tr key={rowIndex} className=' rounded-lg solid'>
                  {Object.keys(row).map((key) => (
                    <td key={key} className="px-4 py-2">
                      <input
                        maxLength={50}
                        id={`input-${rowIndex}-${key}`}
                        value={row[key]}
                        placeholder={`Enter ${key}`}
                        onChange={(e) =>
                          handleInputChange_Teacher(rowIndex, key, e.target.value)
                        }
                        className={`${Datarow_error_message[rowIndex][key] !== '' ? 'border-red-300 border-4' : ' focus:border-4 focus:border-blue-400 border'} rounded-xl font-bold  p-2 focus:outline-none  hover:bg-slate-100 hover:text-black`}
                      />
                      {Datarow_error_message[rowIndex][key].length !== 0 && <h5 className=''>{Datarow_error_message[rowIndex][key]}</h5>}
                    </td>
                  ))}
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleDeleteRow_Teaher(rowIndex)}
                      className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-red-700 hover:border-red-700 focus:outline-none"
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

      <div className='  p-4 bg-gradient-to-tr from-blue-200 to-red-200 hover:bg-gradient-to-r rounded-lg mt-10 mb-5'>
        <h1 onClick={() => set_open_copyPaste((p) => !p)} className="  flex text-center items-center justify-center text-lg md:text-2xl font-bold text-gray-900 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-600  rounded-lg">
            {open_copyPaste ? 'Close' : 'Open Copy&Paste'}
          </span>
        </h1>
        {open_copyPaste &&

          <div className="flex mt-5 flex-col md:flex-row mb-4 md:items-center">
            <div className="md:mr-4 mb-2 md:mb-0">
              {Object.keys(Teacher_dataRows[0]).map((columnName, columnIndex) => (
                <button
                  key={columnIndex}
                  onClick={() => handleColumnSelection(columnName)}
                  className={`   px - 4 py - 2 pt - 2 rounded - lg mr - 2 mb - 2 md:mb-0 hover:bg-blue-300 ${selectedColumn === columnName ? ' bg-blue-100 text-blue-700' : 'bg-blue-400 text-white'}`}
                >
                  Select {columnName}
                </button>
              ))}
            </div>
            <p className={`${selectedColumn !== '' ? 'block' : 'hidden'} `}><h1 className=' font-semibold '>Note:</h1><h3 className=' font-medium'>First copy only one coloum of google spreadsheet then select target coloum to paste data</h3></p>
            <button
              onClick={handlePasteClipboard}
              disabled={selectedColumn === ''}
              className={`bg-green-500 text-white  p-5 py-2 rounded-lg hover:bg-green-400 ${selectedColumn ? '' : 'opacity-50 cursor-not-allowed'
                }`}
            >
              Paste Clipboard
            </button>
          </div>
        }
      </div>

      {
        loading
          ?
          <div className="  ml-auto mr-auto  animate-spin rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
          :
          <button
            onClick={() => submitData(Teacher_dataRows)}
            className=" bg-gradient-to-t text-xl font-bold hover:bg-gradient-to-b from-red-400 to-blue-400  text-white px-4 py-2 rounded-lg">
            Submit
          </button>
      }


      {
        message.length !== 0 &&
        message.map((message, i) => (
          <div className="bg-red-100 text-center mt-5 border-t border-b border-red-300 text-red-700 px-4 py-3" role="alert">
            <p className="text-sm">{message}</p>
          </div>
        ))
      }



    </div >
  );
};




export const Add_data_teacher: React.FC = () => {


  return (
    <div className="p-4 md:p-8">

      < SpreadsheetInterface />
    </div>
  );
};

export default Add_data_teacher;