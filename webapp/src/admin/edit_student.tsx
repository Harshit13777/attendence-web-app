
import React, { useState, useEffect, useRef } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { debounce, last } from 'lodash';
import { paste } from '@testing-library/user-event/dist/paste';
import { Form, useNavigate } from 'react-router-dom';



interface DataRow_Student {
    Student_Name: string;
    Student_Roll_No: string;
    Student_Email: string;
    [key: string]: string; // Index signature to allow dynamic properties
}
type HistoryItem = {
    studentRows: DataRow_Student[];
    error_row: DataRow_Student[];
    update_row: { [key: string]: string; }[]

};


const SpreadsheetInterface = () => {
    const Empty_data_Student = { Student_Name: '', Student_Roll_No: '', Student_Email: '' };

    const [storage_dataRows, set_storage_dataRows] = useState<DataRow_Student[] | null>(null)

    const [Student_dataRows, set_studentDatarows] = useState<DataRow_Student[]>([]);
    const [Datarow_error_message, set_Datarow_error_message] = useState<DataRow_Student[]>([])

    const [Student_updatedRows, set_student_updatedRows] = useState<{ [key: string]: string; }[]>([])
    const [student_deleteRows, set_student_deleteRows] = useState<{ deleted: boolean }[]>([]);

    const [message, setMessage] = useState(['']);
    const MAX_HISTORY_LENGTH = 10; // Set a suitable limit
    const history = useRef<HistoryItem[]>([{ studentRows: Student_dataRows, error_row: Datarow_error_message, update_row: Student_updatedRows }]);

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
            const edit_med = JSON.parse(JSON.stringify(Student_updatedRows));
            //console.log(Student_dataRows[0]['Student_Email'], ' ', Datarow_error_message[0]['Student_Email']);
            const newHistory = [...history.current.slice(0, currentIndex.current + 1), { studentRows: [...Student_dataRows], error_row: error_mes, update_row: edit_med }].slice(-MAX_HISTORY_LENGTH);
            history.current = (newHistory);
            console.log(newHistory)
            currentIndex.current = (newHistory.length - 1);
        }, 300);

        if (!historyon)
            debouncedUpdateHistory();
        else
            setHistoryon(false);

    }, [Student_dataRows]);


    useEffect(() => {//get data form localstorge
        const sjson = localStorage.getItem('Student_Data');
        if (sjson) {
            const Student_data: DataRow_Student[] = JSON.parse(sjson);
            set_studentDatarows(Student_data);
            set_storage_dataRows(Student_data);
            //make datarow for error message
            const newErrorRow = new Array(Student_data.length).fill('').map(() => ({ ...Empty_data_Student }));
            set_Datarow_error_message(newErrorRow)
            //make update datarow 
            const updateRowEMpty = new Array(Student_data.length).fill('').map(() => ({}));
            set_student_updatedRows(updateRowEMpty);
            //make delete datarow 
            const deleteRowEMpty = new Array(Student_data.length).fill('').map(() => ({ deleted: false }));
            set_student_deleteRows(deleteRowEMpty);
            //set history
            history.current = ([{ studentRows: Student_data, error_row: newErrorRow, update_row: updateRowEMpty }])

        }
    }, [])

    const handleInputChange_Teacher = (index: number, field: string, value: string) => {
        //add data change in dataRows 


        const datarowerror = Datarow_error_message;


        datarowerror[index][field] = ''
        if (storage_dataRows)
            if (value !== storage_dataRows[index][field]) {
                Student_updatedRows[index][field] = value;
            }
            else {
                delete Student_updatedRows[index][field];
            }


        if (field === 'Student_Roll_No') {
            const Namevalue = Student_dataRows[index]['Student_Name'] === '';
            if (Namevalue) {
                datarowerror[index]['Student_Name'] = 'Fill this'
            }
        }
        if (field === 'Student_Email') {
            //if name is empty then make border red
            const Namevalue = Student_dataRows[index]['Student_Name'] === '';
            if (Namevalue) {
                datarowerror[index]['Student_Name'] = 'Fill this'
            }

            const Rollvalue = Student_dataRows[index]['Student_Roll_No'] === ''
            if (Rollvalue) {
                datarowerror[index]['Student_Roll_No'] = 'Fill this'

            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            const isValidEmail = emailPattern.test(value);

            // Update the border color based on email validity
            if (!isValidEmail) {
                datarowerror[index]['Student_Email'] = 'Email Not valid'
            }
            //check if email update then check if already exist 
            if (storage_dataRows && Student_updatedRows[index].hasOwnProperty(field))//check if email exist already
                CheckEmailExist(value, index);


        }

        const newDataRows = Student_dataRows.map((row, rowIndex) =>
            rowIndex === index ? { ...row, [field]: value } : row
        );

        set_Datarow_error_message(datarowerror);
        set_studentDatarows(newDataRows);


    };

    const CheckEmailExist = async (input_email: string, index: number) => {
        const exist = storage_dataRows?.find((row) => row.Student_Email === input_email);
        if (exist) {
            Datarow_error_message[index]['Student_Email'] = 'Email already Added'
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


    //by delete button
    const handleDeleteRow_student = (index: number) => {
        if (Student_dataRows.length > 1) {
            if (student_deleteRows[index]['deleted'] === false) {

                const deleterow = student_deleteRows.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, ['deleted']: true } : row
                );
                set_student_deleteRows(deleterow)
            }
            else {

                const deleterow = student_deleteRows.map((row, rowIndex) =>
                    rowIndex === index ? { ...row, ['deleted']: false } : row
                );
                set_student_deleteRows(deleterow)
            }

        }
    };

    const handleUndo = () => {
        if (currentIndex.current > 1) {
            setHistoryon(true);
            currentIndex.current = (currentIndex.current - 1);
            console.log(history.current[currentIndex.current]['error_row'][0]['Student_Email'], ' ', history.current[currentIndex.current]['studentRows'][0]['Student_Email']);
            set_studentDatarows(history.current[currentIndex.current]['studentRows']);
            set_Datarow_error_message(history.current[currentIndex.current]['error_row']);
            set_student_updatedRows(history.current[currentIndex.current]['update_row']);
        }
    };

    const handleRedo = () => { //
        if (currentIndex.current < history.current.length - 1) {
            setHistoryon(true);
            currentIndex.current = (currentIndex.current + 1);
            set_studentDatarows(history.current[currentIndex.current]['studentRows']);
            set_Datarow_error_message(history.current[currentIndex.current]['error_row']);
            set_student_updatedRows(history.current[currentIndex.current]['update_row']);


        };
    }


    const isValidData = (sdatarows: DataRow_Student[]) => {
        let res = true;
        for (let i in sdatarows) {
            let obj = sdatarows[i];
            // Check if Student_Name and Student_Email are not empty
            // Check if Student_Name and Student_Email are not empty
            if (!((obj.Student_Name !== '' && obj.Student_Email !== '' && obj.Student_Roll_No) || (obj.Student_Name === '' && obj.Student_Email === '' && obj.Student_Roll_No === ''))) {
                setMessage((p) => [...p, 'Empty cell in Student column'])
                res = false
            }

            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

            if (!emailPattern.test(obj.Student_Email)) {
                setMessage((p) => [...p, `Email not valid:${obj.Student_Email}`])
                res = false
            }
            if (!res) {
                return res
            }

        }
        return res;

    }

    async function submitData(sdatarows: DataRow_Student[]) {

        set_loading(true);
        try {
            if (!isValidData(sdatarows)) {
                throw new Error("Error:Fill the Form");

            }

            const token = sessionStorage.getItem('token');
            if (!token) {
                sessionStorage.clear();
                setTimeout(() =>
                    navigate('/login')
                    , 5000);
                throw new Error('Error : No Token Found')
            }

            const response = await fetch(`api?page=admin&action=add_data_student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Student_dataRows, token }),
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

            if (data.hasOwnProperty('is_data_added')) {
                if (data.is_data_added === 'yes' && data.hasOwnProperty('Sheet_Column_Length')) {

                    const tjson = localStorage.getItem('Student_Data')//get exist data in localstorage

                    const StudentName_arr = sdatarows.map((row) => row.Student_Name)//get new added name array
                    const StudentEmail_arr = sdatarows.map((row) => row.Student_Email)//get new added email array
                    const StudentRoll_arr = sdatarows.map((row) => row.Student_Roll_No)//get new added email array
                    let upd_Student_data: { Name: string[], Email: string[], Roll_No: string[] };
                    // merge if previous data exist with new data
                    if (tjson) {
                        const pre_Student_data: { Name: string[], Email: string[], Roll_No: string[] } = JSON.parse(tjson);//get previous data
                        upd_Student_data = { Name: [...pre_Student_data.Name, ...StudentName_arr], Email: [...pre_Student_data.Email, ...StudentEmail_arr], Roll_No: [...pre_Student_data.Roll_No, ...StudentRoll_arr] };
                    }
                    //mean no data exist in localstorage then add new data
                    else {
                        upd_Student_data = { Name: StudentName_arr, Email: StudentEmail_arr, Roll_No: StudentRoll_arr };
                    }
                    //get length of updata coloum
                    const upd_name_length = upd_Student_data.Name.length;
                    const upd_email_length = upd_Student_data.Email.length;
                    const upd_Roll_length = upd_Student_data.Roll_No.length;
                    //if length of colum same then save
                    if (upd_name_length === upd_email_length && upd_email_length === upd_Roll_length && upd_name_length === data.Sheet_Column_Length) {
                        //update local storage
                        const ujson = JSON.stringify(upd_Student_data)
                        localStorage.setItem('Student_Data', ujson);
                    }
                    else {
                        //error column not equal 
                        //run syncing funtion of student data
                    }

                    set_studentDatarows(new Array(rowsToAddCount).fill('').map(() => ({ ...Empty_data_Student })))
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
            const lastFilledRow = Student_dataRows
                .slice()
                .reverse()
                .find(row => row[selectedColumn].trim() !== '' || null);

            // If there's no filled row, start pasting from the first row
            const lastfilledIndex: any = lastFilledRow
                ? Student_dataRows.indexOf(lastFilledRow) + 1
                : 0;

            // Ensure the pasted data fits within the array
            const rowsToAdd = Math.max(0, pastedData.length - (Student_dataRows.length - lastfilledIndex));

            const newRows = new Array(rowsToAdd).fill('').map(() => ({ ...Empty_data_Student }));
            const updatedDataRows = [...Student_dataRows, ...newRows];

            // Fill in the data from the clipboard
            pastedData.forEach((data, index) => {
                updatedDataRows[lastfilledIndex + index][selectedColumn] = data;
            });


            set_studentDatarows(updatedDataRows);
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
                    Edit Student
                </span>
            </h1>
            {
                Student_dataRows.length !== 0
                    ?
                    <>
                        <div className="flex mt-4  bg-gradient-to-br from-blue-200 to-red-100 p-4 rounded-xl overflow-x-scroll">
                            <div className="flex gap-x-5  md:gap-x-3  w-full  justify-center">
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

                        </div>

                        <div className="  mb-4  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >

                            <div className='overflow-x-scroll mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-8 border-l-8  border-blue-400 rounded-xl  p-2'>
                                <table className="table-auto w-full ">
                                    <thead className=' text-center items-center '>
                                        <tr className=''>
                                            <th colSpan={3} className=" text-xl md:text-3xl font-bold px-4 py-2">Student</th>

                                        </tr>
                                        <tr className=' '>
                                            <th className="text-lg md:text-2xl font-bold py-2 pr-20">Name</th>
                                            <th className="text-lg md:text-2xl font-bold py-2 pr-20">Roll No</th>
                                            <th className="text-lg md:text-2xl font-bold py-2 pr-20">Email</th>
                                            {/* Add more column headers */}
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {Student_dataRows.map((row, rowIndex) => (
                                            <tr key={rowIndex} id={`input-${rowIndex}`} className={`${student_deleteRows[rowIndex]['deleted'] ? 'bg-red-200' : ''}`}>
                                                {Object.keys(row).map((key) => (
                                                    <td key={key} className={`px-4 py-2 ${student_deleteRows[rowIndex]['deleted'] ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        <input
                                                            maxLength={50}
                                                            id={`input-${rowIndex}-${key}`}
                                                            value={row[key]}
                                                            placeholder={`Enter ${key}`}
                                                            onChange={(e) =>
                                                                handleInputChange_Teacher(rowIndex, key, e.target.value)
                                                            }
                                                            className={`${Datarow_error_message[rowIndex][key] !== '' ? 'border-red-300 border-4' : Student_updatedRows[rowIndex].hasOwnProperty(key) ? ' border-green-300 border-4' : ' focus:border-4 focus:border-blue-400 border'} rounded-xl font-bold  p-2 focus:outline-none  hover:bg-slate-100 hover:text-black`}
                                                        />
                                                        {Datarow_error_message[rowIndex][key].length !== 0 && <h5 className=''>{Datarow_error_message[rowIndex][key]}</h5>}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => handleDeleteRow_student(rowIndex)}
                                                        className="bg-red-500 text-white rounded-lg px-4 py-2 hover:bg-white hover:text-red-700 hover:border-red-700 focus:outline-none"
                                                    >
                                                        {student_deleteRows[rowIndex]['deleted'] !== true ? 'Delete' : 'UnDelete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>

                        <div className='  p-4 bg-gradient-to-tr from-blue-200 to-red-100 hover:bg-gradient-to-r rounded-lg mt-10 mb-5'>
                            <h1 onClick={() => set_open_copyPaste((p) => !p)} className="  flex text-center items-center justify-center text-lg md:text-2xl font-bold text-gray-900 ">
                                <span className="bg-clip-text text-transparent bg-gradient-to-l from-slate-800 to-slate-600  rounded-lg">
                                    {open_copyPaste ? 'Close' : 'Open Copy&Paste'}
                                </span>
                            </h1>
                            {open_copyPaste &&

                                <div className="flex mt-5 flex-col md:flex-row mb-4 md:items-center">
                                    <div className="md:mr-4 mb-2 md:mb-0">
                                        {Object.keys(Empty_data_Student).map((columnName, columnIndex) => (
                                            <button
                                                key={columnIndex}
                                                onClick={() => handleColumnSelection(columnName)}
                                                className={`   px-4 py-2 pt-2 rounded-lg mr-2 mb-2 md:mb-0 hover:bg-blue-300 ${selectedColumn === columnName ? ' bg-blue-100 text-blue-700' : 'bg-blue-400 text-white'}`}
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
                                    onClick={() => submitData(Student_dataRows)}
                                    className=" bg-gradient-to-t text-xl font-bold hover:bg-gradient-to-b from-red-400 to-blue-400  text-white px-4 py-2 rounded-lg">
                                    Submit
                                </button>
                        }

                        {message.length !== 0 &&
                            message.map((message, i) => (
                                <div className="bg-red-100 text-center mt-5 border-t border-b border-red-300 text-red-700 px-4 py-3" role="alert">
                                    <p className="text-sm">{message}</p>
                                </div>
                            ))}

                    </>
                    :
                    <div className="  mb-4  bg-gradient-to-tr from-blue-200 to-red-200 rounded-xl  p-2"  >

                        <h1 className="mt-10 mb-5 flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
                            <span className="bg-clip-text text-transparent bg-gradient-to-tl from-blue-800 to-red-500 bg-lime-50 rounded-lg">
                                No Data Exist
                            </span>
                        </h1>
                    </div>
            }

        </div>
    );
};




export const Edit_student: React.FC = () => {


    return (
        <div className="p-4 md:p-8">

            < SpreadsheetInterface />
        </div>
    );
};