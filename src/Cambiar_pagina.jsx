import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './Cambiar_pagina.css'
import PlanSelector from './components/PlanSelector'

const PAGE_FLIP_RELEASE_MS = 520
const PAGE_FLIP_HANDLE_SIZE = 0.1

const clamp = (value, minimum, maximum) => Math.min(Math.max(value, minimum), maximum)

function CambiarPagina({ targetRef, onComplete }) {
  const navigate = useNavigate()
  const backRef = useRef(null)
  const foldRef = useRef(null)
  const dragRef = useRef(null)
  const completeRef = useRef(onComplete)

  useEffect(() => {
    completeRef.current = onComplete
  }, [onComplete])

  useEffect(() => {
    const page = targetRef.current
    if (!page) return undefined
    page.classList.add('page-flip-touch-ready')

    const syncBackBounds = () => {
      const back = backRef.current
      const fold = foldRef.current
      if (!back || !fold) return
      const bounds = page.getBoundingClientRect()
      const pageHeight = Math.max(page.offsetHeight, 1)
      back.style.left = `${bounds.left}px`
      back.style.top = `${bounds.top}px`
      back.style.width = `${bounds.width}px`
      back.style.height = `${pageHeight}px`
      fold.style.left = `${bounds.left}px`
      fold.style.top = `${bounds.top}px`
      fold.style.width = `${bounds.width}px`
      fold.style.height = `${pageHeight}px`
    }

    const setPageProgress = (progress, pointerX, pointerY) => {
      const boundedProgress = clamp(progress, 0, 1)
      const width = Math.max(page.offsetWidth, 1)
      const height = Math.max(page.offsetHeight, 1)
      const foldX = clamp(pointerX, 0, width)
      const foldY = clamp(pointerY, 0, height)

      page.style.setProperty('--page-flip-progress', boundedProgress)
      page.style.setProperty('--page-flip-fold-x', `${foldX}px`)
      page.style.setProperty('--page-flip-fold-y', `${foldY}px`)
      page.classList.add('page-flip-active')
      foldRef.current?.classList.add('page-flip-fold-active')
      foldRef.current?.style.setProperty('--page-flip-fold-x', `${foldX}px`)
      foldRef.current?.style.setProperty('--page-flip-fold-y', `${foldY}px`)
    }

    const finishRelease = (shouldComplete) => {
      page.classList.add('page-flip-settling')
      setPageProgress(
        shouldComplete ? 1 : 0,
        shouldComplete ? -page.offsetWidth : page.clientWidth,
        shouldComplete ? page.offsetHeight : 0,
      )

      window.setTimeout(() => {
        page.classList.remove('page-flip-settling')
        page.classList.remove('page-flip-active')
        page.style.removeProperty('--page-flip-progress')
        page.style.removeProperty('--page-flip-fold-x')
        page.style.removeProperty('--page-flip-fold-y')
        foldRef.current?.classList.remove('page-flip-fold-active')
        foldRef.current?.style.removeProperty('--page-flip-fold-x')
        foldRef.current?.style.removeProperty('--page-flip-fold-y')

        if (shouldComplete) {
          page.classList.add('page-flip-complete')
          backRef.current?.classList.add('page-flip-back-visible')
          completeRef.current?.()
          navigate('/planes')
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
      const normalizedX = pointer.x / Math.max(page.offsetWidth, 1)
      const normalizedY = pointer.y / Math.max(page.offsetHeight, 1)
      const isHandleTriangle =
        normalizedX >= 1 - PAGE_FLIP_HANDLE_SIZE &&
        normalizedY <= PAGE_FLIP_HANDLE_SIZE &&
        (1 - normalizedX) / PAGE_FLIP_HANDLE_SIZE + normalizedY / PAGE_FLIP_HANDLE_SIZE <= 1
      if (!isHandleTriangle) return

      event.preventDefault()
      page.setPointerCapture?.(event.pointerId)
      dragRef.current = {
        pointerId: event.pointerId,
        bounds: page.getBoundingClientRect(),
        startX: pointer.x,
        startY: pointer.y,
        width: Math.max(page.clientWidth, 1),
        height: Math.max(page.offsetHeight, 1),
      }
      page.classList.add('page-flip-dragging')
      foldRef.current?.classList.add('page-flip-fold-dragging')
      setPageProgress(0, page.clientWidth, 0)
    }

    const onPointerMove = (event) => {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return

      event.preventDefault()
      const pointer = getLocalPointer(event, drag.bounds)
      const displacement = Math.hypot(
        Math.max(drag.startX - pointer.x, 0),
        Math.max(pointer.y - drag.startY, 0),
      )
      const progress = displacement / Math.hypot(drag.width, drag.height)
      setPageProgress(progress, pointer.x, pointer.y)
    }

    const onPointerUp = (event) => {
      const drag = dragRef.current
      if (!drag || event.pointerId !== drag.pointerId) return

      const pointer = getLocalPointer(event, drag.bounds)
      dragRef.current = null
      page.releasePointerCapture?.(event.pointerId)
      page.classList.remove('page-flip-dragging')
      foldRef.current?.classList.remove('page-flip-fold-dragging')
      finishRelease(pointer.x <= drag.width * 0.5)
    }

    const onPointerCancel = (event) => {
      if (!dragRef.current || event.pointerId !== dragRef.current.pointerId) return
      dragRef.current = null
      page.releasePointerCapture?.(event.pointerId)
      page.classList.remove('page-flip-dragging')
      foldRef.current?.classList.remove('page-flip-fold-dragging')
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
      page.classList.remove('page-flip-touch-ready')
      page.removeEventListener('pointerdown', onPointerDown)
      page.removeEventListener('pointermove', onPointerMove)
      page.removeEventListener('pointerup', onPointerUp)
      page.removeEventListener('pointercancel', onPointerCancel)
      window.removeEventListener('resize', syncBackBounds)
      window.removeEventListener('scroll', syncBackBounds)
    }
  }, [navigate, targetRef])

  return (
    <>
      <div ref={foldRef} className="page-flip-fold" aria-hidden="true" />
      <div ref={backRef} className="page-flip-back" aria-hidden="true">
        <PlanSelector />
      </div>
    </>
  )
}

export default CambiarPagina
