import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { Link, useNavigate } from 'react-router-dom';
import { Set } from 'typescript';
import { arrayBuffer } from 'stream/consumers';
import { error } from 'console';

export const Take_Attendence= () => {
  const webcamRef = useRef<Webcam | null>(null);
  const imgref = useRef<HTMLImageElement | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<HTMLCanvasElement[]>([]);
  const navigate = useNavigate();
  const [interval_id,setIntervalid]=useState<NodeJS.Timer|null>(null);
  const [faceMatcher, setFaceMatcher] = useState<faceapi.FaceMatcher | null>(null);
  const [RollNo,setRollNo]=useState<Set<String>>(new Set<String>());
  const [selectedSheet, setSelectedSheet] = useState<{subject:string,id:string}|null>(null);
  const [subject_names,set_subject_names]=useState<{[subject: string]: string;}|null>(null);
  const [loading,setloading]=useState(false);
  const [selectedAttend,set_selectedAttend]=useState('');

  const handleSelectChange = (e:any) => {
    if(e.target.value===''){
      setSelectedSheet(null);
      return;
    }
    if(subject_names ){
      const id=subject_names[e.target.value];
      setSelectedSheet({subject:e.target.value,id:id});
    }
  };

  const handleselectAttend=(e:any)=>{
    set_selectedAttend(e.target.value);
  }

  
  useEffect(() => {//load modle in faceMatcher
    const loadModels = async () => {
      // Load models from face-api.js
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    
      //parse json into object array
      const json=sessionStorage.getItem('Students_Dataset');
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


  useEffect(()=>{//get subject names
    const sheet_name_json=localStorage.getItem('Subject_Names')
    if(sheet_name_json){
          const sheet_arr=JSON.parse(sheet_name_json);
          set_subject_names(sheet_arr)
      }
    else
    setTimeout(()=>
      navigate('/teacher/add_subject')
    ,5000)
  },[])

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
        
        labels.filter((label)=>label!=='unknown').map((label)=>RollNo.add(label));
        
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
      context.font = '24px Arial';
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
  
 
  const handlesenddata = async () => {
    setloading(true);
  
    try {
      const email = sessionStorage.getItem('email');
      if (!selectedSheet) {
        setMessage('Select subject name')
        throw new Error('Select subject name');
      }
  
      if (RollNo.size === 0) {
        setMessage('Detect a Student')
        throw new Error('Detect a Student');
      }

      const rollarr:String[]=[];
      RollNo.forEach((roll)=>rollarr.push(roll));
  
  
  
      const response = await fetch(`${sessionStorage.getItem('api')}?page=teacher&action=upload_attendance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, Admin_Sheet_Id: sessionStorage.getItem('Admin_Sheet_Id'), Roll_Numbers: rollarr, Subject: selectedSheet,Column:selectedAttend }),
      });
  
      if (!response.ok) {
        setMessage('Network Error')
        throw new Error('Network Error');
      }
  
      const data = await response.json();
  
      if (data.hasOwnProperty('error')) {
        setMessage('Server Error')
        throw new Error('Server Error');
      }
  
      if (data.hasOwnProperty('sheet_invalid')) {
        sessionStorage.removeItem('sheet_exist');
        setMessage(data.message);
        setTimeout(() => {
          navigate('/sheet invalid')
        }, 5000);
        return;
      }
  
      if (data.hasOwnProperty('attendance_added')) {
        setDetectedFaces([]);
        setSelectedSheet(null);
        setRollNo(new Set<String>());
      }
      
      setloading(false);
      setMessage(data.message);
    } catch (error:any) {
      setloading(false);
      console.log(error.message);
    }
  };
  
  
  return (
    subject_names===null 
    ?
    <div className="flex flex-col items-center justify-center h-20 bg-lime-50 pb-2 ">
    <h1 className="text-4xl font-bold text-gray-900">
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
        No Subject Added
      </span>
    </h1>
    </div>
    :
      faceMatcher===null
      ?
      <div className="flex flex-row text-center justify-center  bg-lime-50 p-5 m-5 ">
          <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold  text-gray-900">No Data Found! contact to admin</h1>
          </div>
      </div>
        
      :

      <div className=' text-center flex flex-col '>


      {message !== '' && (
        <div className="bg-red-100 border-t h-6 text-center border-b border-red-500 text-red-700 px-4 " role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}

      
        
      
      
      <div className={`relative text-center`}>
        { interval_id!==null &&
        <>
          <Webcam
          className={` w-full  md:h-screen  opacity-80`}
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          // Adjust the 50 to your desired heading height
          />

          <img
            ref={imgref}  
            className={` w-full   md:h-screen  md:top-0 md:absolute`}
          />
      
        </>
        }
        
      </div>

      {interval_id===null && RollNo.size!==0 && (  
      <div className=' text-center flex flex-col'>

        <div className="p-6 bg-white text-center shadow-md">
          <div className="flex text-center items-center justify-center bg-lime-100 p-3 rounded-lg">
            <h1 className=" text-xl md:text-4xl font-bold text-gray-900">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-red-950">
              Captured Roll No
            </span>
            </h1>
          </div>
          <div className='flex flex-row  bg-lime-50 p-3  rounded-lg'>

            { Array.from(RollNo as any).map((id, index) => (
            `${index+1}. ${id}` as any
            ))}
          </div>
        
        </div>
        
        <div className=' text-center flex flex-col items-center   bg-lime-50 p-3 mb-4 ml-2 mr-2 rounded-xl'>
          
          <div className=' flex-row space-x-1 space-y-1 '>

            <select className=' p-2 rounded-md border-4 border-blue-950 font-semibold text-center md:text-lg '
            onChange={handleSelectChange} value={selectedSheet?.subject}>
            <option className='md:text-lg font-medium'  value="">Select Subject</option>
            {Object.entries(subject_names).map(([sheetName,id], index) => (
              <option className='md:text-lg font-semibold' key={index} value={sheetName}>
                {sheetName}
              </option>
            ))}
            </select>

            <select className=' p-2 rounded-md border-4 border-blue-950 font-semibold text-center md:text-lg '
            onChange={handleselectAttend} value={selectedAttend}>
            
              <option className='md:text-lg font-semibold' key={0} value='New'>
                  New Column
              </option>
              <option className='md:text-lg font-semibold' key={1} value='Previous'>
                  Previous Column
              </option>
          
            </select>

          </div>

        
        

            {
              loading
              ?
              <div className="animate-spin rounded-xl border-blue-500 border-solid  border-8 h-10 w-10 mt-2 "></div>
              :
              <button
          className=" mt-2  hover:from-blue-800 hover:to-blue-400 from-blue-400 to-blue-800 md:shadow-xl bg-gradient-to-r bg-origin-padding text-white font-bold p-2   rounded-xl"
          onClick={handlesenddata}
          >
          Mark Attendance
              </button>
            }

          </div>
       
        <Slideshow images={detectedFaces}/>

      </div>

      
      )}
        

        <button
          className={`${
            interval_id!==null && 'hidden'
          } md:text-3xl hover:from-blue-800 hover:to-blue-400 absolute left-1/2 top-3/4 from-blue-800 to-blue-400 md:shadow-xl bg-gradient-to-r  shadow-md hover:bg-blue-700 text-white font-bold p-2  rounded-xl `}
          onClick={() => {
            start()
          }}
          >
          Start Scan
        </button>
        <button
          className={`${
            !interval_id && 'hidden'
          }   md:text-3xl hover:from-blue-800 hover:to-blue-400 absolute left-1/2 top-3/4 from-blue-800 to-blue-400 md:shadow-xl bg-gradient-to-r  shadow-md hover:bg-blue-700 text-white font-bold p-2  rounded-xl `}
          onClick={() => {
            stopInterval()
          }}
          >
          Stop Scan
        </button>
    


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
      <div  style={{ width:'100%', overflowX: 'auto', whiteSpace: 'nowrap' }}>
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