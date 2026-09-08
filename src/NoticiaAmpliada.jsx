import { useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import './NoticiaAmpliada.css'

function NoticiaAmpliada({ noticia, onClose }) {
  useEffect(() => {
    if (!noticia) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose?.()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [noticia, onClose])

  const layoutId = noticia ? `story-${noticia.title}` : undefined

  return (
    <AnimatePresence>
      {noticia && (
        <motion.div
          className="noticia-ampliada-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.article
            layoutId={layoutId}
            className="noticia-ampliada"
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 30 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="noticia-ampliada-close"
              onClick={onClose}
              aria-label="Cerrar noticia ampliada"
            >
              ×
            </button>

            <div className="noticia-ampliada-header">
              <span className="noticia-ampliada-kicker">Investigación</span>
              <h2>{noticia.title}</h2>
            </div>

            <div className="noticia-ampliada-body">
              <div className="noticia-ampliada-copy">
                {noticia.subtitulo && (
                  <h3 className="noticia-ampliada-subtitulo">{noticia.subtitulo}</h3>
                )}

                <p className="noticia-ampliada-text">{noticia.text}</p>

                {noticia.details && (
                  <p className="noticia-ampliada-details">{noticia.details}</p>
                )}
              </div>

              {noticia.image && (
                <div className="noticia-ampliada-media">
                  <img src={noticia.image} alt={noticia.subtitulo || noticia.title} />
                </div>
              )}
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default NoticiaAmpliada
