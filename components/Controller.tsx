"use client";

import React, {  useState } from "react";
import Recorder from "@/components/livechat/RecordMessage";
import { useAvatar } from "@/app/context/AvatarContext";

interface AudioData {
  blob: Blob;
  sentence: string;
}

const Controller = () => {
  const { setAudio, setAnimation, isTalking, setIsTalking  } = useAvatar();
  const [disabled, setDisabled] = useState(false);
  const [currentSentence, setCurrentSentence] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stopAnswer, setStopAnswer] = useState(false); // Added state to handle stopping the answer

  const createBlobUrl = (data: any) => {
    let blob = new Blob([data], { type: "audio/mpeg" });
    const url = window.URL.createObjectURL(blob);
    return url;
  };

  const playTalkingAnimation = (audio:any) => {

    const animationsVariations = [
        ["TalkingOneHand","Idle", "Talking"],
        ["Talking", "Idle", "TalkingOneHand"],
        ["Idle", "TalkingOneHand", "Talking"],
        ["TalkingOneHand", "Talking", "Idle"]
    ];
    const randomIndex = Math.floor(Math.random() * animationsVariations.length);
    const animations = animationsVariations[randomIndex];
    let currentAnimationIndex = 0;
    audio.onloadedmetadata = () => {

        const animationInterval = audio.duration / animations.length;
        let nextAnimationChange = animationInterval; 

      audio.ontimeupdate = () => {
          if (audio.currentTime >= nextAnimationChange) {
              currentAnimationIndex++;
              if (currentAnimationIndex < animations.length) {
                  setAnimation(animations[currentAnimationIndex]);
                  nextAnimationChange += animationInterval;
              }
          }
      };
    }

    audio.onended = () => {
        setAnimation("Dance");
    };

   setAudio(audio);
   setAnimation(animations[currentAnimationIndex]);

};

  const handleStop = async (blobUrl: string) => {
     if (isLoading) {
    return; // If a request is already in progress, don't start a new one
  }
  setDisabled(true);
  setCurrentSentence("..."); // Set current sentence to "..." when waiting

  try {
    const res = await fetch(blobUrl);
    let blob = await res.blob();
    const formData = new FormData();
    formData.append("file", blob, "myFile.wav");

    const response = await fetch(`/api/talk`, {
      method: 'POST',
      body: formData,
    });
      setIsLoading(true); // Set isLoading to true when a request starts

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const buffer: AudioData[] = [];
    let isPlaying = false;

const playAudioFromBuffer = () => {
  if (buffer.length === 0 || stopAnswer) { // Stop playing if stopAnswer is true
    isPlaying = false;
    setAnimation("Idle");
    setDisabled(false);
    setIsTalking(false);
    setCurrentSentence("");
    setStopAnswer(false); // Reset stopAnswer state

    return;
  }

  isPlaying = true;
 const audioData = buffer.shift();
if (audioData) {
    const url = window.URL.createObjectURL(audioData.blob);
    const audio = new Audio(url);
    setCurrentSentence(audioData.sentence);
    setIsTalking(true);
    const animations = ["TalkingOneHand", "Talking", "Idle"]
    const randomIndex = Math.floor(Math.random() * animations.length);
console.log("Is audio playing?", !audio.paused);
    setAudio(audio);
    audio.onended = () => {
        playAudioFromBuffer();

    };
    audio.play();
  }

};

let accumulatedData = "";

const addToBuffer = async (chunk: Uint8Array) => {
  accumulatedData += new TextDecoder().decode(chunk);

  let data;
  try {
    data = JSON.parse(accumulatedData);
  } catch (err) {
    return;
  }

  accumulatedData = "";

  let smallBlob = new Blob([new Uint8Array(data.audio)], { type: "audio/mpeg" });
  let audioData: AudioData = { blob: smallBlob, sentence: data.sentence };
  buffer.push(audioData);
  console.log(`Received sentence: "${data.sentence}"`);

  if (!isPlaying) {
    playAudioFromBuffer();
  }
};

  if (response.body) {
    const reader = response.body.getReader();
    const readChunk = async () => {
      const { done, value } = await reader.read();
      if (done) {
        setIsLoading(false);

        return;
      }

      addToBuffer(value);
      readChunk();
    };

    readChunk();
  }

  setAnimation("Idle");
  setIsLoading(false);
  setIsTalking(false);
    setCurrentSentence("");
  } catch (err) {
    setDisabled(false);
    console.error(err);
    const audio = new Audio("/audios/demo/sorry.mp3");
    setAudio(audio);
    setAnimation("Idle")
    audio.onended = () => {
      setAnimation("Idle")
      setDisabled(false);
    }
  }
};
  return (
    <>
    <div className="flex flex-row justify-center" style={{zIndex:200}}>
    <Recorder handleStop={handleStop} disabled={disabled}/>
    </div>
       <div className="relative bottom-0 mx-auto left-0 right-0 text-center text-2xl font-semibold bg-black text-white opacity-90	 max-w-[600px]" >
        <p className="text-shadow-md">{currentSentence}</p>
     </div>
    </>
  )
}
export default Controller;