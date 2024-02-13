"use client"
import React, { useEffect, useState } from 'react';

let SpeechRecognition;
let recognition;

if (typeof window !== "undefined") {
  SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'he-IL';
}

const SpeechListener = () => {
  const [isListening, setIsListening] = useState(false);
  const [detectedWord, setDetectedWord] = useState('');

  useEffect(() => {
    if (!recognition) return;

    let active = false; // Local variable to track the active state

    const startRecognition = () => {
      if (!active) { // Use the local variable instead of isListening
        try {
          recognition.start();
        } catch (error) {
          console.error('Error starting speech recognition:', error);
        }
        setIsListening(true);
        active = true; // Update the local variable
        console.log('Voice recognition started. Speak into the microphone.');
      }
    };

    recognition.onstart = () => {
      setIsListening(true);
      active = true; // Ensure the local variable is updated
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript.trim();
      console.log('Detected:', text);
        setDetectedWord(text);
        
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
      active = false; // Update the local variable
    };

    recognition.onend = () => {
      console.log('Voice recognition stopped.');
      setIsListening(false);
      active = false; // Update the local variable
      startRecognition(); // Attempt to restart recognition
    };

    startRecognition();

    return () => {
      if (recognition) {
        recognition.stop();
      }
      active = false; // Ensure the local variable is reset
    };
  }, []); // Removed isListening from dependency array as it's managed locally

  return (
    <div>
      <p>{isListening ? 'Listening...' : 'Stopped'}</p>
      <p>{detectedWord}</p>
    </div>
  );
};

export default SpeechListener;