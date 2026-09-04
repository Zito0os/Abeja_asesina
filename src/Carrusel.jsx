import { useState } from 'react'
import './Carrusel.css'

const bees = [
  {
    id: 1,
    image: 'src/assets/AbejadelasOrquIdeas.png',
  },
  {
    id: 2,
 image: 'src/assets/AbejaCarpinteradelSur.png',
  },
  {
    id: 3,
   image: 'src/assets/AbejadelasOrquIdeas.png',
  },
  {
    id: 4,
    image: 'src/assets/AbejadelSuelodeNoreste.png',
  },
  {
    id: 5,
    image: 'src/assets/AbejaVerdeMetalizada.png',
  },
]

function Carrusel({ onBeeSelect }) {
  const [activeBee, setActiveBee] = useState(2)

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
              onMouseEnter={() => setActiveBee(index)}
              onClick={() => onBeeSelect(bee)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onBeeSelect(bee)
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Abrir ${bee.title}`}
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
