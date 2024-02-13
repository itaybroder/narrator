"use client"
import { Environment, OrbitControls } from "@react-three/drei";
import { Gezzer } from "./Gezzer";
export const Experience = () => {
  return (
    <>
      <OrbitControls />
      <Environment preset="forest" />
      <ambientLight intensity={0.1} />
      <Gezzer scale={3} position={[0, -3, 0]}  />
    </>
  );
};