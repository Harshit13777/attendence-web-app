import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';

export const Upload_Img: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const imgref = useRef<HTMLImageElement|null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<{ img: CanvasImageSource; descriptor: Float32Array }[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [save,setsave]=useState(false);
  const [i,seti]=useState(0);
  const [interval_id,setIntervalid]=useState<NodeJS.Timer|null>(null);
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

  const onDetect = async () => {
    if (webcamRef.current && webcamRef.current.getScreenshot() && imgref.current) {
      const image: any = webcamRef.current.getScreenshot();
      const img = new Image() as HTMLImageElement;
      img.src = image;
      
      

      if(save){
        
          seti((prev)=>prev+i);
          const detections = await faceapi
            .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks().withFaceDescriptors();
            
            
          
          if (detections.length > 0) {
          
            const canvasDescriptor = detections.map((detection) => ({
              img: drawResizedImage(img, detection.detection.box),
              descriptor: detection.descriptor,
            }));
            setDetectedFaces((prev) => [...prev, ...canvasDescriptor]);
          }
        
        
      }
      else{

        const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions());
        if (detections.length > 0) 
          drawLandmark(img,detections);
        else
          imgref.current.src=img.src
        
      } 
    }
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
  const drawLandmark=(img:HTMLImageElement,detections:faceapi.FaceDetection[])=>{
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const displaySize = { width: img.width, height: img.height }
    faceapi.matchDimensions(canvas, displaySize);
    context?.drawImage(img,0,0,img.width,img.height);
    
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    faceapi.draw.drawDetections(canvas, resizedDetections);
    if(imgref.current)
      imgref.current.src=canvas.toDataURL();
  }

  const start=()=>{
    const id = setInterval(()=>{
        onDetect();
      },2000);

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
    setTimeout(() => {
      start();
    }, 2500);
    
  },[webcamRef.current]);

  useEffect(()=>{
    if(detectedFaces.length===7)
      stopInterval();
  },[detectedFaces]);


  const handleSendImage = (selectedIndex: number) => {
    // Implement your logic to send the selected image here
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
              className={`face-box m-2`}
            >
              <img
                src={(obj.img as HTMLCanvasElement)?.toDataURL()}
                alt={`Face ${index}`}
                className={`w-32 h-32`}
              />
            </div>
          ))}
        </div>
  
        {selectedFaceIndex !== null && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto"
            onClick={() => handleSendImage(selectedFaceIndex)}
          >
            Send Face {selectedFaceIndex + 1}
          </button>
        )}


      <div className={` relative ${detectedFaces.length!<=5 && 'hidden'}`} >
        <Webcam
          className={`w-screen md:h-5/6 opacity-5`}
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
        />
        <div className={` absolute top-0`} >
          <img  ref={imgref}  alt="" 
          className={`w-screen md:h-5/6 `}/>
        </div>
        
      </div >
        
      

        <button
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold px-auto mx-auto`}
          onClick={()=>{setsave(true);stopInterval();start();setMessage('saving...')}}
          >
          Capture Photo
        </button>
        
    </div>
  );
};

export default Upload_Img;
