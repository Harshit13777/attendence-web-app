import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';
import { Set } from 'typescript';
import { arrayBuffer } from 'stream/consumers';

export const Take_Attendence = ({student_imgs_json}:any) => {
  const webcamRef = useRef<Webcam | null>(null);
  const imgref = useRef<HTMLImageElement | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<HTMLCanvasElement[]>([]);
  const navigate = useNavigate();
  const [interval_id,setIntervalid]=useState<NodeJS.Timer|null>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [RollNo,setRollNo]=useState<Set<string>>(new Set<string>());
 
  
  useEffect(() => {
    const loadModels = async () => {
      // Load models from face-api.js
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
      //parse json into object array
     
        const json=sessionStorage.getItem('student_imgs_json');
        if (!json){console.log('not json');return}
      let imgs = JSON.parse(json);     
      const labeledFaceDescriptors = imgs.map((item:{label:number,descriptor:number[]}) => {      
          //console.log(new Float32Array(item.img));   
        return new faceapi.LabeledFaceDescriptors(item.label+'', [new Float32Array(item.descriptor)]);
      });
        // Initialize the face matcher
      const matcher = new faceapi.FaceMatcher(labeledFaceDescriptors,.5);
      setFaceMatcher(matcher);
      //console.log(matcher);
    
    console.log(faceMatcher);
    
    }
      
    setMessage('loading...');
    loadModels();
    setMessage('');
    
  }, []);

  const onDetect = async () => {

    if (webcamRef.current && webcamRef.current.getScreenshot() && faceMatcher && imgref.current) {
      setMessage('captured');
      

      // Capture a frame from the webcam
      const image: any = webcamRef.current.getScreenshot();

      // Convert the image data to an HTMLImageElement
      const img = new Image() as HTMLImageElement;
      img.src = image;
      

      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0 && faceMatcher !== null) {
        //draw img on canvas
        setMessage('Detected');
        
        const labels=detections.map((detection) => {
          const bestmatch = faceMatcher.findBestMatch(detection.descriptor);
          
          return bestmatch.label;
        });

        labels.filter((label)=>label!=='unknown').map((label)=>RollNo?.add(label));
      
        drawLandmark(img,detections,labels);
          
        
        
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
      
      
    }
    setMessage('Recapturing..')
  };

  const drawLandmark=(img:HTMLImageElement,detections:faceapi.WithFaceDescriptor<faceapi.WithFaceLandmarks<{detection: faceapi.FaceDetection;}, faceapi.FaceLandmarks68>>[],labels:string[])=>{
    const displaySize = { width: img.width, height: img.height }
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d') as CanvasRenderingContext2D;
    faceapi.matchDimensions(canvas, displaySize);
    context?.drawImage(img,0,0,img.width,img.height);
        
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
      context.font = '16px Arial';
      context.fillStyle = 'white';
      context.fillText(label, box.x, box.y - 5); // Adjust label position
    });
    setDetectedFaces((prev)=>[...prev,canvas]);
    if(imgref.current)
      imgref.current.src=canvas.toDataURL();

  }

  const start=()=>{
    const id = setInterval(()=>{
      if(webcamRef.current){
        onDetect();
      }
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
  
 
  
  return (
    <div>
      {message !== '' && (
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4 h-2" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}
      <div className={`relative`}>
        { interval_id!==null &&
        <>
          <Webcam
          className={`w-screen md:h-screen opacity-25`}
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          // Adjust the 50 to your desired heading height
          />

          <img
            ref={imgref}  
            className={`w-screen md:h-screen absolute top-0`}
          />
      
        </>
        }

        <button
          className={`${
            interval_id!==null && 'hidden'
          }  bg-blue-500 hover:bg-blue-700 text-white font-bold mx-auto my-auto py-2 px-4 rounded`}
          onClick={() => {
            start()
          }}
        >
          Start
        </button>
        <button
          className={`${
            !interval_id && 'hidden'
          }  bg-blue-500 hover.bg-blue-700 text-white font-bold py-2 px-4 rounded `}
          onClick={() => {
            stopInterval()
          }}
        >
          Stop
        </button>
      </div>

      {interval_id===null && RollNo.size!==0 && (  
       <>
        <div className="p-6 bg-white shadow-md">
        <h2 className="text-3xl font-semibold mb-6">Students</h2>
        { Array.from(RollNo as any).map((id, index) => (
          <li key={index} className="mb-3">
            <h3>{id as any}</h3>
          </li>
        ))}


        </div>
        
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto"
          // onClick={}
        >
          Send Face
        </button>

        <Slideshow images={detectedFaces}/>

          </>
          )}

    </div>
  );
};

interface SlideshowProps {
  images: HTMLCanvasElement[];
}

const Slideshow :React.FC<SlideshowProps>= ( {images} ) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [interval_id,setIntervalid]=useState<NodeJS.Timer|null>(null);
 
  


  return (
    <div>
      <div style={{ width: '100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
        {images.map((canvas, index) => (
          <div key={index} style={{ display: 'inline-block', marginRight: '10px' }}>
            <img
              src={canvas.toDataURL()}
              alt={`Face ${index}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Take_Attendence;