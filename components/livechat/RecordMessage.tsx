"use client"
import React, { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
interface IProps {
    handleStop: any;
    handleStart?: any;
    disabled?: boolean;
};
let ReactMediaRecorder: any;

const Recorder:FC<IProps> = ({ handleStop, handleStart, disabled }: IProps) => {
        const [loaded, setLoaded] = useState(false);

      useEffect(() => {
        // Request microphone permission
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                // You can use the stream here if needed
                stream.getTracks().forEach(track => track.stop()); // Stop the stream as we just want to request permission
            })
            .catch(err => {
                // Handle error here. This will be triggered if the user denies permission
                console.error(err);
            });

        import("react-media-recorder").then((module) => {
            ReactMediaRecorder = module.ReactMediaRecorder;
            setLoaded(true);
        });
    }, []);
if (!loaded) {
        return null; // or a loading spinner
    }
    return(
        <div>
            <ReactMediaRecorder
                audio
                onStop={handleStop}
                onStart={handleStart}
                render={({ status, startRecording, stopRecording, mediaBlobUrl }: any) => (
                    <div className="mt-2 flex flex-col justify-center items-center">  
                        <Button className="rounded-full record text-white h-20 w-20 flex justify-center center hover:text-black bg-black hover:bg-white "
                        onMouseDown={startRecording}
                        onMouseUp={stopRecording}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            startRecording();
                        }}
                        onTouchEnd={(e) => {
                            e.preventDefault();
                            stopRecording();
                        }}
                        onTouchMove={(e) => {
                            e.preventDefault();
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                        }}
                        disabled={disabled}
                        style={{borderRadius: '50%', userSelect: 'none', }}
                        >
                        <Image
                         src="/icons/carrot.png" 
                         alt="" 
                         height={256}
                          draggable={false}   
                          style={{userSelect: 'none', pointerEvents: 'none'}}
                        onContextMenu={(e) => e.preventDefault()}
                          width={256} className="h-10 w-10 unselectable-image"   />
                        </Button>
                        <p className="mt-2 text-black font-light">{status}</p>
                    </div>
                )}
            />
        </div>
    )
};

export default Recorder;