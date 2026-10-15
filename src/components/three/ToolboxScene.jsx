import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import RoomEnv from './RoomEnv'
import Matter from 'matter-js'
import monoFont from '@fontsource/jetbrains-mono/files/jetbrains-mono-latin-700-normal.woff?url'
import { toolbox } from '../../data/content'
import { smooth } from '../../lib/smooth'

const { Engine, Bodies, Body, Composite, Constraint, Query } = Matter
const FOV = 30
const MONO_ADVANCE = 0.6 // JetBrains Mono advance width, in em

function roundedRectShape(w, h, r) {
  const s = new THREE.Shape()
  const x = -w / 2
  const y = -h / 2
  s.moveTo(x + r, y)
  s.lineTo(x + w - r, y)
  s.quadraticCurveTo(x + w, y, x + w, y + r)
  s.lineTo(x + w, y + h - r)
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  s.lineTo(x + r, y + h)
  s.quadraticCurveTo(x, y + h, x, y + h - r)
  s.lineTo(x, y + r)
  s.quadraticCurveTo(x, y, x + r, y)
  return s
}

/* Camera distance so that 1 world unit == 1 CSS pixel on the z=0 plane. */
function CameraRig() {
  const { camera, size } = useThree()
  useEffect(() => {
    camera.fov = FOV
    camera.position.set(0, 0, size.height / 2 / Math.tan(THREE.MathUtils.degToRad(FOV / 2)))
    camera.near = 10
    camera.far = 6000
    camera.updateProjectionMatrix()
  }, [camera, size])
  return null
}

