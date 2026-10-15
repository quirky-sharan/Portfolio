import { Vector3 } from 'three'

/*
 * Lanyard physics without a physics engine.
 * A verlet rope (fixed anchor → clip) plus a card held rigid by three points
 * (clip, bottom-left, bottom-right). Positions carry the velocity, so a
 * released drag keeps its momentum.
 *
 * Physics runs at a fixed 120 Hz; rendering interpolates between the last two
 * physics states, so the strap moves smoothly on 60, 120 or 144 Hz screens
 * instead of stepping whenever the frame rate and the physics rate disagree.
 */

export const STEP = 1 / 120
const ITER = 14
const GRAVITY = -26
const ROPE_DRAG = 0.978
const CARD_DRAG = 0.988

export function createSim(anchor, { segments, ropeLength, card }) {
  const { w: W, h: H, clipY } = card
  const pos = []
  const prev = []
  const inv = [] // inverse mass
  // start swung out to the right, so the card drops in like a pendulum
  for (let i = 0; i <= segments; i++) {
    const p = anchor.clone().add(new Vector3((i / segments) * ropeLength, 0, 0))
    pos.push(p)
    prev.push(p.clone())
    inv.push(i === 0 ? 0 : 1)
  }
  const a = segments // the clip is the rope's last point
  inv[a] = 0.25
  const A = pos[a]
  pos.push(A.clone().add(new Vector3(clipY + H / 2, -W / 2, 0)), A.clone().add(new Vector3(clipY + H / 2, W / 2, 0)))
  prev.push(pos[a + 1].clone(), pos[a + 2].clone())
  inv.push(0.25, 0.25)
  const b = a + 1
  const c = a + 2

  const links = []
  for (let i = 0; i < segments; i++) links.push([i, i + 1, ropeLength / segments])
  const diag = Math.hypot(W / 2, clipY + H / 2)
  links.push([a, b, diag], [a, c, diag], [b, c, W])

  return {
    pos,
    prev,
    inv,
    links,
    a,
    b,
    c,
    W,
    acc: 0,
    before: pos.map((p) => p.clone()), // state before the latest step (for interpolation)
    tmp: new Vector3(),
  }
}

function step(sim, drag) {
  const { pos, prev, inv, links, tmp, a, b, c, W } = sim
  for (let i = 0; i < pos.length; i++) sim.before[i].copy(pos[i])

  // integrate
  for (let i = 0; i < pos.length; i++) {
    if (!inv[i]) continue
    const p = pos[i]
    tmp
      .copy(p)
      .sub(prev[i])
      .multiplyScalar(i >= a ? CARD_DRAG : ROPE_DRAG)
    prev[i].copy(p)
    p.add(tmp)
    p.y += GRAVITY * STEP * STEP
  }

  // dragging moves the whole card toward the pointer
  if (drag?.active) for (const i of [a, b, c]) pos[i].addScaledVector(drag.delta, 0.22)

  // a soft spring that turns the card's front back toward the viewer
  const B = pos[b]
  const C = pos[c]
  const k = drag?.active ? 0.004 : 0.012
  const mx = (B.x + C.x) / 2
  const mz = (B.z + C.z) / 2
  C.x += (mx + W / 2 - C.x) * k
  C.z += (mz - C.z) * k
  B.x += (mx - W / 2 - B.x) * k
  B.z += (mz - B.z) * k

  // satisfy the links (anchor-first sweep, then back, for a taut rope)
  for (let it = 0; it < ITER; it++) {
    const forward = it % 2 === 0
    for (let n = 0; n < links.length; n++) {
      const [i, j, len] = links[forward ? n : links.length - 1 - n]
      const wi = inv[i]
      const wj = inv[j]
      const sum = wi + wj
      if (!sum) continue
      tmp.copy(pos[j]).sub(pos[i])
      const dist = tmp.length() || 1e-6
      tmp.multiplyScalar((dist - len) / dist / sum)
      pos[i].addScaledVector(tmp, wi)
      pos[j].addScaledVector(tmp, -wj)
    }
  }
}

/* Advance by a frame's worth of time; returns the interpolation factor. */
export function stepSim(sim, dt, drag) {
  sim.acc = Math.min(sim.acc + dt, 0.05)
  while (sim.acc >= STEP) {
    sim.acc -= STEP
    step(sim, drag)
  }
  return sim.acc / STEP
}

/* Interpolated position of point i for rendering. */
export function renderPoint(sim, i, alpha, out) {
  return out.copy(sim.before[i]).lerp(sim.pos[i], alpha)
}

/* Re-pin the anchor (e.g. after a resize) without injecting velocity. */
export function setAnchor(sim, anchor) {
  sim.pos[0].copy(anchor)
  sim.prev[0].copy(anchor)
  sim.before[0].copy(anchor)
}
