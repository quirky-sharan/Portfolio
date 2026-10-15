import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { gsap } from '../../lib/gsap'
import RoomEnv from './RoomEnv'

const VERMILION = '#e8361c'
const MAX_PRINTS = 9

/* The seal face: シャ / ラン in two columns inside a ring, a little worn. */
function drawSeal(size = 512, mirrored = false) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  const g = c.getContext('2d')
  if (mirrored) {
    g.translate(size, 0)
    g.scale(-1, 1)
  }
  const mid = size / 2
  g.strokeStyle = VERMILION
  g.fillStyle = VERMILION
  g.lineWidth = size * 0.055
  g.beginPath()
  g.arc(mid, mid, size * 0.44, 0, Math.PI * 2)
  g.stroke()
  g.font = `700 ${size * 0.25}px "Sharan Japanese", "Noto Sans JP", sans-serif`
  g.textAlign = 'center'
  g.textBaseline = 'middle'
  const colR = mid + size * 0.13
  const colL = mid - size * 0.13
  g.fillText('シ', colR, mid - size * 0.13)
  g.fillText('ャ', colR, mid + size * 0.13)
  g.fillText('ラ', colL, mid - size * 0.13)
  g.fillText('ン', colL, mid + size * 0.13)
  // wear: knock specks out of the ink
  g.globalCompositeOperation = 'destination-out'
  let seed = 11
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647
  for (let i = 0; i < 420; i++) {
    g.globalAlpha = 0.25 + rnd() * 0.75
    g.beginPath()
    g.arc(rnd() * size, rnd() * size, rnd() * size * 0.009 + 0.5, 0, Math.PI * 2)
    g.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = 4
  return t
}

const PROFILE = [
  [0, 0],
  [0.97, 0],
  [1, 0.05],
  [1, 1.72],
  [0.95, 1.92],
  [0.8, 2.12],
  [0.84, 2.36],
  [0.95, 2.62],
  [0.9, 2.92],
  [0.66, 3.14],
  [0.3, 3.26],
  [0, 3.28],
].map(([x, y]) => new THREE.Vector2(x, y))

const Seal = forwardRef(function Seal({ onStamp, compact }, ref) {
  const group = useRef(null)
  const body = useRef(null)
  const busy = useRef(false)
  const pointer = useRef({ x: 0, y: 0 })
  const { camera } = useThree()

  const geo = useMemo(() => new THREE.LatheGeometry(PROFILE, compact ? 40 : 72), [compact])
  const faceTex = useMemo(() => drawSeal(512, true), [])
  useEffect(
    () => () => {
      geo.dispose()
      faceTex.dispose()
    },
    [geo, faceTex],
  )

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state, dt) => {
    const g = group.current
    if (!g || busy.current) return
    const t = state.clock.elapsedTime
    g.position.y = 0.32 + Math.sin(t * 1.5) * 0.09
    g.rotation.y += dt * 0.35
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, pointer.current.y * 0.16, 0.06)
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -pointer.current.x * 0.16, 0.06)
  })

  useImperativeHandle(ref, () => ({
    stamp() {
      const g = group.current
      if (!g || busy.current) return
      busy.current = true
      const tx = (Math.random() - 0.5) * (compact ? 1.8 : 3.2)
      const tz = (Math.random() - 0.5) * (compact ? 1.2 : 1.8)
      const base = camera.position.clone()
      gsap
        .timeline({
          onComplete: () => {
            busy.current = false
          },
        })
        .to(g.position, { x: tx, z: tz, y: 1.5, duration: 0.42, ease: 'power3.out' }, 0)
        .to(g.rotation, { x: 0, z: 0, duration: 0.35, ease: 'power2.out' }, 0)
        .to(g.position, { y: 0, duration: 0.14, ease: 'power4.in' })
        .add(() => {
          onStamp?.({ x: tx, z: tz, rot: g.rotation.y })
          gsap.fromTo(
            camera.position,
            { x: base.x + 0.05, y: base.y - 0.06 },
            { x: base.x, y: base.y, duration: 0.35, ease: 'elastic.out(1, 0.4)' },
          )
        })
        .to(body.current.scale, {
          y: 0.93,
          x: 1.03,
          z: 1.03,
          duration: 0.07,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
        })
        .to(g.position, { y: 0.32, duration: 0.9, ease: 'elastic.out(1, 0.55)' }, '+=0.12')
    },
  }))

  return (
    <group ref={group} position={[0, 0.32, 0]}>
      <group ref={body}>
        <mesh geometry={geo} castShadow>
          <meshPhysicalMaterial color="#151513" roughness={0.2} clearcoat={1} clearcoatRoughness={0.06} />
        </mesh>
        {/* gold band */}
        <mesh position={[0, 1.5, 0]}>
          <cylinderGeometry args={[1.012, 1.012, 0.13, compact ? 40 : 72, 1, true]} />
          <meshStandardMaterial color="#c9a14a" metalness={1} roughness={0.28} side={THREE.DoubleSide} />
        </mesh>
        {/* alignment mark */}
        <mesh position={[0, 1.2, 1.0]}>
          <sphereGeometry args={[0.075, 16, 16]} />
          <meshStandardMaterial color={VERMILION} roughness={0.3} />
        </mesh>
        {/* inked face */}
        <mesh position={[0, -0.002, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.97, 64]} />
          <meshStandardMaterial color="#f3ece4" map={faceTex} roughness={0.8} />
        </mesh>
      </group>
    </group>
  )
})

