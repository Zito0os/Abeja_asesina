import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$29',
    subtitle: 'Perfecto para empezar',
    description: 'Ideal para quienes buscan una experiencia clara, ligera y fácil de usar.',
    highlight: false,
    features: ['Acceso a contenido principal', '1 actualización semanal', 'Soporte por correo'],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$79',
    subtitle: 'Más valor',
    description: 'La opción equilibrada para aprovechar más funciones y acceso anticipado.',
    highlight: true,
    features: ['Todo lo del Basic', 'Acceso anticipado', 'Soporte prioritario'],
  },
  {
    id: 'black',
    name: 'Black',
    price: '$149',
    subtitle: 'Máximo nivel',
    description: 'Para usuarios que quieren exclusividad, beneficios VIP y experiencia completa.',
    highlight: false,
    features: ['Todo lo del Premium', 'Contenido exclusivo', 'Beneficios VIP'],
  },
]

function PlanSelector() {
  const navigate = useNavigate()
  const [selectedPlanId, setSelectedPlanId] = useState(null)

  return (
    <div className="page-flip-back-content page-flip-back-content--plans">
      <button
        type="button"
        className="plans-back-button"
        onClick={() => navigate('/')}
      >
        Volver al periódico
      </button>

      <header className="masthead plans-masthead">
        <div className="masthead-main">
          <p className="edition">Edición especial · 01 de septiembre</p>
          <h1>¿No verdad?</h1>
          <div className="tagline">El periódico que escucha a la naturaleza</div>
        </div>
      </header>

      <div className="page-flip-plans-header">
        <div className="page-flip-pill-group">
          <span className="page-flip-pill">NUEVA EDICIÓN</span>
          <span className="page-flip-pill page-flip-pill-secondary">SOLO HOY</span>
        </div>
        <p className="page-flip-kicker">Edición especial</p>
        <h2>Escoge tu plan</h2>
        <p className="page-flip-plans-subtitle">
          Elige la opción que mejor se adapte a tu ritmo, desde una experiencia esencial hasta un acceso completo.
        </p>
      </div>

      <div className="page-flip-plans-grid">
        {plans.map((plan) => {
          const isSelected = selectedPlanId === plan.id

          return (
            <article
              key={plan.id}
              className={`page-flip-plan ${plan.highlight ? 'page-flip-plan-featured' : ''} ${isSelected ? 'page-flip-plan-selected' : ''}`}
            >
              <div className="page-flip-plan-topline">
                <span className="page-flip-plan-tag">{plan.name}</span>
                {plan.highlight && <span className="page-flip-plan-recommended">Más popular</span>}
              </div>

              <div className="page-flip-plan-price-row">
                <div className="page-flip-plan-price">
                  <span>{plan.price}</span>
                  <small>/mes</small>
                </div>
                
              </div>

              

              <ul className="page-flip-plan-features">
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              <button
                type="button"
                className="page-flip-plan-button"
                aria-pressed={isSelected}
                onClick={() => setSelectedPlanId(plan.id)}
              >
                {isSelected ? 'Plan seleccionado' : `Escoger ${plan.name}`}
              </button>
            </article>
          )
        })}
      </div>

      <section className="page-flip-plans-note">
        <div className="page-flip-plans-note-copy">
          <p className="page-flip-plans-note-kicker">Nota de edición</p>
          <h3>Una experiencia que crece contigo</h3>
          <p>
            Todos los planes están pensados para que avances a tu propio ritmo.
            Comienza con lo esencial y cambia de nivel cuando quieras, sin perder
            tu acceso ni tus beneficios.
          </p>
        </div>

        <ul className="page-flip-plans-facts">
          <li>
            <strong>01</strong>
            <span>Acceso desde cualquier dispositivo</span>
          </li>
          <li>
            <strong>02</strong>
            <span>Beneficios activos desde el primer día</span>
          </li>
          <li>
            <strong>03</strong>
            <span>Sin permanencia obligatoria</span>
          </li>
        </ul>
      </section>
    </div>
  )
}

export default PlanSelector
