import { memo, useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import qrcode from 'qrcode-generator'
import { person } from '../../data/content'
import { LOGO_CELL, LOGO_CELL_R, LOGO_CELLS, LOGO_CURVE, LOGO_SPLIT } from '../ui/logoData'
import RoomEnv from './RoomEnv'
import { createSim, renderPoint, setAnchor, simEnergy, stepSim } from './lanyardSim'

extend({ MeshLineGeometry, MeshLineMaterial })

/* ── card geometry (world units) ─────────────────────────────────── */
const W = 1.6
const H = 2.4
const T = 0.028
const R = 0.1
const SLOT = { w: 0.34, h: 0.07, y: H / 2 - 0.14 }
const PX = 1024 / W // texture pixels per world unit

const INK = '#0e0e0c'
const PAPER = '#f1efe9'
const SIGNAL = '#ff3b1f'
const LIME = '#d4f25a'
const PINK = '#f6b8e0'
const SMOKE = '#6f6e68'

const FONTS = [
  '800 100px "Archivo Variable"',
  'italic 400 100px "Instrument Serif"',
  '500 100px "JetBrains Mono Variable"',
  '700 100px "JetBrains Mono Variable"',
]

function roundedRect(shape, x, y, w, h, r) {
  shape.moveTo(x + r, y)
  shape.lineTo(x + w - r, y)
  shape.quadraticCurveTo(x + w, y, x + w, y + r)
  shape.lineTo(x + w, y + h - r)
  shape.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  shape.lineTo(x + r, y + h)
  shape.quadraticCurveTo(x, y + h, x, y + h - r)
  shape.lineTo(x, y + r)
  shape.quadraticCurveTo(x, y, x + r, y)
  return shape
}

function cardShape(withSlot) {
  const s = roundedRect(new THREE.Shape(), -W / 2, -H / 2, W, H, R)
  if (withSlot)
    s.holes.push(roundedRect(new THREE.Path(), -SLOT.w / 2, SLOT.y - SLOT.h / 2, SLOT.w, SLOT.h, SLOT.h / 2))
  return s
}

/* ── canvas helpers ──────────────────────────────────────────────── */
function rr(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

function fitText(ctx, text, x, y, maxW, { stretch = true } = {}) {
  const w = ctx.measureText(text).width
  const k = w > maxW ? maxW / w : 1
  ctx.save()
  ctx.translate(x, y)
  if (stretch || k < 1) ctx.scale(k, 1)
  ctx.fillText(text, 0, 0)
  ctx.restore()
}

function drawLogo(ctx, x, y, size, { boxed = true } = {}) {
  const k = size / 64
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(k, k)
  if (boxed) {
    ctx.fillStyle = INK
    rr(ctx, 0, 0, 64, 64, 15)
    ctx.fill()
  }
  ctx.fillStyle = PAPER
  LOGO_CELLS.forEach(([cx, cy]) => {
    rr(ctx, cx, cy, LOGO_CELL, LOGO_CELL, LOGO_CELL_R)
    ctx.fill()
  })
  ctx.beginPath()
  ctx.rect(0, LOGO_SPLIT, 64, 64)
  ctx.clip()
  ctx.fillStyle = SIGNAL
  ctx.fill(new Path2D(LOGO_CURVE))
  ctx.restore()
}

function token(ctx, text, x, y, bg) {
  const w = ctx.measureText(text).width
  ctx.fillStyle = bg
  rr(ctx, x - 6, y - 50, w + 16, 64, 10)
  ctx.fill()
  ctx.fillStyle = INK
  ctx.fillText(text, x, y)
  return w + 16
}

function drawQR(ctx, x, y, size) {
  // a short URL keeps the code coarse enough to scan straight off a screen
  const qr = qrcode(0, 'L')
  qr.addData(person.whatsapp)
  qr.make()
  const n = qr.getModuleCount()
  const cell = size / n
  ctx.fillStyle = '#fff'
  rr(ctx, x - 14, y - 14, size + 28, size + 28, 14)
  ctx.fill()
  ctx.fillStyle = INK
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++) if (qr.isDark(r, c)) ctx.fillRect(x + c * cell, y + r * cell, cell + 0.6, cell + 0.6)
}

function makeFront() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1536
  const g = c.getContext('2d')

  // paper body + ink header
  g.fillStyle = PAPER
  g.fillRect(0, 0, 1024, 1536)
  g.fillStyle = INK
  g.fillRect(0, 0, 1024, 268)

  drawLogo(g, 60, 104, 116, { boxed: false })
  g.fillStyle = PAPER
  g.font = '700 30px "JetBrains Mono Variable", monospace'
  g.textAlign = 'right'
  g.fillText('ALL-ACCESS PASS', 964, 150)
  g.globalAlpha = 0.55
  g.font = '500 24px "JetBrains Mono Variable", monospace'
  g.fillText('PORTFOLIO ©2026 — NO. 2029', 964, 196)
  g.globalAlpha = 1
  g.textAlign = 'left'

  // name
  g.fillStyle = INK
  g.font = '800 290px "Archivo Variable", sans-serif'
  if ('fontStretch' in g) g.fontStretch = 'extra-condensed'
  fitText(g, person.first.toUpperCase(), 56, 560, 912)
  fitText(g, person.last.toUpperCase(), 56, 820, 912, { stretch: false })
  if ('fontStretch' in g) g.fontStretch = 'normal'

  // half model / half motion as tokens
  g.font = 'italic 400 74px "Instrument Serif", serif'
  let x = 62
  g.fillStyle = INK
  g.fillText('Half', x, 950)
  x += g.measureText('Half ').width
  x += token(g, 'model.', x, 950, LIME) + 22
  g.fillStyle = INK
  g.fillText('Half', x, 950)
  x += g.measureText('Half ').width
  token(g, 'motion.', x, 950, PINK)

  // status pill
  g.font = '700 26px "JetBrains Mono Variable", monospace'
  const pill = 'OPEN TO INTERNSHIPS & COLLABS'
  const pw = g.measureText(pill).width + 76
  g.fillStyle = INK
  rr(g, 60, 1004, pw, 58, 29)
  g.fill()
  g.fillStyle = LIME
  g.beginPath()
  g.arc(92, 1033, 9, 0, Math.PI * 2)
  g.fill()
  g.fillStyle = PAPER
  g.fillText(pill, 116, 1042)

  // details + QR
  g.fillStyle = INK
  g.fillRect(60, 1110, 904, 3)
  const rows = [
    ['EMAIL', person.email],
    ['PHONE', person.phone],
    ['BASE', 'Vellore, India'],
  ]
  rows.forEach(([k, v], i) => {
    const y = 1180 + i * 92
    g.fillStyle = SMOKE
    g.font = '500 22px "JetBrains Mono Variable", monospace'
    g.fillText(k, 60, y)
    g.fillStyle = INK
    g.font = '700 31px "JetBrains Mono Variable", monospace'
    fitText(g, v, 60, y + 42, 560, { stretch: false })
  })
  drawQR(g, 668, 1128, 288)
  g.fillStyle = SMOKE
  g.font = '500 19px "JetBrains Mono Variable", monospace'
  g.textAlign = 'center'
  g.fillText('SCAN → SAY HI ON WHATSAPP', 812, 1446)
  g.textAlign = 'left'

  // signal footer
  g.fillStyle = SIGNAL
  g.fillRect(0, 1460, 1024, 76)
  g.fillStyle = PAPER
  g.font = '700 24px "JetBrains Mono Variable", monospace'
  g.fillText('AI/ML × FRONTEND', 60, 1508)
  g.textAlign = 'right'
  g.fillText('VALID EVERYWHERE ✦ NO EXPIRY', 964, 1508)
  g.textAlign = 'left'

  // punch the lanyard slot out of the texture
  g.globalCompositeOperation = 'destination-out'
  const sx = 512 - (SLOT.w * PX) / 2
  const sy = (H / 2 - SLOT.y) * PX - (SLOT.h * PX) / 2
  rr(g, sx, sy, SLOT.w * PX, SLOT.h * PX, (SLOT.h * PX) / 2)
  g.fill()
  return c
}

