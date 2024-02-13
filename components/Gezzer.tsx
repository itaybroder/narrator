

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useAnimations, useFBX, useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    cp_low: THREE.SkinnedMesh;
    polySurface2: THREE.SkinnedMesh;
    polySurface3: THREE.SkinnedMesh;
    polySurface7: THREE.SkinnedMesh;
    chest: THREE.Bone;
  };
  materials: {
    body: THREE.MeshStandardMaterial;
    eye: THREE.MeshStandardMaterial;
  };
};

const lerp = (start: number, end: number, t: number) => {
  return start * (1 - t) + end * t;
};

const blink = (nodes: any, duration: number) => {
  let start = Date.now();
  let from = nodes.polySurface7.morphTargetInfluences[0];
  let to = 0.7;

  const step = () => {
    let currentTime = Date.now();
    let elapsed = (currentTime - start) / duration;

    if (elapsed > 1) elapsed = 1;

    nodes.polySurface7.morphTargetInfluences[0] = lerp(from, to, elapsed);

    if (elapsed < 1) requestAnimationFrame(step);
    else {
      to = 0;
      from = nodes.polySurface7.morphTargetInfluences[0];
      start = Date.now();

      const stepBack = () => {
        let currentTime = Date.now();
        let elapsed = (currentTime - start) / duration;

        if (elapsed > 1) elapsed = 1;

        nodes.polySurface7.morphTargetInfluences[0] = lerp(from, to, elapsed);

        if (elapsed < 1) requestAnimationFrame(stepBack);
      };

      setTimeout(stepBack, 200); // delay before opening the eyes
    }
  };

  step();
};

const talk = (nodes: any, duration: number) => {
  let start = Date.now();
  let from = 0;
  let to = 0.4; // Reduce this value to make the mouth open less wide

  const step = () => {
    let currentTime = Date.now();
    let elapsed = (currentTime - start) / duration;

    if (elapsed > 1) elapsed = 1;

    let value = lerp(from, to, elapsed);
    nodes.polySurface7.morphTargetInfluences[1] = value; // open mouth
    nodes.polySurface7.morphTargetInfluences[2] = value; // open mouth

    if (elapsed < 1) requestAnimationFrame(step);
    else {
      to = 0;
      from = nodes.polySurface7.morphTargetInfluences[1];
      start = Date.now();

      const stepBack = () => {
        let currentTime = Date.now();
        let elapsed = (currentTime - start) / duration;

        if (elapsed > 1) elapsed = 1;

        let value = lerp(from, to, elapsed);
        nodes.polySurface7.morphTargetInfluences[1] = value; // close mouth
        nodes.polySurface7.morphTargetInfluences[2] = value; // close mouth

        if (elapsed < 1) requestAnimationFrame(stepBack);
      };

      setTimeout(stepBack, 200); // delay before closing the mouth
    }
  };

  step();
};

export function Gezzer(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials, animations } = useGLTF("models/gezzer.glb") as GLTFResult;
  const [isTalking, setIsTalking] = useState(false);
  useEffect(() => {
    materials.body.transparent = false;
    materials.body.depthTest = true;
    materials.eye.transparent = false;
    materials.eye.depthTest = true;
    materials.eye.depthWrite = true;
    materials.body.depthWrite = true;
    
  }, [materials.body, materials.eye])
  const [animation, setAnimation] = useState("RumbaDancing");
  
  const animationRef = useRef<THREE.Group>(null);  


  const { actions } = useAnimations(
    animations,
    animationRef
  );


  useEffect(() => {
    actions[animation]?.reset().fadeIn(0.5).play();

    return () => {
      actions[animation]?.fadeOut(0.5);
    }
  }, [animation, actions]);


  useEffect(() => {
    if (isTalking) {
      const talkInterval = setInterval(() => {
        talk(nodes, Math.random() * 100 + 200); 
      }, Math.random() * 100 + 200);

      // Clear the interval when the component is unmounted
      return () => {
        clearInterval(talkInterval);
      };
    }
  }, [nodes, isTalking]); 

  useEffect(() => {
 
    const blinkInterval = setInterval(() => {
      blink(nodes, Math.random() * 100 + 200); // Blink duration between 200 and 700 ms
    }, Math.random() * 3000 + 2000); // Blink at random intervals between 2 and 7 seconds

    // Clear the interval when the component is unmounted
    return () => {
      clearInterval(blinkInterval);
    };
  
  }, [nodes]);
  return (
    <group {...props} dispose={null} ref={animationRef}>
      <group name="Scene">
        <group name="Armature" userData={{ name: "Armature" }}>
          <group
            name="carrotman"
            position={[0, 0.86621, 0.01882]}
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "carrotman" }}
          />
          <skinnedMesh
            name="cp_low"
            geometry={nodes.cp_low.geometry}
            material={materials.body}
            skeleton={nodes.cp_low.skeleton}
            userData={{ name: "cp_low" }}
          />
          <group
            name="group2"
            position={[-1.72989, 0, 0]}
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "group2" }}
          />
          <group
            name="group3"
            position={[-3.22071, 0, 0]}
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "group3" }}
          />
          <group
            name="group4"
            position={[-4.53525, 0, 0]}
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "group4" }}
          />
          <group
            name="group5"
            position={[1.85036, 0, 0]}
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "group5" }}
          />
          <skinnedMesh
            name="polySurface2"
            geometry={nodes.polySurface2.geometry}
            material={materials.eye}
            skeleton={nodes.polySurface2.skeleton}
            userData={{ name: "polySurface2" }}
          />
          <skinnedMesh
            name="polySurface3"
            geometry={nodes.polySurface3.geometry}
            material={materials.eye}
            skeleton={nodes.polySurface3.skeleton}
            userData={{ name: "polySurface3" }}
          />
          <skinnedMesh
            name="polySurface7"
            geometry={nodes.polySurface7.geometry}
            material={materials.body}
            skeleton={nodes.polySurface7.skeleton}
            morphTargetDictionary={nodes.polySurface7.morphTargetDictionary}
            morphTargetInfluences={nodes.polySurface7.morphTargetInfluences}
            userData={{
              targetNames: [
                "blendShape1.blink",
                "blendShape1.openmouth",
                "blendShape1.middlemouth",
                "blendShape1.natural",
              ],
              name: "polySurface7",
            }}
          />
          <group
            name="secondary"
            rotation={[Math.PI, 0, Math.PI]}
            userData={{ name: "secondary" }}
          />
          <primitive object={nodes.chest} />
        </group>
      </group>
    </group>
  );
}

useGLTF.preload("models/gezzer.glb");
