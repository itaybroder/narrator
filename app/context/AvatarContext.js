"use client"
import { createContext, useContext, useState } from 'react';

export const AvatarContext = createContext();

export function AvatarProvider({ children }) {
  const [audio, setAudio] = useState(null);
  const [animation, setAnimation] = useState("Dance");
  const [isTalking, setIsTalking] = useState(false);

  return (
    <AvatarContext.Provider value={{ audio, setAudio, animation, setAnimation, isTalking, setIsTalking }}>
      {children}
    </AvatarContext.Provider>
  )
}

export const useAvatar = () => useContext(AvatarContext);
