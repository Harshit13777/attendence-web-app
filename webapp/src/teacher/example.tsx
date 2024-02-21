import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import * as faceapi from 'face-api.js';
import { useNavigate } from 'react-router-dom';

export const Upload_Img = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const [message, setMessage] = useState('');
  const [detectedFaces, setDetectedFaces] = useState<{ img: CanvasImageSource; descriptor: Float32Array }[]>([]);
  const [selectedFaceIndex, setSelectedFaceIndex] = useState<number | null>(null);
  const [selectedFaces, setSelectedFaces] = useState<number[]>([]);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
  const navigate = useNavigate();

  const isSelected = (index: number) => selectedFaces.includes(index);

  const handleCheckboxChange = (index: number) => {
    if (isSelected(index)) {
      // Face is already selected, so deselect it
      setDetectedFaces(detectedFaces.filter((_, i) => i !== index));
      setSelectedFaces(selectedFaces.filter((i) => i !== index));
    } else {
      // Face is not selected, so select it
      setSelectedFaces([...selectedFaces, index]);
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.tinyFaceDetector.loadFromUri('/models');
      await faceapi.nets.faceLandmark68Net.loadFromUri('/models');
      await faceapi.nets.faceRecognitionNet.loadFromUri('/models');
    };
    setMessage('Loading...');
    loadModels().then(() => setMessage('Capture your img'));
  }, []);

  const handleFaceSelect = (index: number) => {
    setSelectedFaceIndex(index);
  };

  const onDetect = async () => {
    if (webcamRef.current && webcamRef.current.getScreenshot()) {
      const image: any = webcamRef.current.getScreenshot();
      const img = new Image() as HTMLImageElement;
      img.src = image;
      setMessage('Detecting...');
      const detections = await faceapi
        .detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        setMessage('Detected');
        const canvasDescriptor = detections
          .filter((detection) => detection.detection.score > 0.9 && detection.detection.classScore > 0.9)
          .map((detection) => ({
            img: drawResizedImage(img, detection.detection.box),
            descriptor: detection.descriptor,
          }));
        setDetectedFaces((prev) => [...prev, ...canvasDescriptor]);
      }
    }
    setMessage('Recapturing...');
  };

  const drawResizedImage = (img: HTMLImageElement, box: faceapi.Box) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const width = 224;
    const height = 224;
    canvas.width = width;
    canvas.height = height;
    context?.drawImage(img, box.x, box.y, box.width, box.height, 0, 0, canvas.width, canvas.height);

    return canvas;
  };

  const start = () => {
    const id = setInterval(() => {
      if (webcamRef.current) onDetect();
    }, 1000);

    setIntervalId(id);
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  };

  const stopInterval = () => {
    if (intervalId !== null) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  useEffect(() => {

    if (webcamRef.current) {
      setTimeout(() => {
        start();
      }, 10000);
    } else {
      setMessage('Choose your photo');
      stopInterval();
    }
  }, []);

  const handleSendImage = () => {
    const label = ['1'];

    const objs = selectedFaces.map((index, i) => {
      return { label: label[i], descriptor: Array.from(detectedFaces[index].descriptor) };
    });
    const json = JSON.stringify(objs);

    sessionStorage.setItem('Students_Dataset', json);
    setMessage('Done');
    console.log(json);
  };

  return (
    <div>
      {message !== '' && (
        <div className="bg-blue-100 border-t text-center border-b border-blue-500 text-blue-700 px-4" role="alert">
          <p className="text-sm">{message}</p>
        </div>
      )}

      <div className="face-container flex flex-wrap justify-center">
        {detectedFaces.map((obj, index) => (
          <div
            key={index}
            className={`face-box ${isSelected(index) ? 'selected' : ''} m-2`}
            onClick={() => handleFaceSelect(index)}
          >
            <input
              type="checkbox"
              checked={isSelected(index)}
              onChange={() => handleCheckboxChange(index)}
            />
            <img
              src={(obj.img as HTMLCanvasElement).toDataURL()}
              alt={`Face ${index}`}
              className={`w-32 h-32 cursor-pointer ${isSelected(index) ? 'border-4 border-blue-500' : ''
                }`}
            />
          </div>
        ))}
      </div>

      {selectedFaceIndex !== null && (
        <>
          <button
            className={`${message === 'syncing...' && 'hidden'
              } fixed top-3/4  left-1/4 right-1/4   bg-blue-700 hover:bg-blue-300 hover:text-blue-700 text-white font-bold py-2 px-4 rounded mt-4 block mx-auto`}
            onClick={() => {
              setMessage('Syncing...');
              handleSendImage();
            }}
          >
            Send Face {selectedFaceIndex + 1}
          </button>

          <div className={`${message === 'syncing...' ? '' : 'hidden'} flex items-center justify-center`}>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            <div className="ml-4 text-xl text-gray-700">Loading...</div>
          </div>
        </>
      )}

      {detectedFaces.length < 2 && (
        <div className={` relative `}>
          <Webcam
            className={`w-screen md:h-5/6 opacity-100`}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
          />
        </div>
      )}
    </div>
  );
};

export default Upload_Img;
