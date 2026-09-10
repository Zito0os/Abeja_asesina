import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { PaperScene } from './PaperScene'

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

export function PaperUnfoldEffect({ targetRef, onComplete, onProgress }) {
  const [progress, setProgress] = useState(0)
  const [textureCanvas, setTextureCanvas] = useState(null)
  const [paperSize, setPaperSize] = useState(null)
  const targetProgress = useRef(0)
  const currentProgress = useRef(0)
  const completed = useRef(false)
  const onCompleteRef = useRef(onComplete)
  const onProgressRef = useRef(onProgress)

  useEffect(() => {
    let active = true

    const captureLanding = async () => {
      if (!targetRef.current) {
        return
      }

      const targetBounds = targetRef.current.getBoundingClientRect()
      const visibleHeight = Math.min(
        targetRef.current.scrollHeight,
        Math.max(window.innerHeight - Math.max(targetBounds.top, 0), 0),
      )

      setPaperSize({
        width: targetRef.current.offsetWidth,
        height: visibleHeight,
      })

      const capturedCanvas = await html2canvas(targetRef.current, {
        backgroundColor: null,
        width: targetRef.current.offsetWidth,
        height: visibleHeight,
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
    onProgressRef.current = onProgress
  }, [onProgress])

  useEffect(() => {
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0

    const viewportHeight = window.innerHeight
    const revealDistance = Math.max(viewportHeight * 1.2, 180)

    const complete = () => {
      if (completed.current) {
        return
      }

      completed.current = true
      setProgress(1)
      onCompleteRef.current?.()
    }

    const updateTarget = () => {
      if (completed.current) 
        return

      const nextProgress = clamp(window.scrollY / revealDistance, 0, 1)
      targetProgress.current = nextProgress

      if (nextProgress >= 0.96 || window.scrollY > revealDistance * 0.8) {
        complete()
      }
    }

    const updateFromWheel = (event) => {
      if (completed.current) {
        return
      }

      const nextProgress = clamp(
        targetProgress.current + Math.abs(event.deltaY) / (viewportHeight * 1.4),
        0,
        1,
      )

      targetProgress.current = nextProgress

      if (nextProgress >= 0.96) {
        complete()
      }
    }

    updateTarget()
    window.addEventListener('scroll', updateTarget, { passive: true })
    window.addEventListener('wheel', updateFromWheel, { passive: true })

    let animationFrame
    const smoothProgress = () => {
      const difference = targetProgress.current - currentProgress.current
      currentProgress.current += difference * 0.18

      if (Math.abs(difference) < 0.001) {
        currentProgress.current = targetProgress.current
      }

      setProgress(currentProgress.current)
      onProgressRef.current?.(currentProgress.current)

      if (currentProgress.current >= 0.96 && !completed.current) {
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

  return <PaperScene progress={progress} textureCanvas={textureCanvas} paperSize={paperSize} />
}
