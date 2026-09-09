import { useEffect, useState } from 'react'
import './Header.css'

function Header({ onBackToTop }) {
  const [isScrolled, setIsScrolled] = useState(false)

useEffect(() => {
  let lastState = false

  const handleScroll = () => {
    const currentScroll = window.scrollY

    if (!lastState && currentScroll > 85) {
      setIsScrolled(true)
      lastState = true
    } else if (lastState && currentScroll < 10) {
      setIsScrolled(false)
      lastState = false
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true })
  return () => window.removeEventListener('scroll', handleScroll)
}, [])


  return (
    <header className={`masthead ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="masthead-main">
        <p className="edition">Edición especial · 01 de septiembre</p>

        <h1>
          <button className="headline-button" type="button" onClick={onBackToTop}>
            ¿No verdad?
          </button>
        </h1>

        <div className="tagline">El periódico que escucha a la naturaleza</div>
      </div>
    </header>
  )
}

export default Header