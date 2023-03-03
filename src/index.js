import React, { useMemo, useRef } from 'react'
import { createRoot } from 'react-dom/client'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { AccumulativeShadows, OrbitControls, RandomizedLight } from '@react-three/drei'
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

const NeonRing = () => {
  return (
    <mesh castShadow>
      <torusGeometry args={[2, 0.05, 12, 64]} />
      <NeonMaterial />
    </mesh>
  )
}

const NormalSphere = props => {
  return (
    <mesh {...props} castShadow receiveShadow>
      <icosahedronGeometry args={[0.15, 4]} />
      <meshPhysicalMaterial />
    </mesh>
  )
}

const NeonSphere = props => {
  return (
    <mesh {...props}>
      <icosahedronGeometry args={[0.15, 4]} />
      <NeonMaterial />
      <pointLight color='8bead3' intensity={1} distance={1} />
    </mesh>
  )
}

const ACubeThatRotates = ({ children, ...props }) => {
  const ref = useRef()
  useFrame(() => (ref.current.rotation.x = ref.current.rotation.y += 0.01))
  return (
    <group ref={ref} {...props}>
      <mesh castShadow receiveShadow>
        <boxGeometry />
        <meshPhysicalMaterial />
      </mesh>
      {children}
    </group>
  )
}

const Ground = () => {
  return (
    <group position={[0, -2, 0]}>
      <mesh castShadow>
        <boxGeometry />
        <meshPhysicalMaterial />
      </mesh>

      <group position-y={-.6}>
        <mesh position-y={-1}>
          <cylinderGeometry args={[4, 4, 2]} />
          <meshPhysicalMaterial />
        </mesh>
        <AccumulativeShadows
          position-y={.01} //  tiny offset to avoid glitches (overlap)
          temporal
          frames={100}
          color='white'
          toneMapped={true}
          alphaTest={0.9}
          scale={12}>
          <RandomizedLight
            amount={8}
            radius={8}
            ambient={0.5}
            intensity={1}
            position={[10, 30, 10]}
            bias={0.001}
          />
        </AccumulativeShadows>
      </group>
    </group>
  )
}

const Main = () => {
  const distance = 0.66
  return (
    <Canvas shadows>
      <OrbitControls />

      <Background />
      <ambientLight intensity={0.25} color='#8bead3' />
      <directionalLight castShadow position={[10, 30, 10]} />

      <ACubeThatRotates>
        <NormalSphere position={[-distance, 0, 0]} />
        <NormalSphere position={[distance, 0, 0]} />
        <NeonSphere position={[0, -distance, 0]} />
        <NeonSphere position={[0, distance, 0]} />
      </ACubeThatRotates>

      <Ground />
      <NeonRing />

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
