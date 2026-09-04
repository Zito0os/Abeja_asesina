import { motion } from 'framer-motion';
import hexImage from './assets/HexagonoPanalMiel.png';
import './App.css';

export function HoneycombCluster({ data, onSelectCell }) {
  const centerNode = data.find((item) => item.id === 'center');
  const orbitingNodes = data.filter((item) => item.id !== 'center');

  return (
    <aside className="bee-visual" aria-label="Bee-themed illustration">
      <div className="honeycomb-cluster">
        {/* Central static panel */}
        {centerNode && (
          <div className={`cell-wrapper cell-${centerNode.id}`}>
            <motion.button
              layoutId={`hexagon-${centerNode.id}`}
              className="cell-node"
              onClick={() => onSelectCell(centerNode)}
              whileHover={{ scale: 1.08, filter: 'brightness(1.15)' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{ backgroundImage: `url(${hexImage})` }} /* FIX ADDED HERE */
            >
              <span className="cell-label">{centerNode.shortLabel}</span>
            </motion.button>
          </div>
        )}

        {/* Orbiting panels */}
        <div className="orbit-ring">
          {orbitingNodes.map((item) => (
            <div key={item.id} className={`cell-wrapper cell-${item.id} counter-orbit`}>
              <motion.button
                layoutId={`hexagon-${item.id}`}
                className="cell-node"
                onClick={() => onSelectCell(item)}
                whileHover={{ scale: 1.08, filter: 'brightness(1.15)' }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 320, damping: 28 }}
                style={{ backgroundImage: `url(${hexImage})` }} /* FIX ADDED HERE */
              >
                <span className="cell-label">{item.shortLabel}</span>
              </motion.button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}