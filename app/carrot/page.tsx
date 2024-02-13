
// import Controller from '@/components/Controller'
"use client"
import Controller from '@/components/Controller'
import { Experience } from '@/components/Experience'
import { Canvas } from '@react-three/fiber'

export default function Home() {
  return (
    <main className="flex h-full w-full" style={{ backgroundImage: `url(images/room.jpeg)` ,  backgroundPosition: 'bottom', backgroundSize: '100%' }}>
      <div className='absolute top-2 left-2 z-10 logo font-bold text-5xl' >
        GEZZER PRODUCTIONS.
      </div>
        <Canvas shadows camera={{ position: [0, 0, 10], fov: 50 }} gl={{ alpha: true }}>
           <directionalLight position={[10, 10, 5]} intensity={0.5} />
           <directionalLight position={[-10, -5, -5]} intensity={2.2} />
          <Experience />

        </Canvas>
        <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2'>
          <Controller />
        </div>
    </main>
  )
}


//ececec