function Chips({ chips, engineRef, onReady, compact }) {
  const groups = useRef([])
  const { size } = useThree()
  const acc = useRef(0)

  const materials = useMemo(() => {
    const m = {}
    Object.entries(toolbox.groups).forEach(([k, g]) => {
      m[k] = new THREE.MeshPhysicalMaterial({
        color: g.color,
        roughness: 0.36,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.18,
      })
    })
    return m
  }, [])

  const geometries = useMemo(
    () =>
      chips.map((c) => {
        const bevel = c.h * 0.12
        const g = new THREE.ExtrudeGeometry(roundedRectShape(c.w - bevel * 2, c.h - bevel * 2, c.h * 0.26), {
          depth: c.d - bevel * 2,
          bevelEnabled: true,
          bevelThickness: bevel,
          bevelSize: bevel,
          bevelSegments: compact ? 2 : 4,
          curveSegments: compact ? 4 : 8,
        })
        g.translate(0, 0, -(c.d - bevel * 2) / 2)
        return g
      }),
    [chips, compact],
  )

  useEffect(
    () => () => {
      geometries.forEach((g) => g.dispose())
      Object.values(materials).forEach((m) => m.dispose())
    },
    [geometries, materials],
  )

  // physics world
  useEffect(() => {
    const engine = Engine.create({ gravity: { x: 0, y: 1, scale: 0.0016 } })
    engine.positionIterations = 8
    engine.velocityIterations = 6
    const W = size.width
    const H = size.height
    const T = 400
    const walls = [
      Bodies.rectangle(W / 2, H + T / 2, 20000, T, { isStatic: true }),
      Bodies.rectangle(-T / 2, H / 2, T, 20000, { isStatic: true }),
      Bodies.rectangle(W + T / 2, H / 2, T, 20000, { isStatic: true }),
    ]
    const pusher = Bodies.circle(-999, -999, compact ? 26 : 44, { isStatic: true })
    Composite.add(engine.world, [...walls, pusher])
    engineRef.current = { engine, walls, pusher, bodies: [], W, H, T }
    onReady?.()
    return () => {
      Composite.clear(engine.world, false)
      Engine.clear(engine)
      engineRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // keep the box the size of the canvas
  useEffect(() => {
    const ctx = engineRef.current
    if (!ctx) return
    const { walls, T } = ctx
    const W = size.width
    const H = size.height
    ctx.W = W
    ctx.H = H
    Body.setPosition(walls[0], { x: W / 2, y: H + T / 2 })
    Body.setPosition(walls[1], { x: -T / 2, y: H / 2 })
    Body.setPosition(walls[2], { x: W + T / 2, y: H / 2 })
    ctx.bodies.forEach((b) => {
      if (!b) return
      const x = THREE.MathUtils.clamp(b.position.x, 40, W - 40)
      const y = Math.min(b.position.y, H - 40)
      if (x !== b.position.x || y !== b.position.y) Body.setPosition(b, { x, y })
    })
  }, [size, engineRef])

  useFrame((_, delta) => {
    const ctx = engineRef.current
    if (!ctx) return
    // fixed 60 Hz physics steps
    acc.current = Math.min(acc.current + delta, 0.1)
    while (acc.current >= 1 / 60) {
      Engine.update(ctx.engine, 1000 / 60)
      acc.current -= 1 / 60
    }
    const { W, H } = ctx
    ctx.bodies.forEach((b, i) => {
      const g = groups.current[i]
      if (!g) return
      g.visible = true
      g.position.set(b.position.x - W / 2, H / 2 - b.position.y, 0)
      g.rotation.z = -b.angle
      // a little tumble so they read as real 3D objects
      g.rotation.x = THREE.MathUtils.clamp(b.velocity.y * 0.018, -0.5, 0.5)
      g.rotation.y = THREE.MathUtils.clamp(b.velocity.x * 0.018, -0.5, 0.5)
    })
  })

  return chips.map((c, i) => (
    <group key={c.label} ref={(el) => (groups.current[i] = el)} visible={false}>
      <mesh geometry={geometries[i]} material={materials[c.group]} castShadow={!compact} />
      <Text
        font={monoFont}
        fontSize={c.fs}
        color="#0e0e0c"
        anchorX="center"
        anchorY="middle"
        position={[0, -c.fs * 0.04, c.d / 2 + 0.6]}
        letterSpacing={0}
      >
        {c.label.toUpperCase()}
      </Text>
    </group>
  ))
}

function Interaction({ engineRef, chips, active, shakeRef, compact }) {
  const { gl } = useThree()
  const spawned = useRef(false)

  // drop the chips in once the section is on screen
  useEffect(() => {
    const ctx = engineRef.current
    if (!active || spawned.current || !ctx) return
    spawned.current = true
    const { W } = ctx
    const order = chips.map((_, i) => i).sort(() => Math.random() - 0.5)
    const timers = order.map((i, k) =>
      setTimeout(() => {
        const c = chips[i]
        const x = THREE.MathUtils.clamp(W * (0.1 + Math.random() * 0.8), c.w / 2 + 4, W - c.w / 2 - 4)
        const b = Bodies.rectangle(x, -c.h - Math.random() * 120, c.w, c.h, {
          chamfer: { radius: c.h * 0.3 },
          restitution: 0.25,
          friction: 0.25,
          frictionAir: 0.012,
          density: 0.0018,
          angle: (Math.random() - 0.5) * 1.2,
        })
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 6, y: 4 })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.12)
        ctx.bodies[i] = b
        Composite.add(ctx.engine.world, b)
      }, k * 70),
    )
    return () => timers.forEach(clearTimeout)
  }, [active, chips, engineRef])

  // shake / scatter
  useEffect(() => {
    shakeRef.current = () => {
      const ctx = engineRef.current
      if (!ctx) return
      ctx.bodies.forEach((b) => {
        if (!b) return
        Body.setVelocity(b, { x: (Math.random() - 0.5) * 22, y: -14 - Math.random() * 16 })
        Body.setAngularVelocity(b, (Math.random() - 0.5) * 0.4)
      })
    }
  }, [engineRef, shakeRef])

  // scrolling fast rattles the box: chips hop with your scroll speed
  useFrame(() => {
    const ctx = engineRef.current
    const v = smooth.lenis?.velocity ?? 0
    if (!ctx || Math.abs(v) < 18) return
    const now = performance.now()
    if (now - (ctx.lastRattle ?? 0) < 160) return
    ctx.lastRattle = now
    const hop = Math.min(Math.abs(v) * 0.22, 13)
    ctx.bodies.forEach((b) => {
      if (!b || Math.random() > 0.45) return
      Body.setVelocity(b, { x: b.velocity.x + (Math.random() - 0.5) * 4, y: -hop * (0.6 + Math.random() * 0.6) })
      Body.setAngularVelocity(b, b.angularVelocity + (Math.random() - 0.5) * 0.12)
    })
  })

  // pointer: drag + throw on mouse, flick on touch
  useEffect(() => {
    const el = gl.domElement.parentElement
    let drag = null
    let last = null
    const toWorld = (e) => {
      const r = el.getBoundingClientRect()
      return { x: e.clientX - r.left, y: e.clientY - r.top }
    }
    const live = () => (engineRef.current?.bodies ?? []).filter(Boolean)

    const onDown = (e) => {
      const ctx = engineRef.current
      if (!ctx) return
      const p = toWorld(e)
      const hit = Query.point(live(), p)[0]
      if (e.pointerType !== 'mouse') {
        // touch: flick whatever is near the finger, never block scrolling
        live().forEach((b) => {
          const dx = b.position.x - p.x
          const dy = b.position.y - p.y
          const d = Math.hypot(dx, dy)
          if (d < 160) Body.setVelocity(b, { x: (dx / (d || 1)) * 10, y: -12 - Math.random() * 6 })
        })
        return
      }
      if (!hit) return
      drag = Constraint.create({
        pointA: p,
        bodyB: hit,
        pointB: { x: p.x - hit.position.x, y: p.y - hit.position.y },
        stiffness: 0.12,
        damping: 0.08,
        length: 0,
      })
      drag.angleB = hit.angle
      Composite.add(ctx.engine.world, drag)
      el.setPointerCapture?.(e.pointerId)
      el.dataset.dragging = 'true'
    }
    const onMove = (e) => {
      const ctx = engineRef.current
      if (!ctx || e.pointerType !== 'mouse') return
      const p = toWorld(e)
      if (drag) {
        drag.pointA = p
      } else {
        Body.setPosition(ctx.pusher, p)
        el.dataset.hover = Query.point(live(), p).length ? 'true' : 'false'
      }
      last = p
    }
    const onUp = () => {
      const ctx = engineRef.current
      if (drag && ctx) Composite.remove(ctx.engine.world, drag)
      drag = null
      el.dataset.dragging = 'false'
    }
    const onLeave = () => {
      const ctx = engineRef.current
      if (ctx && !drag) Body.setPosition(ctx.pusher, { x: -999, y: -999 })
      last = null
    }
    el.addEventListener('pointerdown', onDown)
    el.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointerleave', onLeave)
      void last
    }
  }, [gl, engineRef, compact])

  return null
}

