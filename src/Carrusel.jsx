import { useState } from 'react'
import './Carrusel.css'

const bees = [
  {
    id: 1,
    title: 'La abeja obrera',
    text: 'Las abejas obreras realizan distintas tareas dentro de la colmena.',
    image: '/assets/Abeja Carpintera del Sur.png',
  },
  {
    id: 2,
    title: 'La polinización',
    text: 'Las abejas ayudan a polinizar una gran cantidad de plantas y cultivos.',
    image: '/images/polinizacion.jpg',
  },
  {
    id: 3,
    title: 'La colmena',
    text: 'Una colonia puede trabajar de forma coordinada como una enorme comunidad.',
    image: '/images/colmena.jpg',
  },
  {
    id: 4,
    title: 'La reina',
    text: 'La abeja reina es fundamental para mantener la colonia.',
    image: '/images/abeja-reina.jpg',
  },
  {
    id: 5,
    title: 'La miel',
    text: 'La miel es el resultado del trabajo colectivo de miles de abejas.',
    image: '/images/miel.jpg',
  },
]

function Carrusel() {
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
            >
              <div className="bee-hex-inner">
               <img
                src={bee.image}
                alt={bee.title}
                className="bee-image"
              />

                <h3>{bee.title}</h3>

                <p>{bee.text}</p>

                <span className="bee-next">→</span>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Carrusel