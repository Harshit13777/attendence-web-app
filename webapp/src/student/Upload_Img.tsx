import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate} from 'react-router-dom';
import { WithFaceDescriptor, WithFaceLandmarks, FaceLandmarks68, FaceDetection } from 'face-api.js';


export const Upload_Img: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<CanvasImageSource[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const navigate=useNavigate();
  const [imgdataset,set_imgdataset]=useState<WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection; }, FaceLandmarks68>>[]>([]);

  const handleFaceSelect = (index: number) => {
    setSelectedFaceIndex(index);
    setMessage(`${index}`);
  };
  
  useEffect(() => {
    const loadModels = async () => {
      // Load models from face-api.js
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      
    };
    
    setMessage('loading...');
    loadModels();
    setMessage('');
  }, []);
  
  const onDetect = async () => {
  
    if (webcamRef && webcamRef.current && webcamRef.current.getScreenshot()) {
      setMessage('Captured...');
      setDetecting(true);
      setDetectedFaces([]);
      set_imgdataset([]);
      setSelectedFaceIndex(null);
      
  
        // Capture a frame from the webcam
        const image:any = webcamRef.current.getScreenshot();
      
      // Convert the image data to an HTMLImageElement
      const img = new Image() as HTMLImageElement;
      img.src = image;
      //'/test.png';
      
      const detections = await faceapi
      .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptors();

      if (detections.length > 0) {
        setMessage('Detected');
        //set all img detection in imgdataset 
        set_imgdataset(detections as WithFaceDescriptor<WithFaceLandmarks<{ detection: FaceDetection; }, FaceLandmarks68>>[]);

        detections.forEach(async (detection, index) => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          const box = detection.detection.box;
          const x = box.x;
          const y = box.y;
          const width = box.width;
          const height = box.height;
          
          canvas.width = 224;
          canvas.height = 224;
          context?.drawImage(img, x, y, width, height, 0, 0, canvas.width, canvas.height);
          
          setDetectedFaces((prevDetectedFaces) => [...prevDetectedFaces, canvas]);
        });
      }
      else setMessage('Not Detected');
    }
    
    setDetecting(false);
  };

  const handle_send_img=()=>{
    const email=sessionStorage.getItem('email');
    //if index not null and face is canvas element then img into data url and fetch
    if(selectedFaceIndex==null){
      return;
    }
   
        
        fetch(`${sessionStorage.getItem('api')}?page=student&action=upload_img`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json',
          },
          body: JSON.stringify({email,Admin_Sheet_Id:sessionStorage.getItem('Admin_Sheet_Id'),student_img_dataset:imgdataset[selectedFaceIndex]}),
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
    }
 
  

  return (
    <div>
    
    {detectedFaces.length===0 && <div className={` relative `}>
      <Webcam
        className="w-screen md:h-screen"
        ref={webcamRef}
        audio={false}
        screenshotFormat="image/jpeg"
         // Adjust the 50 to your desired heading height
        
      />
      <h1 className="text-3xl text-black font-bold text-center mb-4 absolute top-2 left-1/2 transform -translate-x-1/2 bg-white rounded p-2">
            Face Detection
      </h1>
     <button
          className={`${
            detecting && 'hidden'
          }  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 left-1/2 transform -translate-x-1/2`}
          onClick={onDetect}
        >Capture
        </button>
    </div>
        }

       <p className={`text-center ${selectedFaceIndex===null && detectedFaces.length!==0  ? '' : 'hidden'}`}>select your image</p>
     
       <div className="face-container flex flex-wrap justify-center">
        {detectedFaces.map((face, index) => (
          <div
            key={index}
            className={`face-box ${index === selectedFaceIndex ? 'selected' : ''} m-2`}
            onClick={() => handleFaceSelect(index)}
          >
            <img
              src={(face as HTMLCanvasElement).toDataURL()}
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto"
          onClick={() => handle_send_img()}
          >
          Send Face 
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto"
          onClick={()=>{setDetectedFaces([]);setSelectedFaceIndex(null);setMessage('');}}
          >
          Recapture
        </button>

          </>
      )}
      {message!=='' && <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 py-3" role="alert">
      <p className="text-sm">{message}</p>
      </div>}
    </div>
  );
};

export default Upload_Img;
