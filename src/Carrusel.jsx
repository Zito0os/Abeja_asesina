import { useEffect, useState } from 'react'
import './Carrusel.css'
import orchidBeeImage from './assets/AbejadelasOrquIdeas.png'
import carpenterBeeImage from './assets/AbejaCarpinteradelSur.png'
import meliponaBeeImage from './assets/AbejaRealMelipona.png'
import groundBeeImage from './assets/AbejadelSuelodeNoreste.png'
import agapostemonBeeImage from './assets/AbejaVerdeMetalizada.png'

const bees = [
  {
    id: 1,
    image: orchidBeeImage,
  },
  {
    id: 2,
    image: carpenterBeeImage,
  },
  {
    id: 3,
    image: meliponaBeeImage,
  },
  {
    id: 4,
    image: groundBeeImage,
  },
  {
    id: 5,
    image: agapostemonBeeImage,
  },
]

function Carrusel({ onBeeSelect }) {
  const [activeBee, setActiveBee] = useState(2)

  useEffect(() => {
    const carouselTimer = window.setInterval(() => {
      setActiveBee((current) => (current + 1) % bees.length)
    }, 5000)

    return () => window.clearInterval(carouselTimer)
  }, [])

  const handleBeeClick = (bee, position) => {
    if (position === 0) {
      onBeeSelect(bee)
      return
    }

    if (position === 1) {
      setActiveBee((current) => (current + 1) % bees.length)
    }

    if (position === 4) {
      setActiveBee((current) => (current - 1 + bees.length) % bees.length)
    }
  }

  const handleBeeKeyDown = (event, bee, position) => {
    if (event.key !== 'Enter' && event.key !== ' ') return

    event.preventDefault()
    handleBeeClick(bee, position)
  }

  return (
    <section className="bee-carousel">
      <div className="bee-carousel-track">
        {bees.map((bee, index) => {
          const position =
            (index - activeBee + bees.length) % bees.length

          return (
            <article
              key={bee.id}
              className={`bee-hex bee-position-${position}`}
              onClick={() => handleBeeClick(bee, position)}
              onKeyDown={(event) => handleBeeKeyDown(event, bee, position)}
              role="button"
              tabIndex={0}
              aria-label={position === 0 ? `Abrir ${bee.title}` : position === 1 ? 'Mover carrusel a la derecha' : position === 4 ? 'Mover carrusel a la izquierda' : bee.title}
            >
              <div className="bee-hex-inner">
                  <img
                    src={bee.image}
                    alt={bee.title}
                    className="bee-image"
                  />

                <h3>{bee.title}</h3>

                <p>{bee.text}</p>

                <span className="bee-next"></span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Carrusel
