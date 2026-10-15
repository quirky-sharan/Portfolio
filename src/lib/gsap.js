import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { CustomEase } from 'gsap/CustomEase'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase, useGSAP)

CustomEase.create('expo', '0.16, 1, 0.3, 1')
CustomEase.create('quart', '0.76, 0, 0.24, 1')
CustomEase.create('push', '0.45, 0, 0.2, 1')

gsap.defaults({ ease: 'expo', duration: 1 })
ScrollTrigger.config({ ignoreMobileResize: true })

export { gsap, ScrollTrigger, SplitText, useGSAP }
