import { SetStateAction, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { get_api } from "../static_api";
import { motion } from "framer-motion";


export const Attendance_show = () => {

    const navigate = useNavigate()
    const [loading, set_loading] = useState(false);
    const [message, set_message] = useState('')
    const [subject_sheetData_obj, set_subject_sheetData_obj] = useState<{ [key: string]: { [key: string]: number } } | null>(null)

    const get_student_attendance_status = async () => {
        try {
            const token = sessionStorage.getItem('token');
            if (!token) {
                sessionStorage.clear();
                setTimeout(() =>
                    navigate('/login')
                    , 5000);
                throw new Error('Error : No Token Found')
            }

            const response = await fetch(`${get_api().student_api}?page=student&action=get_student_attendance`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify({
                    token
                }),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok')
            }

            const data = await response.json();


            if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
                setTimeout(() => {
                    navigate('/sheet invalid')
                }, 2000);
                throw new Error("Sheet Invalid: Contact to Admin");
            }


            if (data.hasOwnProperty('Attendance_data')) {
                set_subject_sheetData_obj(data.Attendance_data)
            }
            //else
            if (data.hasOwnProperty('message')) {
                throw new Error(data.message)
            }
            set_loading(false)
        } catch (error: any) {

            set_message(error.message)
            set_message(error.message);
            console.error(error);
        }
    };




    useEffect(() => {

        get_student_attendance_status()
        const subject = {

            Algorithms: {
                "2023-01-01": 1,
                "2023-01-03": 1,
                "2023-02-05": 0,
                "2023-01-07": 1,
                "2023-02-10": 1,
                "2023-03-12": 0,
            },
            datastructure: {
                "2023-01-01": 0,
                "2023-01-03": 1,
                "2023-02-05": 0,
                "2023-01-07": 1,
                "2023-02-10": 1,
                "2023-03-12": 0,
            },
            datascience: {
                "2023-01-01": 0,
                "2023-01-03": 1,
                "2023-02-05": 0,
                "2023-01-07": 1,
                "2023-02-10": 1,
                "2023-03-12": 0,
            }
        };
    }, [])
    return (
        <div>
            <div className={` relative ${loading && 'opacity-50 pointer-events-none'} `}>
                <div>
                    {
                        subject_sheetData_obj
                            ?
                            <AttendanceTable data={subject_sheetData_obj} />
                            :
                            <div className="flex flex-col items-center justify-center h-20 mt-10 pb-2 ">
                                <h1 className="text-4xl font-bold text-gray-900">
                                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
                                        {loading ? 'Loading...' : 'Error'}
                                    </span>
                                </h1>
                            </div>
                    }
                </div>
            </div>
            {loading &&
                <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
            }
            {message !== '' && (
                <div className="bg-blue-100 w-screen border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
                    <p className="text-xl font-bold">{message}</p>
                </div>
            )}
        </div>
    )
}


type AttendanceTableProps = {
    data: { [key: string]: { [key: string]: number } };
};

type Subject =
    {
        [key: string]: {
            months: {
                [key: number]: {
                    date: Date[];
                    attend: number;
                    mark: number[];
                },
            }
            Total_lectures: number;
            Total_attend: number;
        }
    }

const AttendanceTable: React.FC<AttendanceTableProps> = ({ data }) => {
    // Extract the subject names and convert the date properties to Date objects
    const [subjects, set_subjects] = useState<Subject>({});

    useEffect(() => {
        const subject_cal: Subject = {}
        //selecting each subject
        Object.entries(data).forEach(([subjectName, obj]) => {
            let Total_lectures = 0
            let Total_attend = 0

            const months: { [key: string]: { date: Date[], attend: number, mark: number[] } } = {}
            Object.entries(obj).map(([datestr, mark]) => {
                const date = new Date(datestr)
                const month = date.toLocaleString('default', { month: 'long' })
                const obj: { date: Date[], attend: number, mark: number[] } = months[month] ?? { date: [], attend: 0, mark: [] }
                obj.date.push(date)
                obj.attend += mark ? 1 : 0
                obj.mark.push(mark)
                months[month] = obj
            })
            Object.values(months).map((obj) => (Total_lectures += obj.date.length))
            Object.values(months).map((obj) => (Total_attend += obj.attend))
            subject_cal[subjectName] = { months, Total_lectures, Total_attend }
        });

        set_subjects(subject_cal)
        console.log('subjects=', subjects)

    }, [])
    // Initialize state for the selected subject and attendance table data
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    // Handle subject selection change
    const handleSubjectChange = (subject: string) => {
        setSelectedSubject(subject);
    };

    // Render the subject selection dropdown
    const subjectOptions = Object.keys(subjects).map(subject => (
        <option key={subject} value={subject} className="md:text-lg font-semibold text-center rounded-md bg-gradient-to-r from-blue-300 to-red-200">
            {subject}
        </option>
    ));



    // Render the component
    return (
        <div className="p-4">

            <div className=' flex justify-center  text-center space-x-1 space-y-1'>

                <select id="subject-select" onChange={e => handleSubjectChange(e.target.value)} className=" p-2 rounded-lg border-2 border-blue-950 font-semibold text-center md:text-lg">
                    <option value="" className="md:text-lg font-medium text-center rounded-md bg-gradient-to-r from-blue-300 to-red-200">-- Select subject --</option>
                    <option value="ALL" className="md:text-lg font-medium text-center rounded-md bg-gradient-to-r from-blue-300 to-red-200">ALL</option>
                    {subjectOptions}
                </select>
            </div>
            {
                Object.entries(subjects).map(([subName, obj]) => (

                    <>
                        {(selectedSubject == 'ALL' || selectedSubject === subName) &&
                            <motion.div
                                initial={{ opacity: 1, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{
                                    delay: 0.3,
                                    duration: 0.8,
                                    ease: "easeInOut",
                                }}
                                className=""
                            >
                                <>
                                    <h2 className="text-2xl font-bold mt-6 text-center text-gray-200">{subName}</h2>
                                    <div className=" mt-6 overflow-x-auto   mb-4  bg-gradient-to-r from-blue-300 to-red-200 border-r-2 border-l-2 border-b-8 border-t-2  border-blue-400 rounded-xl  p-2">
                                        <table className="w-full text-sm md:text-md text-center ">
                                            <thead className=" text-gray-700 uppercase">
                                                <tr>
                                                    <th scope="col" className="px-6 py-3">
                                                        Month
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Lectures Held
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Classes Taken
                                                    </th>
                                                    <th scope="col" className="px-6 py-3">
                                                        Attendance %
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(obj.months).map(([month, obj], index) => (
                                                    <>
                                                        <tr key={index} className=" border-b ">
                                                            <td className="px-6 py-4">{month}</td>
                                                            <td className="px-6 py-4">{obj.date.length}</td>
                                                            <td className="px-6 py-4">{obj.attend}</td>
                                                            <td className="px-6 py-4">{Math.round(obj.attend / obj.date.length * 100)}%</td>
                                                        </tr>
                                                    </>
                                                ))}
                                                <tr className="">
                                                    <td className="px-6 py-4 font-semibold">Total</td>
                                                    <td className="px-6 py-4">{obj.Total_lectures}</td>
                                                    <td className="px-6 py-4">{obj.Total_attend}</td>
                                                    <td className="px-6 py-4">{Math.round(obj.Total_attend / obj.Total_lectures * 100)}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </>
                            </motion.div>
                        }
                    </>

                ))
            }
        </div >
    );
};