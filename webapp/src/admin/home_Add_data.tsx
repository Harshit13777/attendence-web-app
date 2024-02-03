import React, { useState,useEffect } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { last } from 'lodash';
import { paste } from '@testing-library/user-event/dist/paste';


interface DataRow {
    Teacher_Name: string;
    Teacher_Email: string;
    Student_Name: string;
    Student_Roll_No:string;
    Student_Email:string;
    [key: string]: string; // Index signature to allow dynamic properties
  }

const SpreadsheetInterface = () => {
  const Empty_data={Teacher_Name:'',Teacher_Email:'', Student_Name:'',Student_Roll_No:'', Student_Email:''};
  const [dataRows, setDataRows] = useState<DataRow[]>([
  {...Empty_data}
    // Add more initial rows as needed
  ]);
  const [message,setMessage]=useState(['']);
  const MAX_HISTORY_LENGTH=10; // Set a suitable limit
  const [history, setHistory] = useState([dataRows]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const  [historyon,setHistoryon]=useState(false);
  
  const [selectedColumn, setSelectedColumn] = useState('');//data for copy clipboard 
  const [rowsToAddCount, setRowsToAddCount] = useState(1); // Default value for row count to add
  const [rowsToDeleteCount, setRowsToDeleteCount] = useState(1); // Default value for row count to delete

  
  useEffect(()=>{
    
  const debouncedUpdateHistory = _debounce(() => {
    const newHistory = [...history.slice(0, currentIndex + 1),dataRows].slice(-MAX_HISTORY_LENGTH);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    
    }, 300);
    if(message.length>3){
      setMessage([]);
    }
    if(!historyon)
      debouncedUpdateHistory();
    else
      setHistoryon(false);

  },[dataRows])
  
  const handleInputChange = (index: number, field: string, value: string) => {
    //add data change in dataRows 
    const newDataRows = dataRows.map((row, rowIndex) =>
    rowIndex === index ? { ...row, [field]: value } : row
  );
    setDataRows(newDataRows);
    
  
  };

  

  const handleColumnSelection = (columnName:string) => {//choose coloum for clipboard
    if(selectedColumn===columnName){
      setSelectedColumn('');
    }
    else
      setSelectedColumn(columnName);    
  };
  
  const handleAddRows = () => {
    if(rowsToAddCount>0){

      const emptyRow = { name: '', age: '', email: '' };
      const newRows = new Array(rowsToAddCount).fill('').map(() => ({...Empty_data}));
      setDataRows([...dataRows, ...newRows]);
    }
  };

  const handleDeleteRow = (index:number) => {
    if(dataRows.length>1){

      const updatedDataRows = dataRows.filter((row, rowIndex) => rowIndex !== index);
      setDataRows(updatedDataRows);
     
    }
    else{
      setDataRows( new Array(1).fill('').map(() => ({...Empty_data})));
    }
  };

  const handleDeleteRows = () => {
    if (rowsToDeleteCount < dataRows.length) {
      
      setDataRows(dataRows.slice(0, dataRows.length - rowsToDeleteCount));
      
    }
  };
  
  const handleUndo = () => {
    if (currentIndex > 0) {
      setHistoryon(true);
      setCurrentIndex(currentIndex - 1);
      setDataRows(history[currentIndex-1]);
      
    }
  };
  
  const handleRedo = () => {
    if (currentIndex < history.length - 1) {
      setHistoryon(true);
      setCurrentIndex(currentIndex + 1);
      setDataRows(history[currentIndex + 1]);
    }
  };
  
  const isValidData=()=> {
    for (let i in dataRows) {
      let obj=dataRows[i];
      
      // Check if Teacher_Name and Teacher_Email are not empty
      if(!((obj.Teacher_Name !== '' && obj.Teacher_Email !== '') || ((obj.Teacher_Name === '' && obj.Teacher_Email === '') && (obj.Student_Name !== '' && obj.Student_Email !== '' && obj.Student_Roll_No!==''))))
        return false;
      
    
      // Check if Student_Name and Student_Email are not empty
      if(!((obj.Student_Name !== '' && obj.Student_Email !== '' && obj.Student_Roll_No) || (obj.Student_Name === '' && obj.Student_Email === '' && obj.Student_Roll_No=== '')))
        return false;
    
    } 
      return true;
    
  }

  async function submitData() {
    try {
      if (!isValidData()) {
        setMessage(['Error: Fill the empty value']);
        return;
      }
      
      let Admin_Sheet_Id = sessionStorage.getItem('Admin_Sheet_Id');
      let username = sessionStorage.getItem('username');
      
      const response = await fetch(`api?page=admin&action=add_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataRows, Admin_Sheet_Id, username }),
      });
      
      if (!response.ok) {
        setMessage(['Network error']);
        console.log('Network response was not ok');
        return;
      }
      
      const data = await response.json(); // convert json to object
      
      if (data.hasOwnProperty('message')) {
        setMessage(data.message);
        setDataRows(new Array(1).fill('').map(() => ({ ...Empty_data })));
        setMessage(['Login email sent successfully']);
        return;
      }
      
      if (data.hasOwnProperty('sheet_invalid')) {
        
          sessionStorage.removeItem('Admin_Sheet_Id');
          setMessage(['Sheet not Found']);
       
        return;
      }
      
    
    } catch (error) {
      console.error('An error occurred:', error);
      setMessage(['An error occurred. Please try again later.']);
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
      const lastFilledRow = dataRows
        .slice()
        .reverse()
        .find(row => row[selectedColumn].trim() !== '' || null);
  
      // If there's no filled row, start pasting from the first row
      const lastfilledIndex :any= lastFilledRow
        ? dataRows.indexOf(lastFilledRow) + 1
        : 0;
  
      // Ensure the pasted data fits within the array
      const rowsToAdd = Math.max(0, pastedData.length - (dataRows.length - lastfilledIndex));
  
      const newRows = new Array(rowsToAdd).fill('').map(() => ({...Empty_data}));
      const updatedDataRows=[...dataRows, ...newRows];
  
      // Fill in the data from the clipboard
      pastedData.forEach((data, index) => {
        updatedDataRows[lastfilledIndex + index][selectedColumn] = data;
      });
  
      
      setDataRows(updatedDataRows);
      setSelectedColumn('');
  
      // Add the updated dataRows to history
    
    } catch (error) {
      console.error('Error reading clipboard data:', error);
    }
  };
  

  
  
  return (
    
    <div className="p-4 md:p-8">
    <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2">
      <h1 className="text-4xl font-bold text-gray-900">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
          Add Data
        </span>
      </h1>
    </div>
  
      <div className="flex flex-row justify-between mt-2">
        <div className="flex mb-2 md:mb-0">
          <img src={undo_icon}
            title='Undo'
            onClick={handleUndo}
            className="bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:opacity-50 "
          />
            
          
          <img
            src={redo_icon}
            title='Redo'
            onClick={handleRedo}
            className="bg-blue-500 text-white px-2 py-1 rounded hover:opacity-50"
          />
            
        </div>
        <div className="flex">
          <input
            type="number"
            value={rowsToAddCount}
            onChange={(e) => setRowsToAddCount(parseInt(e.target.value))}
            className="w-16 mr-2 px-2 py-1 border rounded hover:bg-slate-100 "
          />
          <img src={add_icon}
            title='Add Rows'
            onClick={handleAddRows}
            className="bg-green-500 text-white px-2 py-1 rounded hover:opacity-50"
          />
           
        </div>
        <div className="flex">
          <input
            type="number"
            value={rowsToDeleteCount}
            onChange={(e) => setRowsToDeleteCount(parseInt(e.target.value))}
            className="w-16 mr-2 px-2 py-1 border rounded hover:bg-slate-100"
          />
          <img src={minus_icon}
            title='Delete Rows'
            onClick={handleDeleteRows}
            className="bg-red-500 text-white px-2 py-1 rounded hover:opacity-50"
          />
          
        </div>
      </div>
      <div className="overflow-x-auto mb-4">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th colSpan={2} className="px-4 py-2">Teachers</th>
              <th colSpan={3} className="px-4 py-2">Students</th>

            </tr>
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Roll No.</th>
            </tr>
              {/* Add more column headers */}
          </thead>
          <tbody>
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key) => (
                  <td key={key} className="px-4 py-2">
                    <input
                      value={row[key]}
                      placeholder={`Enter ${key}`}
                      onChange={(e) =>
                        handleInputChange(rowIndex, key, e.target.value)
                      }
                      className="w-full border rounded px-2 py-1 hover:bg-slate-100 hover:text-black "
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-white hover:text-red-700 hover:bg-light-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col md:flex-row mb-4 md:items-center">
  <div className="md:mr-4 mb-2 md:mb-0">
    {Object.keys(dataRows[0]).map((columnName, columnIndex) => (
      <button 
        key={columnIndex}
        onClick={() => handleColumnSelection(columnName)}
        className={` bg-blue-500 text-white px-4 py-2 pt-2 rounded mr-2 mb-2 md:mb-0 hover:bg-blue-300 ${selectedColumn===columnName?'opacity-50':''}`}
      >
        Select {columnName}
      </button>
    ))}
  </div>
  <p className={`${selectedColumn!==''?'block':'hidden'} `}>note: To use this <br /> first copy only one coloum of google spreadsheet <br/> then select target coloum to paste data</p>
  <button
    onClick={handlePasteClipboard}
    disabled={selectedColumn === ''}
    className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-400 ${
      selectedColumn ? '' : 'opacity-50 cursor-not-allowed'
    }`}
  >
    Paste Clipboard
  </button>
      </div>

      <button
        onClick={submitData}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:opacity-50">
        Submit
      </button>
      {message.map((message,i)=> (
        <div className="bg-blue-100 border-t border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      ))}

      
     
    </div>
  );
};




export const Add_data: React.FC = () => {
 
  
  return (
    <div className="p-4 md:p-8">
     
   < SpreadsheetInterface/>
    </div>
  );
  };

  export default Add_data;