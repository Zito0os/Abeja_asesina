import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { PaperScene } from './PaperScene'

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export function PaperUnfoldEffect({ targetRef, onComplete }) {
  const [progress, setProgress] = useState(0)
  const [textureCanvas, setTextureCanvas] = useState(null)
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)

  useEffect(() => {
    let active = true

    const captureLanding = async () => {
      if (!targetRef.current) {
        return
      }

      const capturedCanvas = await html2canvas(targetRef.current, {
        backgroundColor: null,
        scale: Math.min(window.devicePixelRatio, 2),
        useCORS: true,
        onclone: (clonedDocument) => {
          const clonedTarget = clonedDocument.querySelector('.newspaper-page')
          clonedTarget?.style.setProperty('opacity', '1')
        },
      })

      if (active) {
        setTextureCanvas(capturedCanvas)
      }
    }

    captureLanding()

    return () => {
      active = false
    }
  }, [targetRef])

  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const updateTarget = () => {
      if (completed.current) {
        return
      }

      const animationDistance = Math.max(window.innerHeight * 0.9, 1)
      const nextProgress = clamp(window.scrollY / animationDistance, 0, 1)
      targetProgress.current = Math.max(targetProgress.current, nextProgress)
    }

    const updateFromWheel = (event) => {
      if (completed.current) {
        return
      }

      const hasScrollRoom = document.documentElement.scrollHeight > window.innerHeight + 1

      if (hasScrollRoom) {
        return
      }

      const animationDistance = Math.max(window.innerHeight * 1.5, 1)
      targetProgress.current = Math.max(
        targetProgress.current,
        clamp(targetProgress.current + event.deltaY / animationDistance, 0, 1),
      )
    }

    window.scrollTo(0, 0)
    updateTarget()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('wheel', updateFromWheel, { passive: true })

    let animationFrame
    const complete = () => {
      completed.current = true
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('wheel', updateFromWheel)
      window.cancelAnimationFrame(animationFrame)
      setProgress(1)
      onCompleteRef.current?.()
    }

    const smoothProgress = () => {
      const difference = targetProgress.current - currentProgress.current
      currentProgress.current += difference * 0.14

      if (Math.abs(difference) < 0.001) {
        currentProgress.current = targetProgress.current
      }

      setProgress(currentProgress.current)

      if (targetProgress.current >= 1 && !completed.current) {
        currentProgress.current = 1
        complete()
        return
      }

      animationFrame = window.requestAnimationFrame(smoothProgress)
    }
    smoothProgress()

    return () => {
      window.removeEventListener('scroll', updateTarget)
      window.removeEventListener('wheel', updateFromWheel)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return <PaperScene progress={progress} textureCanvas={textureCanvas} />
}
