import React, { useState,useEffect } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { last } from 'lodash';
import { paste } from '@testing-library/user-event/dist/paste';
import { useNavigate } from 'react-router-dom';


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

  const [open_copyPaste,set_open_copyPaste]=useState(false);
  const [loading,set_loading]=useState(false);
  const navigate=useNavigate();

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

  useEffect(()=>{
    if(message.length>0)
      setTimeout(() => {
        setMessage((p)=>p.slice(1,))
      }, 7000);
  },[message])

  const handleColumnSelection = (columnName:string) => {//choose coloum for clipboard
    if(selectedColumn===columnName){
      setSelectedColumn('');
    }
    else
      setSelectedColumn(columnName);    
  };
  
  const handleAddRows = () => {
    if(rowsToAddCount>0){
      if(rowsToAddCount>50){
        setMessage(['Row Length must be less than 50'])
        setRowsToAddCount(1);
        return
      }
      const emptyRow = { name: '', age: '', email: '' };
      const newRows = new Array(rowsToAddCount).fill('').map(() => ({...Empty_data}));
      setDataRows([...dataRows, ...newRows]);
      setRowsToAddCount(1);
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
    setRowsToDeleteCount(1)
  };

  const handleDeleteRows = () => {
    if (rowsToDeleteCount < dataRows.length) {
      
      setDataRows(dataRows.slice(0, dataRows.length - rowsToDeleteCount));
      
    }
    else {
      setDataRows( new Array(1).fill('').map(() => ({...Empty_data})));
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
  
  const isValidData=(sdatarows: DataRow[])=> {
    for (let i in sdatarows) {
      let obj=sdatarows[i];
      let res=true;
      // Check if Teacher_Name and Teacher_Email are not empty
      if(!((obj.Teacher_Name !== '' && obj.Teacher_Email !== '') || ((obj.Teacher_Name === '' && obj.Teacher_Email === '') && (obj.Student_Name !== '' && obj.Student_Email !== '' && obj.Student_Roll_No!==''))))
      { 
        setMessage((p)=>[...p,'Empty cell in Teacher column'])  
        res=false;
      }
      
    
      // Check if Student_Name and Student_Email are not empty
      if(!((obj.Student_Name !== '' && obj.Student_Email !== '' && obj.Student_Roll_No) || (obj.Student_Name === '' && obj.Student_Email === '' && obj.Student_Roll_No=== '')))
      {
        setMessage((p)=>[...p,'Empty cell in Student column']) 
        res=false
      } 
      if(!res){
        return false
      }
    
    } 
      return true;
    
  }

  async function submitData(sdatarows: DataRow[]) {
    set_loading(true);
    try {
      if (!isValidData(sdatarows)) {
        throw new Error("Error:Fill the Form");
        
      }
      
      const token=sessionStorage.getItem('token');
      if(!token){
        sessionStorage.clear();
        setTimeout(()=>
          navigate('/login')
          ,5000);
        throw new Error('Error : No Token Found')
      }
      
      const response = await fetch(`api?page=admin&action=add_data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dataRows, token }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      
    
      const data = await response.json(); // convert json to object
      
      
      if(data.hasOwnProperty('error')){
        throw new Error("Server Error");   
      }
      
      if (data.hasOwnProperty('sheet_invalid')) {
          sessionStorage.clear();
          setTimeout(() => {
            navigate('/login')
          }, 5000);
      }
      
      if(data.hasOwnProperty('is_data_added')){
        if(data.is_data_added==='yes'){
          setDataRows(new Array(rowsToAddCount).fill('').map(() => ({...Empty_data})))
        }
        else{
          setMessage((p)=>[...p,'Data Not Added'])
        }
      }
      
      setMessage((p)=>[...p,data.message]);
    
    } catch (error:any) {
      set_loading(false)
      console.error('An error occurred:', error.message);
      setMessage((p)=>[...p,'An error occurred:'+error.message]);
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
    
    <div className=" text-center p-2 md:p-8 rounded-lg h-full"> 
   
        <h1 className="flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-500 bg-lime-50 p-3 rounded-lg">
            Add Data
          </span>
        </h1>
    
  
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
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-500 bg-lime-50 rounded-lg">
           Fill the Form
          </span>
      </h1>
      <div className=" overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 rounded-xl  p-2"  >
        <table className="table-auto w-full ">
          <thead className=' text-center items-center '>
            <tr className=''>
              <th colSpan={2} className=" text-xl md:text-3xl font-semibold px-4 py-2">Teachers</th>
              <th colSpan={3} className=" text-xl md:text-3xl font-semibold px-4 py-2">Students</th>
            </tr>
            <tr className=' '>
              <th className="text-lg md:text-2xl font-semibold py-2 pr-20">Name</th>
              <th className="text-lg md:text-2xl font-semibold py-2 pr-20">Email</th>
              <th className="text-lg md:text-2xl font-semibold py-2 pr-20">Name</th>
              <th className="text-lg md:text-2xl font-semibold py-2 pr-20">Email</th>
              <th className="text-lg md:text-2xl font-semibold py-2 pr-20">Roll No.</th>
              {/* Add more column headers */}
            </tr>
          </thead>
          <tbody >
            {dataRows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.keys(row).map((key) => (
                  <td key={key} className="px-4 py-2">
                    <input
                      maxLength={50}
                      
                      value={row[key]}
                      placeholder={`Enter ${key}`}
                      onChange={(e) =>
                        handleInputChange(rowIndex, key, e.target.value)
                      }
                      className="border rounded-xl font-bold  p-2 focus:outline-none focus:border-blue-400 hover:bg-slate-100 hover:text-black"
                    />
                  </td>
                ))}
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleDeleteRow(rowIndex)}
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

      <div className=' bg-gradient-to-tr from-blue-200 to-red-100 hover:bg-gradient-to-r rounded-lg p-2 mt-10 mb-5'>      
        <h1 onClick={()=>set_open_copyPaste((p)=>!p)} className="  flex text-center items-center justify-center text-lg md:text-2xl font-bold text-gray-900 ">
            <span className="bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-600  rounded-lg">
              {open_copyPaste?'Close':'Open Copy&Paste'}
            </span>
        </h1>
      {open_copyPaste &&
      
        <div className="flex flex-col md:flex-row mb-4 md:items-center">
        <div className="md:mr-4 mb-2 md:mb-0">
          {Object.keys(dataRows[0]).map((columnName, columnIndex) => (
            <button 
              key={columnIndex}
              onClick={() => handleColumnSelection(columnName)}
              className={`   px-4 py-2 pt-2 rounded-lg mr-2 mb-2 md:mb-0 hover:bg-blue-300 ${selectedColumn===columnName?' bg-blue-100 text-blue-700':'bg-blue-400 text-white'}`}
            >
              Select {columnName}
            </button>
          ))}
        </div>
        <p className={`${selectedColumn!==''?'block':'hidden'} `}><h1 className=' font-semibold '>Note:</h1><h3 className=' font-medium'>First copy only one coloum of google spreadsheet then select target coloum to paste data</h3></p>
        <button
          onClick={handlePasteClipboard}
          disabled={selectedColumn === ''}
          className={`bg-green-500 text-white  py-2 rounded-lg hover:bg-green-400 ${
            selectedColumn ? '' : 'opacity-50 cursor-not-allowed'
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
        onClick={()=>submitData(dataRows)}
        className=" bg-gradient-to-t hover:bg-gradient-to-b from-red-400 to-blue-400  text-white px-4 py-2 rounded-lg">
        Submit
      </button>
      }

      {message.map((message,i)=> (
        <div className="bg-red-100 text-center mt-5 border-t border-b border-red-300 text-red-700 px-4 py-3" role="alert">
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