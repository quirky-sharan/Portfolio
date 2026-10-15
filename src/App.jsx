import { useEffect, useState } from 'react'
import { startSmoothScroll, smooth } from './lib/smooth'
import { ScrollTrigger } from './lib/gsap'
import Loader from './components/sections/Loader'
import Header from './components/sections/Header'
import Hero from './components/sections/Hero'
import About from './components/sections/About'
import Work from './components/sections/Work'
import Toolbox from './components/sections/Toolbox'
import Marquee from './components/sections/Marquee'
import Results from './components/sections/Results'
import Path from './components/sections/Path'
import Contact from './components/sections/Contact'
import Footer from './components/sections/Footer'
import Cursor from './components/ui/Cursor'

export default function App() {
  const [revealed, setRevealed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    startSmoothScroll()
    return () => smooth.dispose?.()
  }, [])

  // Scroll positions go stale whenever the page height shifts (fonts,
  // lazy scenes, the brief toggle…) — re-measure once things settle.
  useEffect(() => {
    let t
    let lastH = 0
    const refresh = () => {
      clearTimeout(t)
      t = setTimeout(() => ScrollTrigger.refresh(), 180)
    }
    const ro = new ResizeObserver(([e]) => {
      const h = Math.round(e.contentRect.height)
      if (Math.abs(h - lastH) > 2) {
        lastH = h
        refresh()
      }
    })
    ro.observe(document.body)
    document.fonts?.ready.then(refresh)
    return () => {
      ro.disconnect()
      clearTimeout(t)
    }
  }, [])

  useEffect(() => {
    if (ready) ScrollTrigger.refresh()
  }, [ready])

  return (
    <>
      <Loader onReveal={() => setRevealed(true)} onDone={() => setReady(true)} />
      <Header visible={revealed} />
      <main>
        <div className="relative">
          <Hero play={ready} />
          <About />
        </div>
        <Work />
        <Marquee />
        <Toolbox />
        <Results />
        <Path />
        <Contact />
      </main>
      <Footer />
      <div className="grain" aria-hidden="true" />
      <Cursor />
    </>
  )
}
