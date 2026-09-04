import './Guia.css'

const beeGuides = [
  {
    id: 1,
    name: 'Abeja Real / Melipona',
    species: 'Melipona beecheii',
    behavior: 'Extremadamente pacíficas. No poseen aguijón funcional, por lo que no pueden picar.',
    actions: [
      'Quédate tranquilo y no intentes espantarlas.',
      'Si se posa sobre ti, déjala unos segundos o sopla muy suavemente.',
      'Puedes observarlas cerca de un nido en madera sin riesgo.'
    ]
  },
  {
    id: 2,
    name: 'Abeja del Suelo del Noreste',
    species: 'Nomia spp. / Lasioglossum spp.',
    behavior: 'Son solitarias y dóciles. Rara vez reaccionan contra las personas, excepto cuando son pisadas.',
    actions: [
      'Mira por dónde caminas y evita pisar sus nidos.',
      'No uses insecticidas en los parches de tierra donde anidan.',
      'Si se posa en tu piel, muévete despacio hasta que se desprenda.'
    ]
  },
  {
    id: 3,
    name: 'Abeja Carpintera del Sur',
    species: 'Xylocopa micans / Xylocopa virginica',
    behavior: 'Son grandes y ruidosas. Los machos son territoriales, pero no tienen aguijón; las hembras rara vez son agresivas.',
    actions: [
      'No te asustes por el zumbido o el tamaño.',
      'No hagas movimientos bruscos ni manotazos; camina despacio fuera del área.',
      'No golpees los nidos en estructuras de madera.'
    ]
  },
  {
    id: 4,
    name: 'Abeja Verde Metalizada',
    species: 'Agapostemon texanus',
    behavior: 'Es pequeña y rápida. Tiene aguijón, pero solo pica si es atrapada o aplastada contra la piel.',
    actions: [
      'Permítele trabajar en las flores; no busca comida humana.',
      'Si entra en tu ropa, levanta suavemente la tela para dejarla salir.',
      'No agites las manos; detente un momento si revolotea cerca.'
    ]
  },
  {
    id: 5,
    name: 'Abeja de las Orquídeas',
    species: 'Euglossa viridissima',
    behavior: 'Los machos recolectan aromas de flores y materia orgánica. Son de las abejas menos agresivas.',
    actions: [
      'Aprovecha para observar sus tonos verdes y su lengua larga.',
      'Si te sigue por tu perfume, aléjate con calma: le atrae el aroma.',
      'Déjala seguir su camino; no forma grupos que ataquen.'
    ]
  }
]

function Guia() {
  return (
    <section className="bee-guide" aria-live="polite">
      <p className="bee-guide-kicker">Qué hacer si te encuentras con una abeja</p>
      <div className="bee-guide-list">
        {beeGuides.map((bee) => (
          <article className="bee-guide-item" key={bee.id}>
            <h2>
              {bee.name} <em>({bee.species})</em>
            </h2>
            <p className="bee-guide-behavior">{bee.behavior}</p>
            <ul>
              {bee.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Guia