function makeBack() {
  const c = document.createElement('canvas')
  c.width = 1024
  c.height = 1536
  const g = c.getContext('2d')
  g.fillStyle = INK
  g.fillRect(0, 0, 1024, 1536)
  // faint grid
  g.strokeStyle = 'rgba(238,236,230,0.06)'
  g.lineWidth = 2
  for (let i = 1; i < 8; i++) {
    g.beginPath()
    g.moveTo((1024 / 8) * i, 0)
    g.lineTo((1024 / 8) * i, 1536)
    g.stroke()
  }
  drawLogo(g, 262, 330, 500, { boxed: false })
  g.fillStyle = PAPER
  g.textAlign = 'center'
  g.font = 'italic 400 84px "Instrument Serif", serif'
  g.fillText('Half model. Half motion.', 512, 980)
  g.globalAlpha = 0.6
  g.font = '500 28px "JetBrains Mono Variable", monospace'
  g.fillText('github.com/quirky-sharan', 512, 1090)
  g.fillText('linkedin.com/in/sharan-soni-', 512, 1138)
  g.globalAlpha = 0.4
  g.font = '500 22px "JetBrains Mono Variable", monospace'
  g.fillText('IF FOUND, RETURN TO SHARAN. HE’LL BUY YOU CHAI.', 512, 1420)
  g.textAlign = 'left'
  g.globalCompositeOperation = 'destination-out'
  const sx = 512 - (SLOT.w * PX) / 2
  const sy = (H / 2 - SLOT.y) * PX - (SLOT.h * PX) / 2
  rr(g, sx, sy, SLOT.w * PX, SLOT.h * PX, (SLOT.h * PX) / 2)
  g.fill()
  return c
}

