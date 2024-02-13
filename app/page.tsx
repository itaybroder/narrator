"use client"
import { Button } from '@/components/ui/button';
import React, { useEffect, useState, useRef } from 'react';

type Camera = {
  deviceId: string;
  label: string;
};

const CameraSwitcher: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [currentCameraId, setCurrentCameraId] = useState<string | undefined>();
  const [screenshots, setScreenshots] = useState<string[]>([]);
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
  }, [currentCameraId]);

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
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageDataUrl = canvas.toDataURL('image/png');
        setScreenshots([...screenshots, imageDataUrl]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4">
      <video className="transform scale-x-[-1] rounded-lg" ref={videoRef} autoPlay playsInline muted />
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="flex space-x-2">
        {cameras.map(camera => (
          <Button key={camera.deviceId} onClick={() => handleChangeCamera(camera.deviceId)} >
            {camera.label}
          </Button>
        ))}
        <Button onClick={handleTakeScreenshot}>Take Screenshot</Button>
      </div>
      <div className="space-y-2">
        {screenshots.slice().reverse().map((screenshot, index) => (
          <img key={index} src={screenshot} alt={`Screenshot ${screenshots.length - index}`} className="rounded-lg transform scale-x-[-1]" />
        ))}
      </div>
    </div>
  );
};

export default CameraSwitcher;
