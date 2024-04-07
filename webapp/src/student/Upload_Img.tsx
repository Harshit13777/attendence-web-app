import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { get_api } from '../static_api';

export const Upload_Img: React.FC<{ set_uploaded_img_status: React.Dispatch<React.SetStateAction<boolean>> }> = ({ set_uploaded_img_status }) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<{ img: CanvasImageSource; descriptor: Float32Array }[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [interval_id, setIntervalid] = useState<NodeJS.Timer | null>(null);
  const navigate = useNavigate();
  const [start_detecting, set_start_detecting] = useState(false)
  const detectedFaces_count = useRef(0)
  const [camera_visible, set_camera_visible] = useState(false)
  const [loading, set_loading] = useState(false);

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    setMessage('Loading...');
    loadModels().then(() => { set_camera_visible(true); setMessage('Detect your face'); handleStartDetecting() });
  }, []);

  const handleFaceSelect = (index: number) => {
    setSelectedFaceIndex(index);
  };


  //detection stop when detected faces count limit reached i.e. 5
  const onDetect = async () => {
    console.log('irun')
    if (webcamRef.current && webcamRef.current.getScreenshot()) {
      if (detectedFaces_count.current < 5) {
        const image: any = webcamRef.current.getScreenshot();
        const img = new Image() as HTMLImageElement;
        img.src = image;
        setMessage('detecting...')
        const detections = await faceapi
          .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks().withFaceDescriptors();

        console.log('getresults')
        if (detections.length > 0) {
          const canvasDescriptor = detections.filter((detection) => detection.detection.score > 0.9).map((detection) => ({
            img: drawResizedImage(img, detection.detection.box),
            descriptor: detection.descriptor,
          }));
          if (canvasDescriptor.length !== 0) {
            setMessage('Detected');
            setDetectedFaces((prev) => [...prev, ...canvasDescriptor]);
            console.log('Detected face', canvasDescriptor)
            detectedFaces_count.current = detectedFaces_count.current + 1;

          }
        }


        console.log('icall', 'total length', detectedFaces_count.current)
        onDetect();
      }

      else {
        set_camera_visible(false)
        set_start_detecting(false);
        console.log('istop')
      }
      console.log('igetout')

    };

  }


  const drawResizedImage = (img: HTMLImageElement, box: faceapi.Box) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 224;
    const height = 224;
    canvas.width = width;
    canvas.height = height;
    context?.drawImage(
      img,
      box.x,
      box.y,
      box.width,
      box.height,
      0,
      0,
      canvas.width,
      canvas.height
    );

    return canvas;
  };



  const handleStartDetecting = async () => {
    if (webcamRef.current && webcamRef.current.getScreenshot()) {
      setMessage('Start Detecting ...')
      set_start_detecting(true)
      await onDetect();
      setMessage('Detected Faces')
    }
    else {
      setMessage('Error:Camera Not Found /n Retry')
    }
  }


  const handle_Recapture = () => {
    set_camera_visible(true);
    detectedFaces_count.current = 0;
    setDetectedFaces([]);
    setSelectedFaceIndex(null)
    setTimeout(() => {
      handleStartDetecting();
    }, 3000);


  }

  const handleSendImage = async (selected_face: { img: CanvasImageSource; descriptor: Float32Array; }) => {
    set_loading(true);
    try {



      const token = sessionStorage.getItem('token');
      if (!token) {
        sessionStorage.clear();
        setTimeout(() =>
          navigate('/login')
          , 5000);
        throw new Error('Error : No Token Found')
      }

      const student_img_array = Array.from(selected_face.descriptor);
      console.log(student_img_array, student_img_array.length);

      const response = await fetch(`${get_api().student_api}?page=student&action=add_student_img`, {
        method: 'POST',

        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify({ student_img_array, token }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }


      const data = await response.json(); // convert json to object



      if (data.hasOwnProperty('sheet_invalid') || data.hasOwnProperty('sheet_Erased')) {
        sessionStorage.removeItem('sheet_exist')
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 500);
      }

      if (data.hasOwnProperty('Img_Added')) {
        set_uploaded_img_status(true);
      }
      else {
        setMessage(data.message);
      }

      set_loading(false);

    } catch (e: any) {
      set_loading(false)
      console.error('An error occurred:', e.message);
    }

  };

  return (
    <div >
      {message !== '' && (
        <div className="bg-blue-100 w-screen border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
          <p className="text-xl font-bold">{message}</p>
        </div>
      )}

      <div className={` relative ${loading && 'opacity-50 pointer-events-none'} `}>

        {!camera_visible && <h1 className=" m-5 flex text-center items-center justify-center text-2xl md:text-5xl font-extrabold text-gray-900 ">
          <span className="bg-clip-text text-transparent bg-gradient-to-tl from-slate-300 to-gray-300 bg-lime-50 p-3 rounded-lg">
            Choose your Face
          </span>
        </h1>
        }

        <div className=" face-container flex flex-wrap justify-center content-center">


          {detectedFaces.map((obj, index) => (
            <div
              key={index}
              className={`face-box ${index === selectedFaceIndex ? 'selected' : ''} m-2`}
              onClick={() => handleFaceSelect(index)}
            >
              <img
                src={(obj.img as HTMLCanvasElement).toDataURL()}
                alt={`Face ${index}`}
                className={`w-32 h-32 md:w-64 md:h-64 cursor-pointer ${index === selectedFaceIndex ? 'border-4 md:border-8 rounded-xl border-blue-500' : ''
                  }`}
              />
            </div>
          ))}
        </div>

        {selectedFaceIndex !== null && (
          <>
            <button
              className={`${message === 'syncing...' && 'hidden'} fixed top-3/4 left-1/3 right-1/3  bg-blue-700 hover:bg-blue-300 hover:text-blue-700  p-10  md:text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2`}
              onClick={() => { handleSendImage(detectedFaces[selectedFaceIndex]) }}
            >
              Send Face {selectedFaceIndex + 1}
            </button>

            <div className={`${message === 'syncing...' ? '' : 'hidden'} flex items-center justify-center`}>
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
              <div className="ml-4 text-xl text-gray-700">Loading...</div>
            </div>
          </>
        )}

        {
          camera_visible ?
            <div className={` relative`} >
              <Webcam
                className={`w-screen md:h-5/6 opacity-1`}
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
              />
              {!start_detecting && <button
                className={` fixed top-3/4 left-1/3 right-1/3  bg-blue-700 hover:bg-blue-300 hover:text-blue-700  p-10  md:text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2 `}
                onClick={() => handleStartDetecting()}
              >
                Detect my Face
              </button>}
            </div >
            :
            <button
              className={` fixed top-2/3 left-1/3 right-1/3  bg-blue-700 hover:bg-blue-300 hover:text-blue-700  p-10  md:text-2xl text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-lg px-5 py-2.5 text-center me-2 mb-2`}
              onClick={() => handle_Recapture()}
            >
              {detectedFaces.length !== 0 ? 'Recapture' : 'loading...'}
            </button>
        }

      </div>

      {loading &&
        <div className=" absolute top-1/2 left-1/2  ml-auto mr-auto  animate-spin rounded-xl border-blue-500 border-solid border-8 h-10 w-10"></div>
      }
    </div>
  );
};

export default Upload_Img;
