import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

export const Take_Attendence = ({student_imgs_json}:any) => {
  const webcamRef = useRef<Webcam | null>(null);
  const [detecting, setDetecting] = useState(false);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<{ img: HTMLCanvasElement; id: string }[]>([]);
  const navigate = useNavigate();
 
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);

  useEffect(() => {
    const loadModels = async () => {
      // Load models from face-api.js
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      //parse json into object array
      let imgs = JSON.parse(student_imgs_json);     
      const labeledFaceDescriptors = imgs.map((item:{index:string,img:number[]}) => {      
          //console.log(new Float32Array(item.img));   
        return new faceapi.LabeledFaceDescriptors(item.index, [new Float32Array(item.img)]);
      });
        // Initialize the face matcher
      const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors);
      setFaceMatcher(matcher);
        //console.log(matcher);
      }
    
    setMessage('loading...');
    loadModels();
    setMessage('');
    
  }, []);

  const onDetect = async () => {
    if (webcamRef && webcamRef.current && webcamRef.current.getScreenshot()) {
      setMessage('Captured...');
      setDetecting(true);

      // Capture a frame from the webcam
      const image: any = webcamRef.current.getScreenshot();

      // Convert the image data to an HTMLImageElement
      const img = new Image() as HTMLImageElement;
      img.src = '/test.png';

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0 && faceMatcher !== null) {
        setMessage('Face-Detected');
        //recognize the face 
        const results = detections.map((detection) => {
          const bestmatch = faceMatcher.findBestMatch(detection.descriptor);
          //console.log(bestmatch.toString);
          return bestmatch;
        });

        // console.log(results);

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
      } else setMessage('Not Detected');

      setDetecting(false);
    }
  };

  return (
    <div>
      <div className={`relative`}>
        <Webcam
          className={`w-screen md:h-[calc(100vh-8px)]`}
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
          onClick={() => {
            onDetect();
          }}
        >
          Start
        </button>
        <button
          className={`${
            !detecting && 'hidden'
          }  bg-blue-500 hover.bg-blue-700 text-white font-bold py-2 px-4 rounded absolute bottom-4 left-1/2 transform -translate-x-1/2`}
          onClick={() => {
            // Handle stopping detection
          }}
        >
          Stop
        </button>
      </div>

      {detectedFaces.length > 0 && (
        <div className="face-container flex flex-wrap justify-center">
          {detectedFaces.map((face, index) => (
            <div key={index} className="">
              <img
                src={(face.img as HTMLCanvasElement).toDataURL()}
                alt={`Face ${index}`}
                className={`w-32 h-32 cursor-pointer`}
              />
              <h3>Roll No.: {face.id}</h3>
            </div>
          ))}
        </div>
      )}

      {detectedFaces.length !== 0 && !detecting && (
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto"
          // onClick={}
        >
          Send Face
        </button>
      )}

      {message !== '' && (
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 h-2" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
};

export default Take_Attendence;
