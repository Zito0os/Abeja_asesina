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
  const [showPlanInfo, setShowPlanInfo] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [showSuccessBees, setShowSuccessBees] = useState(false);
  const handleSelectPlan = (plan) => {
  setSelectedPlan(plan);
  setShowPlanInfo(true);
  };
  const handleCancelPlan = () => {
  setShowPlanInfo(false);
};

  return (
    <div className="page-flip-back-content page-flip-back-content--plans">
      <header className="masthead plans-masthead">
        <div className="masthead-main">
          <button
            type="button"
            className="plans-back-button"
            onClick={() => navigate('/')}
          >
            Volver al periódico
          </button>
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
          onClick={() => {
            setSelectedPlanId(plan.id)
            setShowPlanInfo(true)
          }}
        >
          {isSelected ? 'Plan seleccionado' : `Escoger ${plan.name}`}
        </button>
            </article>
          )
        })}
      </div>

{selectedPlanId && (
  <section className="payment-section">
    <button
      type="button"
      className="payment-close-button"
      onClick={() => setSelectedPlanId(null)}
      aria-label="Cerrar"
    >
      ×
    </button>

    <h2>Completa tu compra</h2>

    <p>
      Has seleccionado el plan{' '}
      <strong>
        {plans.find((plan) => plan.id === selectedPlanId)?.name}
      </strong>
    </p>

    <form
      className="payment-form"
      onSubmit={(e) => {
        e.preventDefault()
        
        setSelectedPlanId(null)

        setPaymentComplete(true)
        setShowSuccessBees(true)

        setTimeout(() => {
          setShowSuccessBees(false)
        }, 7500)

        setTimeout(() => {
        setPaymentComplete(false)
        }, 5000)

        // Cierra la ventana después de pagar
        setSelectedPlanId(null)
      }}
    >
      <label>
        Nombre completo
        <input
          type="text"
          name="name"
          placeholder="Tu nombre"
          required
        />
      </label>

      <label>
        Correo electrónico
        <input
          type="email"
          name="email"
          placeholder="correo@ejemplo.com"
          required
        />
      </label>

      <label>
        Número de tarjeta
        <input
          type="text"
          name="card"
          placeholder="1234 1234 1234 1234"
          maxLength="19"
          required
        />
      </label>

      <div className="payment-row">
        <label>
          Expiración
          <input
            type="text"
            name="expiration"
            placeholder="MM/AA"
            required
          />
        </label>

        <label>
          CVV
          <input
            type="password"
            name="cvv"
            placeholder="123"
            maxLength="4"
            required
          />
        </label>
      </div>

      {/* BOTONES */}
      <div className="payment-actions">

        <button
          type="submit"
          className="payment-button"
        >
          Pagar{' '}
          {plans.find(
            (plan) => plan.id === selectedPlanId
          )?.name}
        </button>

        <button
          type="button"
          className="payment-cancel-button"
          onClick={() => setSelectedPlanId(null)}
        >
          Cancelar
        </button>

      </div>
    </form>
  </section>
)}

    {paymentComplete && (
      <div className="payment-success-message">
        <div className="payment-success-check">
          ✓
        </div>

        <h2>¡Pago exitoso!</h2>

        <p>
          Tu pago ha sido realizado correctamente.
        </p>

        <span>
          Tu plan{' '}
          <strong>
            {plans.find(
              (plan) => plan.id === selectedPlanId
            )?.name}
          </strong>{' '}
          ha sido activado.
        </span>
      </div>
    )}

{showSuccessBees && (
  <div className="payment-success-bees">
    <img
      className="success-bee bee-1"
      src="/src/assets/funfactbee.png"
      alt=""
    />
    <img
      className="success-bee bee-2"
      src="/src/assets/funfactbee.png"
      alt=""
    />
    <img
      className="success-bee bee-3"
      src="/src/assets/funfactbee.png"
      alt=""
    />
    <img
      className="success-bee bee-4"
      src="/src/assets/funfactbee.png"
      alt=""
    />
  </div>
)}

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
