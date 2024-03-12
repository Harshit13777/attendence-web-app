import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const HandlecheckSheetStatusTeacher = () => {

  const [message, setMessage] = useState('');
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();

  const [sheet_status, set_sheet_status] = useState('')

  const fetch_check_sheet_access = async () => {


    setloading(true);
    try {

      const token = sessionStorage.getItem('token')
      const selectedRole = sessionStorage.getItem('user')
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 200);
        throw new Error('Error : No Token Found')
      }
      const response = await fetch(`${sessionStorage.getItem(selectedRole === 'student' ? 'student_api' : 'teacher_api')}?page=student&action=get_sheet_status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({
          token
        }),
      });

      if (!response.ok) {
        setMessage('Network Error');
        throw new Error('Network Error');
      }

      const data = await response.json();

      if (data.hasOwnProperty('sheet_status')) {
        const status = data.sheet_status;
        if (status === 'Sheet_Not_Exist' || status === 'Exist_without_Access') {
          setMessage('Sheet Error : Contact to Admin')
        }
        else if (status === 'Exist_with_Access') {
          sessionStorage.setItem('sheet_exist', "Y");
          setTimeout(() => {
            navigate(`/${selectedRole}`)//teacher or student
          }, 200);
          setMessage('Loading...')
        }
      }
      else if (data.hasOwnProperty(message)) {
        setMessage(data.message)
      }
      else {
        setMessage('server error')
      }

      setloading(false);

    }
    catch (e: any) {
      setloading(false);

      console.log(e.message);
    }

  }

  useEffect(() => {
    fetch_check_sheet_access()
  }, [])

  return (<>
    <div>

      <div className="  text-center  flex flex-col justify-center items-center">
        {
          loading
            ?
            <div className="animate-spin  rounded-lg border-blue-500 border-solid border-8 h-10 w-10"></div>
            :
            <button
              className=" mt-2  hover:from-blue-800 hover:to-blue-400 from-blue-400 to-blue-800 md:shadow-xl bg-gradient-to-r text-white font-bold p-2   rounded-xl"
              onClick={fetch_check_sheet_access}
            >
              Check Sheet Aceess
            </button>

        }

      </div>
      {message !== '' && (
        <div className="bg-red-100 mt-16 border-t h-6 text-center border-b border-red-500 text-red-700 px-4 " role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  </>)
}
