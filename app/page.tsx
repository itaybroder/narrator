"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useRef } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/select"

type Camera = {
  deviceId: string;
  label: string;
};

const CameraSwitcher: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [flipVideo, setFlipVideo] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    async function getCameras() {
      await navigator.mediaDevices.getUserMedia({ video: true }); // Prompt for permission
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setCameras(videoDevices.map(device => ({ deviceId: device.deviceId, label: device.label || 'Camera' })));
      if (videoDevices.length > 0 && !currentCameraId) {
        setCurrentCameraId(videoDevices[0].deviceId);
      }
    }

    getCameras();
  }, []);

  useEffect(() => {
    async function switchCamera() {
      if (currentCameraId) {
        const newStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: { exact: currentCameraId } }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = newStream;
        }
      }
    }

    switchCamera();
  }, [currentCameraId]);

  const handleChangeCamera = (deviceId: string) => {
    setCurrentCameraId(deviceId);
  };

  const handleTakeScreenshot = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      if (context) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        if (flipVideo) {
          // Move to the center of the canvas
          context.translate(canvas.width / 2, canvas.height / 2);
          // Flip the canvas horizontally
          context.scale(-1, 1);
          // Move the image back to its original position
          context.translate(-canvas.width / 2, -canvas.height / 2);
        }
        // Draw the video frame to the canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        if (flipVideo) {
          // Reset the transformation matrix to the default state if flipVideo is true
          context.setTransform(1, 0, 0, 1, 0, 0);
        }
        
        const imageDataUrl = canvas.toDataURL('image/png');
        setScreenshots([...screenshots, imageDataUrl]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 max-w-md mx-auto">
      {flipVideo ? (
        <video className="transform scale-x-[-1] rounded-lg w-full" ref={videoRef} autoPlay playsInline muted />
      ) : (
        <video className="rounded-lg w-full" ref={videoRef} autoPlay playsInline muted />
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className='flex flex-row gap-2'>
      <Button onClick={handleTakeScreenshot} variant='destructive' className="w-full">Take Screenshot</Button>
      <Button onClick={()=>{setFlipVideo(!flipVideo)}} variant='outline' className="w-full flex justify-center items-center"><img src="icons/flip.png" alt="" className="h-6 w-6" /></Button>
      <Select value={currentCameraId} onValueChange={handleChangeCamera}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Camera" />
        </SelectTrigger>
        <SelectContent className="w-full">
          {cameras.map(camera => (
            <SelectItem key={camera.deviceId} value={camera.deviceId}>
              {camera.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      </div>
    
      <div className="space-y-2 w-full">
        {screenshots.slice().reverse().map((screenshot, index) => (
          <img key={index} src={screenshot} alt={`Screenshot ${screenshots.length - index}`} className="rounded-lg w-full" />
        ))}
      </div>
    </div>
  );
};

export default CameraSwitcher;