function makeStrap() {
  const c = document.createElement('canvas')
  c.width = 2048
  c.height = 128
  const g = c.getContext('2d')
  g.fillStyle = SIGNAL
  g.fillRect(0, 0, 2048, 128)
  g.fillStyle = 'rgba(14,14,12,0.18)'
  g.fillRect(0, 0, 2048, 8)
  g.fillRect(0, 120, 2048, 8)
  g.fillStyle = INK
  g.font = '700 54px "JetBrains Mono Variable", monospace'
  g.textBaseline = 'middle'
  g.fillText('SHARAN SONI  ✦  HALF MODEL. HALF MOTION.  ✦  AI/ML × FRONTEND  ✦  ', 24, 68)
  return c
}

function texture(canvas, gl, flipX = false) {
  const t = new THREE.CanvasTexture(canvas)
  t.colorSpace = THREE.SRGBColorSpace
  t.anisotropy = Math.min(8, gl.capabilities.getMaxAnisotropy())
  if (flipX) {
    t.wrapS = THREE.RepeatWrapping
    t.repeat.x = -1
  }
  return t
}

/* ── physics (see lanyardSim.js) ─────────────────────────────────── */
const ROPE_SEGS = 12
// clipY: where the strap meets the card — the top of the metal clip
const SIM = { segments: ROPE_SEGS, ropeLength: 2.82, card: { w: W, h: H, clipY: SLOT.y + 0.2 } }

const _x = new THREE.Vector3()
const _y = new THREE.Vector3()
const _z = new THREE.Vector3()
const _m = new THREE.Vector3()
const _basis = new THREE.Matrix4()

/* card frame (position + rotation) from its three points */
function cardPose(A, B, C, target) {
  _x.copy(C).sub(B).normalize()
  _m.copy(B).add(C).multiplyScalar(0.5)
  _y.copy(A).sub(_m)
  _y.addScaledVector(_x, -_y.dot(_x)).normalize()
  _z.crossVectors(_x, _y)
  _basis.makeBasis(_x, _y, _z)
  target.quaternion.setFromRotationMatrix(_basis)
  // the card centre sits between the bottom edge and the clip
  target.position.copy(_m).addScaledVector(_y, H / 2)
}

