import React, { useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { OrbitControls } from '@react-three/drei'
import { Color } from 'three'
import './styles.css'

const Background = ({ color = '#111' }) => {
  const { scene } = useThree()
  scene.background = useMemo(() => new Color().set(color), [color])
  return null
}

const NeonMaterial = () => {
  return (
    <meshPhysicalMaterial
      color='black'
      emissive='#8bead3'
      emissiveIntensity={20}
      toneMapped={false}
    />
  )
}

const Neon = () => {
  return (
    <mesh>
      <torusGeometry args={[2, 0.05, 12, 64]} />
      <NeonMaterial />
    </mesh>
  )
}

const NormalSphere = props => {
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[0.15, 4]} />
      <meshPhysicalMaterial />
    </mesh>
  )
}

const GlowingSphere = props => {
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[0.15, 4]} />
      <NeonMaterial />
    </mesh>
  )
}

const ACubeThatRotate = ({ children, ...props }) => {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
  return (
    <group ref={ref} {...props}>
      <mesh>
        <boxGeometry />
        <meshPhysicalMaterial />
      </mesh>
      {children}
    </group>
  )
}

const Main = () => {
  const distance = 0.66
  return (
    <Canvas>
      <OrbitControls />
      
      <Background />      
      <ambientLight intensity={0.25} color='#8bead3' />
      <directionalLight position={[10, 30, 10]} />

      <ACubeThatRotate>
        <NormalSphere position={[-distance, 0, 0]} />
        <NormalSphere position={[distance, 0, 0]} />
        <GlowingSphere position={[0, -distance, 0]} />
        <GlowingSphere position={[0, distance, 0]} />
      </ACubeThatRotate>

      <Neon />

      <EffectComposer>
        <Bloom mipmapBlur luminanceThreshold={0.9} radius={0.4} />
        <Noise opacity={0.02} />
        <Vignette />
      </EffectComposer>
    </Canvas>
  )
}

const root = createRoot(document.getElementById('root'))
root.render(<Main />)