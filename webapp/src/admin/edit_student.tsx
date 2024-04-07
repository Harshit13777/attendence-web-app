
import React, { useState, useEffect, useRef } from 'react';
import _debounce from 'lodash/debounce';//for saving data in time span
import undo_icon from "../.icons/undo.png";
import redo_icon from '../.icons/redo.png';
import add_icon from "../.icons/add.png";
import minus_icon from '../.icons/minus.png';
import { debounce, last } from 'lodash';
import { paste } from '@testing-library/user-event/dist/paste';
import { Form, useNavigate } from 'react-router-dom';
import { file } from 'googleapis/build/src/apis/file';
import { get_api } from '../static_api';



interface DataRow_Student {
    Student_Name: string;
    Student_Roll_No: string;
    Student_Email: string;
    [key: string]: string; // Index signature to allow dynamic properties
}
type Store_Student_Data = {
    [key: string]: DataRow_Student;
}
type HistoryItem = {
    studentRows: Store_Student_Data;
    error_row: Store_Student_Data;
    update_row: Store_Student_Data

};



const SpreadsheetInterface = () => {
    const Empty_data_Student: DataRow_Student = { Student_Name: '', Student_Roll_No: '', Student_Email: '' };

    const [storage_dataRows, set_storage_dataRows] = useState<Store_Student_Data>({})
    const stored_emails = useRef<{ [key: string]: boolean }>({})
    const stored_Rolls = useRef<{ [key: string]: boolean }>({})

    const [Student_dataRows, set_studentDatarows] = useState<Store_Student_Data>({});
    const [Datarow_error_message, set_Datarow_error_message] = useState<Store_Student_Data>({})

    //key to access localstorage of student data and teacher data
    const student_storage_key = sessionStorage.getItem('student_data_key') as string
    const teacher_storage_key = sessionStorage.getItem('teacher_data_key') as string


    const [Student_updatedRows, set_student_updatedRows] = useState<Store_Student_Data>({})
    const [student_deleteRows, set_student_deleteRows] = useState<{ [key: string]: {} }>({});

    const [message, setMessage] = useState<string[]>([]);
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
            const newHistory = [...history.current.slice(0, currentIndex.current + 1), { studentRows: { ...Student_dataRows }, error_row: error_mes, update_row: edit_med }].slice(-MAX_HISTORY_LENGTH);
            history.current = (newHistory);
            //console.log(newHistory)
            currentIndex.current = (newHistory.length - 1);
        }, 300);

        if (!historyon)
            debouncedUpdateHistory();
        else
            setHistoryon(false);

    }, [Student_dataRows]);


    useEffect(() => {//get data form localstorgebh
        const sjson = localStorage.getItem(student_storage_key);
        if (sjson) {
            const Student_data: Store_Student_Data = JSON.parse(sjson);//{34:{StudentName:string,}}
            const datalength = Object.keys(Student_data).length;
            set_studentDatarows({ ...Student_data });
            set_storage_dataRows({ ...Student_data });
            //add all stored email and rolls in variable so that computation easy
            Object.values(Student_data).map((row, i) => stored_emails.current[row.Student_Email] = true)
            Object.values(Student_data).map((row, i) => stored_Rolls.current[row.Student_Roll_No] = true)
            //set history
            history.current = ([{ studentRows: Student_data, error_row: {}, update_row: {} }])

        }
    }, [])

    const handleInputChange_Teacher = (index: string, field: string, value: string) => {
        //add data change in dataRows 


        const datarowerror = { ...Datarow_error_message };

        datarowerror[index] = { ...datarowerror[index], [field]: '' }


        if (value !== storage_dataRows[index][field]) {
            set_student_updatedRows({
                ...Student_updatedRows,
                [index]: {
                    ...Student_updatedRows[index],
                    [field]: value
                }
            });
        }
        else {
            delete Student_updatedRows[index][field];

        }


        if (field === 'Student_Roll_No') {
            const Namevalue = Student_dataRows[index]['Student_Name'] === '';
            if (Namevalue) {

                datarowerror[index] = { ...datarowerror[index], ['Student_Name']: 'Fill this' }
            }
            if (Student_updatedRows.hasOwnProperty(index) && Student_updatedRows[index].hasOwnProperty(field))
                if (stored_Rolls.current[value])
                    datarowerror[index] = { ...datarowerror[index], ['Student_Roll_No']: 'already added' }

        }
        if (field === 'Student_Email') {
            //if name is empty then make border red
            const Namevalue = Student_dataRows[index]['Student_Name'] === '';
            if (Namevalue) {
                datarowerror[index] = { ...datarowerror[index], ['Student_Name']: 'Fill this' }
            }

            const Rollvalue = Student_dataRows[index]['Student_Roll_No'] === ''
            if (Rollvalue) {
                datarowerror[index] = { ...datarowerror[index], ['Student_Roll_No']: 'Fill this' }

            }
            const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
            const isValidEmail = emailPattern.test(value);

            // Update the border color based on email validity
            if (!isValidEmail) {
                datarowerror[index] = { ...datarowerror[index], ['Student_Email']: 'Not valid' }
            }
            //check if email update then check if already exist 
            else if (Student_updatedRows.hasOwnProperty(index) && Student_updatedRows[index].hasOwnProperty(field))//check if email exist already
                if (stored_emails.current[value])
                    datarowerror[index] = { ...datarowerror[index], ['Student_Email']: 'Already Added' }



        }

        const updatedStudentDataRows = {
            ...Student_dataRows,
            [index]: {
                ...Student_dataRows[index],
                [field]: value
            }
        };
        set_Datarow_error_message(datarowerror);
        set_studentDatarows(updatedStudentDataRows);


    };


    useEffect(() => {
        if (message.length > 0)
            setTimeout(() => {
                setMessage((p) => p.slice(1,))
            }, 7000);
    }, [message])




    //by delete button
    const handleDeleteRow_student = (index: string) => {
        if (Object.keys(Student_dataRows).length > 0) {
            if (!student_deleteRows.hasOwnProperty(index)) {
                // Delete row if not already marked as deleted
                const updatedDeleteRows = {
                    ...student_deleteRows,
                    [index]: {}
                };
                set_student_deleteRows(updatedDeleteRows);
            } else {
                // Undelete row if already marked as deleted
                const { [index]: deletedKey, ...updatedDeleteRows } = student_deleteRows;

                set_student_deleteRows(updatedDeleteRows);
            }
        }
    };


    const handleUndo = () => {
        if (currentIndex.current > 1) {
            setHistoryon(true);
            currentIndex.current = (currentIndex.current - 1);
            //console.log(history.current[currentIndex.current]['error_row'][0]['Student_Email'], ' ', history.current[currentIndex.current]['studentRows'][0]['Student_Email']);
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


    const isValidData = (sdatarows: Store_Student_Data, updatedRows: Store_Student_Data, deleteRows: { [key: string]: {} }) => {
        let res = true;
        console.log(updatedRows, deleteRows)
        //console.log(updatedRows, deleteRows);
        const error_data: Store_Student_Data = Datarow_error_message;
        //check all updated row are filled because all row in storage are already filled
        Object.entries(updatedRows).map(([i, row]) => {

            let obj = updatedRows[i];
            if (!deleteRows.hasOwnProperty(i) && Object.keys(obj).length !== 0) {

                Object.keys(obj).map((key) => {
                    if (obj[key] === '') {
                        error_data[i] = { ...error_data[i], [key]: 'Fill this' }
                    }
                })
            }

        })

        //check if any email repeated or not in updated rows

        const seen_Updated_emails: { [key: string]: boolean } = { ...stored_emails.current };
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;


        for (let i in updatedRows) {
            //if update email vaild 
            if (updatedRows[i].hasOwnProperty('Student_Email'))
                if (emailPattern.test(updatedRows[i]['Student_Email'])) {
                    //if update email found in stored email mean that email already store
                    const updated_email = updatedRows[i].Student_Email
                    if (seen_Updated_emails[updated_email]) {
                        setMessage((p) => [...p, `Email repeated in ${parseInt(i) + 1}th row, it must be unique`])
                        error_data[i] = { ...error_data[i], ['Student_Email']: 'Email repeated' }
                    } else if (updated_email !== '') {
                        seen_Updated_emails[updated_email] = true//add in seen obj
                    }
                } else {
                    error_data[i] = { ...error_data[i], ['Student_Email']: 'Email not valid' }
                }
        }


        //check if any RollNO repeated or not
        const seen_Updated_Rolls: { [key: string]: boolean } = { ...stored_emails.current };
        //put all stored emial in object

        for (let i in updatedRows) {
            //if update email vaild 
            if (updatedRows[i].hasOwnProperty('Student_Roll_No')) {
                //if update email found in stored email mean that email already store
                const updated_Roll = updatedRows[i].Student_Roll_No
                if (seen_Updated_Rolls[updated_Roll]) {
                    setMessage((p) => [...p, `Roll repeated , it must be unique`])
                    error_data[i] = { ...error_data[i], ['Student_Roll_No']: 'Roll repeated' }
                } else if (updated_Roll !== '') {
                    seen_Updated_Rolls[updated_Roll] = true//add in seen obj
                }
            }
        }

        //console.log(error_data)
        //check if all length are 0 in Datarow_error_message 
        Object.values(error_data).map((row, i) => {
            Object.values(row).map((value, i) => {
                if (value !== '') {
                    setMessage((p) => [...p, `Fix Error in ${i + 1}th row`])
                    res = false;
                }
            })

        })

        set_Datarow_error_message(error_data);

        return res;


    }

    async function submitData(sdatarows: Store_Student_Data, updatedRows: Store_Student_Data, deleteRows: { [key: string]: {} }) {

        set_loading(true);
        try {
            if (!isValidData(sdatarows, updatedRows, deleteRows)) {
                throw new Error("Error:Fill the Form");
            }

            //preprocess updated row and deleted row 
            const UpdatedRows_byDelete = { ...updatedRows };
            const Delted_rows_send: string[] = []
            const UpdatedRows_send: { id: string, update: { [key: string]: string; } }[] = []
            //delte row which are in deletedRows array from updatedRows array
            Object.keys(deleteRows).map((id, index) => {

                Delted_rows_send.push(id)//add index in array which will delted
                delete UpdatedRows_byDelete[index]//null updatedrow which is deleted

            })

            Object.entries(UpdatedRows_byDelete).map(([id, row]) => {
                if (Object.keys(row).length !== 0) {
                    UpdatedRows_send.push({ id, update: row });
                }
            })

            if (UpdatedRows_send.length === 0 && Delted_rows_send.length === 0) {
                throw new Error("Data not Edited");

            }

            console.log(UpdatedRows_send, Delted_rows_send)

            const token = sessionStorage.getItem('token');
            if (!token) {
                sessionStorage.clear();
                setTimeout(() =>
                    navigate('/login')
                    , 5000);
                throw new Error('Error : No Token Found')
            }

            const response = await fetch(`${get_api().admin_api}?page=admin&action=edit_data_student`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({ UpdatedRows: UpdatedRows_send, DeletedRows: Delted_rows_send, token }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok')
            }


            const data = await response.json(); // convert json to object


            if (data.hasOwnProperty('error')) {
                throw new Error("Server Error");
            }

            if (data.hasOwnProperty('sheet_invalid')) {
                sessionStorage.removeItem('sheet_exist')
                setTimeout(() => {
                    navigate('/sheet invalid')
                }, 50);
            }

            if (data.hasOwnProperty('sheet_Erased')) {
                if (data.sheet_Erased.includes('Student')) {
                    localStorage.removeItem(student_storage_key)
                }
                else if (data.sheet_Erased.includes('Teacher')) {
                    localStorage.removeItem(teacher_storage_key)
                }
                setTimeout(() => {
                    navigate('/admin')
                }, 1000);
                throw new Error(data.sheet_Erased);

            }

            if (data.hasOwnProperty('data_edited') && data.hasOwnProperty('Invalid_Emails')) {

                const tjson = localStorage.getItem(student_storage_key)//get exist data in localstorage
                if (tjson) {

                    const updated_data: Store_Student_Data = Student_dataRows;
                    //delete the row which user want
                    Delted_rows_send.map((id, index) => delete updated_data[id])

                    //so if some email not valid then we store all rest of data with old email in storage and show updated data with curreent invalid email on screen with error

                    //email invalid 
                    const invalid_emial_id: string[] = data.Invalid_Emails;
                    const save_updated_data = updated_data;
                    const datarow_error: any = {}
                    invalid_emial_id.map((id, i) => {
                        //so email not updated so we save updated data with student email data from previous store data
                        save_updated_data[id] = { ...save_updated_data[id], ['Student_Email']: storage_dataRows[id].Student_Email }
                        datarow_error[id] = { 'Student_Email': 'Email Not Valid' }
                    })

                    const sjson = JSON.stringify(save_updated_data);
                    localStorage.setItem(student_storage_key, sjson);

                    set_storage_dataRows(save_updated_data);

                    set_Datarow_error_message(datarow_error)
                    set_student_updatedRows({})
                    set_student_deleteRows({});
                    //add all stored email and rolls in variable so that computation easy
                    Object.values(save_updated_data).map((row, i) => stored_emails.current[row.Student_Email] = true)
                    Object.values(save_updated_data).map((row, i) => stored_Rolls.current[row.Student_Roll_No] = true)
                    history.current = ([{ studentRows: save_updated_data, error_row: datarow_error, update_row: {} }])

                    set_loading(false);
                    setMessage([data.data_edited])
                    return
                }
                else {
                    throw new Error("Data not Added");
                }
            }

            throw new Error(data.message);

        } catch (error: any) {
            set_loading(false)
            console.error('An error occurred:', error.message);
            setMessage((p) => [...p, 'An error occurred:' + error.message]);
        }
    }


    return (

        <div className=" text-center p-2 md:p-8 rounded-lg h-full">

            <h1 className="flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
                <span className="bg-clip-text text-transparent bg-gradient-to-tl from-slate-300 to-gray-300 bg-lime-50 p-3 rounded-lg">
                    Edit Student
                </span>
            </h1>
            {
                Object.keys(Student_dataRows).length !== 0
                    ?
                    <>
                        <div className={` ${loading && 'opacity-50 pointer-events-none'} `}>



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
                                        {Object.entries(Student_dataRows).map(([id, value]) => (
                                            <tr key={id} id={`input-${id}`} className={`${student_deleteRows.hasOwnProperty(id) ? 'bg-red-200' : ''}`}>
                                                {Object.keys(value).map((key) => (
                                                    <td key={key} className={`px-4 py-2 ${student_deleteRows.hasOwnProperty(id) ? 'opacity-50 pointer-events-none' : ''}`}>
                                                        <input
                                                            maxLength={50}
                                                            id={`input-${id}-${key}`}
                                                            value={value[key]} // Use value[key] instead of row[key]
                                                            placeholder={`Enter ${key}`}
                                                            onChange={(e) =>
                                                                handleInputChange_Teacher(id, key, e.target.value)
                                                            }
                                                            className={`${Datarow_error_message.hasOwnProperty(id) && Datarow_error_message[id].hasOwnProperty(key) && Datarow_error_message[id][key] !== '' ? 'border-red-300 border-4' : Student_updatedRows.hasOwnProperty(id) && Student_updatedRows[id].hasOwnProperty(key) ? ' border-green-300 border-4' : ' focus:border-4 focus:border-blue-400 border'} rounded-xl font-bold  p-2 focus:outline-none  hover:bg-slate-100 hover:text-black`}
                                                        />
                                                        {Datarow_error_message.hasOwnProperty(id) && Datarow_error_message[id].hasOwnProperty(key) && Datarow_error_message[id][key] &&
                                                            Datarow_error_message[id][key].length !== 0 && <h5 className=''>{Datarow_error_message[id][key]}</h5>}
                                                    </td>
                                                ))}
                                                <td className="px-4 py-2">
                                                    <button
                                                        onClick={() => handleDeleteRow_student(id)}
                                                        className={`  rounded-lg px-4 font-bold py-2 focus:outline-none ${student_deleteRows.hasOwnProperty(id) !== true ? 'bg-red-500 text-white hover:bg-white hover:text-red-700 hover:border-red-700' : ' bg-white text-red-700 border-red-700'}`}
                                                    >
                                                        {!student_deleteRows.hasOwnProperty(id) ? 'Delete' : 'UnDelete'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>

                            </div>



                            <button
                                onClick={() => submitData(Student_dataRows, Student_updatedRows, student_deleteRows)}
                                className=" bg-gradient-to-t text-xl font-bold hover:bg-gradient-to-b from-red-400 to-blue-400  text-white px-4 py-2 rounded-lg">
                                Save
                            </button>
                        </div>
                        {loading &&
                            <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
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