/* ── the badge ───────────────────────────────────────────────────── */
function Badge({ compact, onDragChange, onHoverChange, running, anchorX }) {
  const { gl, size, camera, raycaster, pointer, invalidate } = useThree()
  const band = useRef(null)
  const card = useRef(null)
  const anchor = useMemo(() => new THREE.Vector3(), [])
  const halfW = 11.5 * Math.tan(THREE.MathUtils.degToRad(12.5)) * (size.width / size.height)
  anchor.set(halfW * anchorX, 4.3, 0)
  const sim = useMemo(() => createSim(anchor.clone(), SIM), []) // eslint-disable-line react-hooks/exhaustive-deps
  const cardPts = useMemo(() => [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()], [])
  const drag = useMemo(
    () => ({ active: false, local: new THREE.Vector3(), delta: new THREE.Vector3(), plane: new THREE.Plane() }),
    [],
  )
  const hit = useMemo(() => new THREE.Vector3(), [])
  // rendering is on demand: draw while the card moves, then sleep
  const calm = useRef(0)
  const asleep = useRef(true)
  const wake = () => {
    calm.current = 0
    invalidate()
  }
  const ropePts = useMemo(() => Array.from({ length: ROPE_SEGS + 1 }, () => new THREE.Vector3()), [])
  const curve = useMemo(() => new THREE.CatmullRomCurve3(ropePts, false, 'centripetal'), [ropePts])

  const assets = useMemo(() => {
    const front = texture(makeFront(), gl)
    const back = texture(makeBack(), gl)
    // ShapeGeometry UVs are in shape units; map them onto 0..1
    ;[front, back].forEach((t) => {
      t.repeat.set(1 / W, 1 / H)
      t.offset.set(0.5, 0.5)
    })
    const strap = texture(makeStrap(), gl)
    strap.wrapS = THREE.RepeatWrapping
    strap.wrapT = THREE.RepeatWrapping
    return {
      front,
      back,
      strap,
      face: new THREE.ShapeGeometry(cardShape(true), 10),
      body: new THREE.ExtrudeGeometry(cardShape(true), { depth: T * 0.96, bevelEnabled: false, curveSegments: 10 }),
    }
  }, [gl])

  useEffect(
    () => () => {
      Object.values(assets).forEach((a) => a.dispose?.())
    },
    [assets],
  )

  useFrame((_, delta) => {
    if (!card.current || !band.current) return
    if (drag.active) {
      // where the grabbed point is now vs. where the pointer is
      raycaster.setFromCamera(pointer, camera)
      if (raycaster.ray.intersectPlane(drag.plane, hit)) {
        const now = drag.local.clone().applyMatrix4(card.current.matrixWorld)
        drag.delta.copy(hit).sub(now)
      }
    }
    // the strap is pinned to the top of the section; follow resizes
    setAnchor(sim, anchor)
    // after a nap the clock delta spans the whole nap; resume from one frame
    const dt = asleep.current ? 1 / 60 : delta
    asleep.current = false
    const alpha = running ? stepSim(sim, dt, drag) : 0
    if (import.meta.env.DEV) {
      // test hook: fast-forward the simulation (dev builds only)
      window.__lanyardStep = (seconds) => {
        for (let t = 0; t < seconds; t += 0.05) stepSim(sim, 0.05, drag)
        wake()
      }
    }
    // render between the last two physics states (smooth on any refresh rate)
    renderPoint(sim, sim.a, alpha, cardPts[0])
    renderPoint(sim, sim.b, alpha, cardPts[1])
    renderPoint(sim, sim.c, alpha, cardPts[2])
    cardPose(cardPts[0], cardPts[1], cardPts[2], card.current)
    card.current.updateMatrixWorld()
    for (let i = 0; i <= ROPE_SEGS; i++) renderPoint(sim, ROPE_SEGS - i, alpha, ropePts[i])
    band.current.geometry.setPoints(curve.getPoints(compact ? 28 : 48))
    if (running) {
      // a few still frames in a row (not one turning point of a swing) = at rest
      calm.current = drag.active || simEnergy(sim) > 1e-10 ? 0 : calm.current + 1
      if (calm.current < 20) invalidate()
      else asleep.current = true
    }
  })

  // first frame, and whenever the section scrolls back into view
  useEffect(() => {
    if (!running) return
    calm.current = 0
    invalidate()
  }, [running, invalidate])

  const onDown = (e) => {
    e.stopPropagation()
    if (e.pointerType !== 'mouse') {
      // touch: a flick, never a scroll-blocking drag
      const kick = new THREE.Vector3((Math.random() - 0.5) * 0.06, 0.035, -0.05)
      for (const i of [sim.a, sim.b, sim.c]) sim.prev[i].sub(kick)
      wake()
      return
    }
    e.target.setPointerCapture?.(e.pointerId)
    drag.active = true
    drag.local.copy(e.point).applyMatrix4(card.current.matrixWorld.clone().invert())
    drag.plane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 0, 1), e.point)
    drag.delta.set(0, 0, 0)
    onDragChange?.(true)
    wake()
  }
  const onUp = (e) => {
    e.target.releasePointerCapture?.(e.pointerId)
    drag.active = false
    onDragChange?.(false)
    wake()
  }

  return (
    <>
      <group
        ref={card}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerOver={() => onHoverChange?.(true)}
        onPointerOut={() => onHoverChange?.(false)}
      >
        {/* edge */}
        <mesh geometry={assets.body} position={[0, 0, -T * 0.48]}>
          <meshStandardMaterial color="#d9d6cd" roughness={0.6} />
        </mesh>
        {/* front */}
        <mesh geometry={assets.face} position={[0, 0, T / 2]}>
          <meshPhysicalMaterial
            map={assets.front}
            alphaTest={0.5}
            roughness={0.42}
            clearcoat={1}
            clearcoatRoughness={0.25}
          />
        </mesh>
        {/* back */}
        <mesh geometry={assets.face} position={[0, 0, -T / 2]} rotation={[0, Math.PI, 0]}>
          <meshPhysicalMaterial
            map={assets.back}
            alphaTest={0.5}
            roughness={0.35}
            clearcoat={1}
            clearcoatRoughness={0.2}
          />
        </mesh>
        {/* metal clip through the slot */}
        <group position={[0, SLOT.y + 0.02, 0]}>
          <mesh position={[0, 0.11, 0]}>
            <boxGeometry args={[0.2, 0.12, 0.05]} />
            <meshStandardMaterial color="#b9b7b0" metalness={1} roughness={0.25} />
          </mesh>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <torusGeometry args={[0.07, 0.016, 10, 24, Math.PI]} />
            <meshStandardMaterial color="#c9c7c0" metalness={1} roughness={0.2} />
          </mesh>
        </group>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={[size.width, size.height]}
          useMap
          map={assets.strap}
          repeat={[-3, 1]}
          lineWidth={compact ? 0.9 : 1}
        />
      </mesh>
    </>
  )
}

// memo: Contact re-renders every second for its clock, and each re-render
// would wake the on-demand canvas for a frame
export default memo(function LanyardScene({ visible, compact, onDragChange, onHoverChange, anchorX = 0 }) {
  const [ready, setReady] = useState(false)

  // the card is drawn with the site fonts — wait for them
  useEffect(() => {
    let alive = true
    const load = document.fonts ? Promise.all(FONTS.map((f) => document.fonts.load(f))) : Promise.resolve()
    load.finally(() => alive && setReady(true))
    return () => {
      alive = false
    }
  }, [])

  return (
    <Canvas
      className="!absolute inset-0"
      frameloop={visible ? 'demand' : 'never'}
      dpr={compact ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0, 11.5], fov: 25 }}
      gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
      style={{ touchAction: 'pan-y' }}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[2, 4, 6]} intensity={1.2} />
      <RoomEnv intensity={0.7} />
      {ready && (
        <Badge
          compact={compact}
          onDragChange={onDragChange}
          onHoverChange={onHoverChange}
          running={visible}
          anchorX={anchorX}
        />
      )}
    </Canvas>
  )
})
