import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

export const Upload_Img= () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<{ img: CanvasImageSource; descriptor: Float32Array }[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [interval_id,setIntervalid]=useState<NodeJS.Timer|null>(null);
  const navigate=useNavigate();
  

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    setMessage('Loading...');
    loadModels();
    setMessage('Capture your img')
  }, []);

  const handleFaceSelect = (index: number) => {
    setSelectedFaceIndex(index);
  };

  const onDetect = async () => {
    if (webcamRef.current && webcamRef.current.getScreenshot() ) {
      const image: any = webcamRef.current.getScreenshot();
      const img = new Image() as HTMLImageElement;
      img.src = image;
      setMessage('detecting...')
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks().withFaceDescriptors();
                
      if (detections.length > 0) {
      setMessage('Detected');
        const canvasDescriptor = detections.map((detection) => ({
          img: drawResizedImage(img, detection.detection.box),
          descriptor: detection.descriptor,
        }));
        setDetectedFaces((prev) => [...prev, ...canvasDescriptor]);
      }
    }
    setMessage('Recapturing...')
  };


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
 
  const start=()=>{
    const id = setInterval(()=>{
        if(webcamRef.current)
        onDetect();
      },1000);

    setIntervalid(id);
    return()=>{
      if(interval_id!==null){
        clearInterval(interval_id);
      }
    }
  }

  const stopInterval = () => {
    if (interval_id !== null) {
      clearInterval(interval_id);
      setIntervalid(null);
    }
  };

  useEffect(() => {  
    if(webcamRef.current){

      setTimeout(() => {
        start();
      }, 2500);
    }
    else{
      setMessage('Choose your photo');
      stopInterval();
    }
  },[webcamRef.current])

  const handleSendImage = (selectedIndex: number) => {
    
    const email=sessionStorage.getItem('email');
    //if index not null and face is canvas element then img into data url and fetch
    if(selectedFaceIndex==null){
      return;
    }

    const student_img_data=Array.from(detectedFaces[selectedFaceIndex].descriptor);
    console.log(student_img_data);
        
        fetch(`${sessionStorage.getItem('api')}?page=student&action=upload_img`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({email,Admin_Sheet_Id:sessionStorage.getItem('Admin_Sheet_Id'),student_img_dataset:student_img_data}),
        })
          .then((response:any) => {
            if (!response.ok) {
              setMessage('Network error');
            }
            if(response.hasOwnProperty('error')){
              setMessage('Server error');
              console.log(response.error);
              return;
            }
            return response.json(); //convert json to object
          })
          .then((data) => {

            //handle sheet errror
            if(data.hasOwnProperty('sheet_access') && !data.sheet_access){
              setMessage(data.message);
              sessionStorage.removeItem('sheet_exist');//remove sheet exist from main if not valid
              navigate('/Student');
              return;
            }

            //if img is added
            if(data.hasOwnProperty('img_added')){
              setMessage(data.message);
              sessionStorage.removeItem('Upload_Img');
              setInterval(()=>{
                navigate('/Student');
              },1000);
              return;
            } 
            //else
            setMessage(data.message);

          
          });
    
  };

  return (
    <div >
      {message !== '' && (
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}
      
      <div className="face-container flex flex-wrap justify-center">
        {detectedFaces.map((obj, index) => (
          <div
            key={index}
            className={`face-box ${index === selectedFaceIndex ? 'selected' : ''} m-2`}
            onClick={() => handleFaceSelect(index)}
          >
            <img
              src={(obj.img as HTMLCanvasElement).toDataURL()}
              alt={`Face ${index}`}
              className={`w-32 h-32 cursor-pointer ${
                index === selectedFaceIndex ? 'border-4 border-blue-500' : ''
              }`}
            />
          </div>
        ))}
      </div>
  
        {selectedFaceIndex !== null && (
          <>
          <button
            className={`${message==='syncing...' && 'hidden'} fixed top-3/4  left-1/4 right-1/4   bg-blue-700 hover:bg-blue-300 hover:text-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto`}
            onClick={() => {setMessage('syncing...');handleSendImage(selectedFaceIndex)}}
          >
            Send Face {selectedFaceIndex + 1}
          </button>
          
          <div className={`${message==='syncing...' ?'': 'hidden'} flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="ml-4 text-xl text-gray-700">Loading...</div>
          </div>
            </>
        )}

      {
        detectedFaces.length<5 &&
      <div className={` relative `} >
        <Webcam
          className={`w-screen md:h-5/6 opacity-0`}
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          />        
      </div >
      }  
    </div>
  );
};

export default Upload_Img;
