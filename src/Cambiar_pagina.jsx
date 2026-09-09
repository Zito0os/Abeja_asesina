import { useEffect, useRef } from 'react'
import './Cambiar_pagina.css'

const PAGE_FLIP_THRESHOLD = 0.64
const PAGE_FLIP_RELEASE_MS = 520
const PAGE_FLIP_HANDLE_HEIGHT = 150

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

function CambiarPagina({ targetRef, onComplete }) {
  const backRef = useRef(null)
  const dragRef = useRef(null)
  const completeRef = useRef(onComplete)

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const page = targetRef.current
    if (!page) return undefined

    const syncBackBounds = () => {
      const back = backRef.current
      if (!back) return
      const bounds = page.getBoundingClientRect()
      back.style.left = `${bounds.left}px`
      back.style.top = `${bounds.top}px`
      back.style.width = `${bounds.width}px`
      back.style.height = `${page.offsetHeight}px`
    }

    const setPageProgress = (progress, pointerX) => {
      const boundedProgress = clamp(progress, 0, 1)
      page.style.setProperty('--page-flip-progress', boundedProgress)
      page.style.setProperty('--page-flip-pointer-x', `${pointerX}px`)
      page.classList.add('page-flip-active')
    }

    const finishRelease = (shouldComplete) => {
      page.classList.add('page-flip-settling')
      setPageProgress(shouldComplete ? 1 : 0, shouldComplete ? -page.offsetWidth : page.offsetWidth)

      window.setTimeout(() => {
        page.classList.remove('page-flip-settling')
        page.classList.remove('page-flip-active')
        page.style.removeProperty('--page-flip-progress')
        page.style.removeProperty('--page-flip-pointer-x')

        if (shouldComplete) {
          page.classList.add('page-flip-complete')
          backRef.current?.classList.add('page-flip-back-visible')
          completeRef.current?.()
        }
      }, PAGE_FLIP_RELEASE_MS)
    }

    const getLocalPointer = (event, referenceBounds = page.getBoundingClientRect()) => {
      const bounds = referenceBounds
      return {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      }
    }

    const onPointerDown = (event) => {
      if (event.button !== undefined && event.button !== 0) return
      if (page.classList.contains('page-flip-complete') || dragRef.current) return

      const pointer = getLocalPointer(event)
      const isTopHandle = pointer.y <= PAGE_FLIP_HANDLE_HEIGHT
      const isRightHandle = pointer.x >= page.clientWidth * 0.58
      if (!isTopHandle || !isRightHandle) return

      event.preventDefault()
      page.setPointerCapture?.(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        bounds: page.getBoundingClientRect(),
        startX: pointer.x,
        width: Math.max(page.clientWidth, 1),
      }
      page.classList.add('page-flip-dragging')
      setPageProgress(0, pointer.x)
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return

      const pointer = getLocalPointer(event, drag.bounds)
      const displacement = Math.max(drag.startX - pointer.x, 0)
      const progress = displacement / (drag.width * 0.72)
      setPageProgress(progress, pointer.x)
    }

    const onPointerUp = (event) => {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return

      const pointer = getLocalPointer(event, drag.bounds)
      const progress = clamp((drag.startX - pointer.x) / (drag.width * 0.72), 0, 1)
      dragRef.current = null
      page.releasePointerCapture?.(event.pointerId)
      page.classList.remove('page-flip-dragging')
      finishRelease(progress >= PAGE_FLIP_THRESHOLD)
    }

    const onPointerCancel = (event) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return
      dragRef.current = null
      page.releasePointerCapture?.(event.pointerId)
      page.classList.remove('page-flip-dragging')
      finishRelease(false)
    }

    page.addEventListener('pointerdown', onPointerDown)
    page.addEventListener('pointermove', onPointerMove)
    page.addEventListener('pointerup', onPointerUp)
    page.addEventListener('pointercancel', onPointerCancel)
    window.addEventListener('resize', syncBackBounds)
    window.addEventListener('scroll', syncBackBounds, { passive: true })
    syncBackBounds()

    return () => {
      page.removeEventListener('pointerdown', onPointerDown)
      page.removeEventListener('pointermove', onPointerMove)
      page.removeEventListener('pointerup', onPointerUp)
      page.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('resize', syncBackBounds)
      window.removeEventListener('scroll', syncBackBounds)
    }
  }, [targetRef])

  return (
    <div ref={backRef} className="page-flip-back" aria-hidden="true">
      <div className="page-flip-back-content">
        <p>EDICION ESPECIAL</p>
        <h2>Proximamente</h2>
      </div>
    </div>
  )
}

export default CambiarPagina
