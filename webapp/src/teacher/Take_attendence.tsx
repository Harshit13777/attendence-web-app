import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Link, useNavigate } from 'react-router-dom';
import { Set } from 'typescript';
import { arrayBuffer } from 'stream/consumers';
import { error } from 'console';
import { get_api } from '../static_api';

interface store_student_imgs {
  [key: string]: number[];
}

interface store_subjects {
  [key: string]: string;
}

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
  facingMode: FACING_MODE_USER
};


export const Take_Attendence = () => {

  const webcamRef = useRef<Webcam | null>(null);
  const imgref = useRef<HTMLImageElement | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<HTMLCanvasElement[]>([]);
  const navigate = useNavigate();
  const [interval_id, setIntervalid] = useState<NodeJS.Timer | null>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [RollNo, setRollNo] = useState<Set<String>>(new Set<String>());
  const [selectedSheet, setSelectedSheet] = useState<{ subject: string, sheet_name: string } | null>(null);
  const subject_sheet_obj = useRef<store_subjects | null>(null)
  const subject_names = useRef<string[] | null>(null);
  const [loading, setloading] = useState(false);
  const [selectedAttend, set_selectedAttend] = useState('');
  const student_imgs_key = sessionStorage.getItem('student_imgs_key') as string;
  const subject_names_key = sessionStorage.getItem('subject_names_key') as string;
  const start_detecting = useRef(false)

  const [facingMode, setFacingMode] = useState(FACING_MODE_USER);

  const handleswitch = () => {
    setFacingMode(
      prevState =>
        prevState === FACING_MODE_USER
          ? FACING_MODE_ENVIRONMENT
          : FACING_MODE_USER
    );
  };

  const handleSelectChange = (e: any) => {
    if (e.target.value === '') {
      setSelectedSheet(null);
      return;
    }
    if (subject_names && subject_sheet_obj.current) {
      const sheet_name = subject_sheet_obj.current[e.target.value];
      setSelectedSheet({ subject: e.target.value, sheet_name });

    }
  };

  const handleselectAttend = (e: any) => {
    set_selectedAttend(e.target.value);
  }


  useEffect(() => {//load modle in faceMatcher
    const loadModels = async () => {
      // Load models from face-api.js
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');

      //parse json into object array
      const json = localStorage.getItem(student_imgs_key)
      if (!json) { console.log('Student Img not found'); setMessage('Error:No Student Image Uploaded'); return }
      let student_id_imgs: store_student_imgs = JSON.parse(json);
      console.log(student_id_imgs)
      const labeledFaceDescriptors = Object.entries(student_id_imgs).map(([id, img]) => {
        //console.log(new Float32Array(item.img));   
        return new faceapi.LabeledFaceDescriptors(id + '', [new Float32Array(img)]);
      });
      // Initialize the face matcher
      const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors, .5);
      setFaceMatcher(matcher);
      //console.log(matcher);
      //testing
      //await dete()
      console.log('Face Matcher loaded');
      setMessage('')
    }
    setMessage('loading...');
    loadModels();

  }, []);




  useEffect(() => {//get subject names
    const subject_json = localStorage.getItem(subject_names_key)
    if (subject_json) {
      const subjects_obj: store_subjects = JSON.parse(subject_json);
      subject_sheet_obj.current = subjects_obj;
      subject_names.current = (Object.keys(subjects_obj))
      setMessage('Subjects Found')
    }
    else {
      setMessage('Error: No Subjects Found')
      setTimeout(() =>
        navigate('/teacher/add_subject')
        , 5000)
    }
  }, [])


  const onDetect = async () => {

    console.log('irun')
    if (webcamRef.current && webcamRef.current.getScreenshot() && faceMatcher && imgref.current) {

      // Capture a frame from the webcam
      const image: any = webcamRef.current.getScreenshot();

      // Convert the image data to an HTMLImageElement
      const img = new Image() as HTMLImageElement;
      img.src = image;
      setMessage('detecting')

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      console.log('getresults')
      if (detections.length > 0 && faceMatcher !== null) {
        //draw img on canvas

        const labels = detections.map((detection) => {
          const bestmatch = faceMatcher.findBestMatch(detection.descriptor);

          return bestmatch.label;
        });
        setMessage('Detected');
        console.log('Detected')
        labels.filter((label) => label !== 'unknown').map((label) => RollNo.add(label));

        drawLandmark(img, detections, labels);

        /* 
         results.forEach((bestMatch, i) => {
           setMessage('Face-Recognized');
           const canvas = document.createElement('canvas');
           const context = canvas.getContext('2d');
           const box = detections[i].detection.box;
           const x = box.x;
           const y = box.y;
           const width = box.width;
           const height = box.height;
 
           canvas.width = 224;
           canvas.height = 224;
           context?.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);
 
           let obj = { img: canvas, id: bestMatch.label };
 
           // Check if obj.id is not in detectedFaces before adding it
           if (!detectedFaces.some((face) => face.id === obj.id)) {
             setDetectedFaces((prevDetectedFaces) => {
               return [...prevDetectedFaces, obj];
             });
           }
         });*/
      }
      else {
        console.log('Not detected')
        setMessage('Not Detected')
      }


    }
    else {
      start_detecting.current = false;
      console.log('Close Scanning')
      setTimeout(() => setMessage('Error: No camera Found'), 3000)
      return;
    }

    if (start_detecting.current !== false) {
      setMessage('Recapturing..')
      console.log('recapturing')
      await onDetect();
    }
  };

  /*
    const dete = async () => {
  
      const data: {}[] = []
      for (let i = 1; i < 51; i++) {
        const element = i
        const image = require(`../.icons/images/${element}.jpg`)
        console.log(element)
  
  
  
        const img = new Image() as HTMLImageElement;
        img.src = image;
  
        const detections = await faceapi
          .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();
  
        if (detections.length > 0 && faceMatcher !== null) {
          //draw img on canvas
          setMessage('Detected');
  
          const labels = detections.map((detection) => {
            const bestmatch = faceMatcher.findBestMatch(detection.descriptor);
            data.push({ i, p: bestmatch.distance })
            return bestmatch.label;
          });
  
          labels.filter((label) => label !== 'unknown').map((label) => RollNo.add(label));
  
  
  
          drawLandmark(img, detections, labels);
  
  
  
          /*
           results.forEach((bestMatch, i) => {
             setMessage('Face-Recognized');
             const canvas = document.createElement('canvas');
             const context = canvas.getContext('2d');
             const box = detections[i].detection.box;
             const x = box.x;
             const y = box.y;
             const width = box.width;
             const height = box.height;
    
             canvas.width = 224;
             canvas.height = 224;
             context?.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);
    
             let obj = { img: canvas, id: bestMatch.label };
    
             // Check if obj.id is not in detectedFaces before adding it
             if (!detectedFaces.some((face) => face.id === obj.id)) {
               setDetectedFaces((prevDetectedFaces) => {
                 return [...prevDetectedFaces, obj];
               });
             }
           });
           //comments above
        }
  
  
        setMessage('Recapturing..')
      }
      await console.log(data);
      setMessage('Hello')
    }
  */


  const drawLandmark = (img: HTMLImageElement, detections: faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{ detection: faceapi.FaceDetection; }, faceapi.FaceLandmarks68>>[], labels: string[]) => {
    const displaySize = { width: img.width, height: img.height }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    faceapi.matchDimensions(canvas, displaySize);
    context?.drawImage(img, 0, 0, img.width, img.height);

    detections.forEach((detection, index) => {

      const label = labels[index];
      const box = detection.detection.box;

      // Draw the box
      context.strokeStyle = 'blue'; // You can set the desired box color
      context.lineWidth = 2;
      context.beginPath();
      context.rect(box.x, box.y, box.width, box.height);
      context.stroke();

      // Draw the label
      context.font = '30px Arial';
      context.fillStyle = 'red';
      context.fillText(label, box.x, box.y - 5); // Adjust label position
    });
    setDetectedFaces((prev) => [...prev, canvas]);
    if (imgref.current)
      imgref.current.src = canvas.toDataURL();

  }



  const handleStart = async () => {
    setMessage('Start')
    if (webcamRef.current && webcamRef.current.getScreenshot()) {
      setMessage('Start Detecting ...')
      if (imgref.current) imgref.current.src = ''
      start_detecting.current = true;
      setDetectedFaces([]);
      setTimeout(async () => {
        await onDetect()
        setMessage('Detected Faces')
      }, 5000);

    }
    else {
      setMessage('Error:Camera Not Found /n Retry')
    }
  }
  const handleStop = () => {
    start_detecting.current = false;
    setMessage('Stop Detecting')
  }

  const handlesenddata = async () => {
    handleStop()
    setloading(true);
    try {
      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }

      if (!selectedSheet) {
        setMessage('Select subject name')
        throw new Error('Select subject name');
      }

      if (RollNo.size === 0) {
        setMessage('Detect a Student')
        throw new Error('Detect a Student');
      }

      const rollarr: String[] = [];
      RollNo.forEach((roll) => rollarr.push(roll));




      const response = await fetch(`${get_api().teacher_api}?page=teacher&action=upload_attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ token, Roll_Numbers: rollarr, Subject: selectedSheet }),
      });

      if (!response.ok) {
        setMessage('Network Error')
        throw new Error('Network Error');
      }

      const data = await response.json();

      console.log(data)
      setMessage(data.message);

      if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
        sessionStorage.removeItem('sheet_exist')
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 500);
      }

      if (data.hasOwnProperty('attendance_added') && data.hasOwnProperty('Not_Rolls')) {
        const not_rolls: string[] = data.Not_Rolls;
        setMessage(data.attendance_added);

        if (not_rolls.length > 0) {
          setMessage(`These Rolls not exist- ${not_rolls}`)
        }
        setDetectedFaces([]);
        setSelectedSheet(null);
        setRollNo(new Set<String>());
      }

      setloading(false);
    } catch (error: any) {
      setloading(false);
      console.log(error.message);
    }
  };


  return (
    subject_names.current === null || subject_names.current.length == 0
      ?
      <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2 ">
        <h1 className="text-4xl font-bold text-gray-900">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
            No Subject Added
          </span>
        </h1>
      </div>
      :
      faceMatcher === null
        ?

        <div>
          <div className="flex flex-row text-center justify-center  bg-lime-50 p-5 m-5 ">
            <div className="mb-4 text-center">
              <h1 className="text-2xl font-bold  text-gray-900">Loading...</h1>
            </div>
          </div>
          {message !== '' && (
            <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
              <p className="text-xl font-bold">{message}</p>
            </div>
          )
          }
        </div>

        :

        <div className=' relative text-center p-2 md:p-8'>


          {message !== '' && (
            <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
              <p className="text-xl font-bold">{message}</p>
            </div>
          )}



          <div className={` relative ${loading && 'opacity-50 pointer-events-none'}  `}>


            <div className={`${!start_detecting.current && 'opacity-0'} relative text-center`}>
              <div className={`absolute z-30 right-0 left-full' ${facingMode !== FACING_MODE_USER && 'rotate-180'}`} onClick={handleswitch}>
                <img src={require('../.icons/switch_camera.png')}></img>
              </div>
              <Webcam
                videoConstraints={{
                  ...videoConstraints,
                  facingMode
                }}
                className={` w-screen md:h-5/6 opacity-50`}
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
              // Adjust the 50 to your desired heading height
              />

              <img
                ref={imgref}
                className={`w-screen md:h-5/6  top-0 absolute`}
              />
            </div>


            {RollNo.size !== 0 && (
              <div className={` text-center ${!start_detecting.current && 'absolute top-0 w-full'}`}>

                <div className="p-6">
                  <div className="flex flex-col gap-y-4 text-center items-center justify-center  bg-gradient-to-br from-blue-200 to-red-100 p-3 rounded-lg">
                    <h1 className=" text-xl md:text-4xl font-bold text-gray-900">
                      Captured Roll No

                    </h1>
                    <div className=' bg-gradient-to-r from-blue-300 to-red-200 p-3 pl-7 font-semibold rounded-lg'>
                      <ul className='flex flex-wrap gap-x-4 list-disc '>
                        {Array.from(RollNo as any).map((id, index) => (
                          <li className='pr-5' key={index}>
                            <h3>{id as any}</h3>
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>

                <div className=' bg-gradient-to-br from-blue-200 to-red-100 text-center flex flex-col items-center  p-3 mb-4 ml-2 mr-2 rounded-xl'>

                  <div className=' flex-row space-x-1 space-y-1'>

                    <select className=' p-2 rounded-lg border-2 border-blue-950 font-semibold text-center md:text-lg '
                      onChange={handleSelectChange} value={selectedSheet?.subject}>
                      <option className='md:text-lg font-medium text-center rounded-md bg-gradient-to-r from-blue-300 to-red-200' value="">Select Subject</option>
                      {subject_names.current.map((subject, index) => (
                        <option className='md:text-lg font-semibold text-center rounded-md bg-gradient-to-r from-blue-300 to-red-200' key={index} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>




                  <button
                    className=" mt-2  hover:from-blue-800 hover:to-blue-400 from-blue-400 to-blue-800 md:shadow-xl bg-gradient-to-r bg-origin-padding text-white font-bold p-2   rounded-xl"
                    onClick={handlesenddata}
                  >
                    Mark Attendance
                  </button>


                </div>

                <Slideshow images={detectedFaces} />

              </div>


            )}

            {
              !start_detecting.current ?


                <button
                  className={`${interval_id !== null && 'hidden'
                    } fixed top-3/4 left-1/3 right-1/3  bg-blue-700 hover:bg-blue-300 hover:text-blue-700  p-10  md:text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2`}
                  onClick={() => {
                    handleStart()
                  }}
                >
                  Start Scan
                </button>





                :
                <button
                  className={` fixed top-3/4 left-1/3 right-1/3  bg-blue-700 hover:bg-blue-300 hover:text-blue-700  p-10  md:text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2`}
                  onClick={() => {
                    handleStop()
                  }}
                >
                  Stop Scan
                </button>
            }

          </div>
          {loading &&
            <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
          }

        </div>
  );
};

interface SlideshowProps {
  images: HTMLCanvasElement[];
}

const Slideshow: React.FC<SlideshowProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interval_id, setIntervalid] = useState<NodeJS.Timer | null>(null);




  return (
    <div>
      <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {images.map((canvas, index) => (
          <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
            <img
              src={canvas.toDataURL()}
              className='md:w-96 md:h-96'
              alt={`Face ${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Take_Attendence;