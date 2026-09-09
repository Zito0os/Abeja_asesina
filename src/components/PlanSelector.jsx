import { useState } from 'react'

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
  const [selectedPlanId, setSelectedPlanId] = useState('premium')

  return (
    <div className="page-flip-back-content page-flip-back-content--plans">
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
                <span className="page-flip-plan-subtitle">{plan.subtitle}</span>
              </div>

              <p className="page-flip-plan-description">{plan.description}</p>

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
    </div>
  )
}

export default PlanSelector