export default function ToolboxScene({ active, visible, shakeRef, compact }) {
  const engineRef = useRef(null)
  const chips = useMemo(() => {
    const h = compact ? 40 : 64
    const fs = h * 0.34
    return toolbox.items.map(([label, group]) => ({
      label,
      group,
      h,
      fs,
      d: h * 0.5,
      w: Math.round(label.length * fs * MONO_ADVANCE + h * 1.05),
    }))
  }, [compact])

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={visible ? 'always' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 2]}
      shadows={!compact}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.NeutralToneMapping }}
      camera={{ fov: FOV, position: [0, 0, 1000] }}
      style={{ touchAction: 'pan-y' }}
    >
      <CameraRig />
      <ambientLight intensity={0.45} />
      <directionalLight
        position={[-260, 520, 900]}
        intensity={1.1}
        castShadow={!compact}
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-1200}
        shadow-camera-right={1200}
        shadow-camera-top={800}
        shadow-camera-bottom={-800}
        shadow-camera-near={10}
        shadow-camera-far={3000}
        shadow-bias={-0.0004}
      />
      {!compact && (
        <mesh position={[0, 0, -40]} receiveShadow>
          <planeGeometry args={[6000, 4000]} />
          <shadowMaterial transparent opacity={0.13} />
        </mesh>
      )}
      <RoomEnv />
      <Chips chips={chips} engineRef={engineRef} compact={compact} />
      <Interaction engineRef={engineRef} chips={chips} active={active} shakeRef={shakeRef} compact={compact} />
    </Canvas>
  )
}