function Prints({ prints, tex }) {
  return prints.map((p) => <Print key={p.id} p={p} tex={tex} />)
}

function Print({ p, tex }) {
  const mat = useRef(null)
  const mesh = useRef(null)
  useEffect(() => {
    gsap.fromTo(mat.current, { opacity: 0 }, { opacity: 0.92, duration: 0.25, ease: 'power2.out' })
    gsap.fromTo(mesh.current.scale, { x: 1.06, y: 1.06 }, { x: 1, y: 1, duration: 0.5, ease: 'power3.out' })
  }, [])
  return (
    <mesh ref={mesh} position={[p.x, 0.003 + p.id * 0.0004, p.z]} rotation={[-Math.PI / 2, 0, p.rot]} receiveShadow>
      <circleGeometry args={[0.98, 64]} />
      <meshBasicMaterial ref={mat} map={tex} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  )
}

function Rig({ compact }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const narrow = size.width / size.height < 1
    camera.position.set(0, narrow ? 5.2 : 4.4, narrow ? 12.5 : 10)
    camera.lookAt(0, 1.15, 0)
    camera.updateProjectionMatrix()
  }, [camera, size, compact])
  return null
}

export default function HankoScene({ visible, compact, onStamp, stampRef }) {
  const seal = useRef(null)
  const [prints, setPrints] = useState([])
  const printTex = useMemo(() => drawSeal(512, false), [])
  const counter = useRef(0)

  useEffect(() => () => printTex.dispose(), [printTex])

  useEffect(() => {
    stampRef.current = () => seal.current?.stamp()
  }, [stampRef])

  const handleStamp = (p) => {
    counter.current += 1
    const id = counter.current
    setPrints((list) => [...list.slice(-(MAX_PRINTS - 1)), { ...p, id }])
    onStamp?.(id)
  }

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={visible ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 2]}
      shadows={!compact}
      camera={{ fov: 30, position: [0, 4.4, 10] }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      style={{ touchAction: 'pan-y' }}
      onPointerDown={() => seal.current?.stamp()}
    >
      <Rig compact={compact} />
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[3, 8, 5]}
        intensity={1.6}
        castShadow={!compact}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.0005}
        shadow-radius={6}
      />
      <RoomEnv intensity={0.8} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[40, 40]} />
        <shadowMaterial transparent opacity={0.16} />
      </mesh>
      <Prints prints={prints} tex={printTex} />
      <Seal ref={seal} onStamp={handleStamp} compact={compact} />
    </Canvas>
  )
}
