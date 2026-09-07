import { useState } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'motion/react';
import hexImage from './assets/HexagonoPanalMiel.png';
import './App.css';

const polarPoint = (distance, angle) => {
  const radians = (angle * Math.PI) / 180;
  return {
    x: Math.cos(radians) * distance,
    y: Math.sin(radians) * distance,
  };
};

const BeeParticles = () => {
  const numBees = Math.floor(Math.random() * 5) + 1;

  const bees = Array.from({ length: numBees }).map((_, i) => {
    const angle = Math.random() * 360;

    const dist = Math.random() * 120 + 100; 
    const target = polarPoint(dist, angle);

    // cfly curve
    const curveAmount = (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 100 + 50);
    const midX = (target.x / 2) - (target.y / dist) * curveAmount;
    const midY = (target.y / 2) + (target.x / dist) * curveAmount;


    const pathX = [];
    const pathY = [];
    for (let t = 0; t <= 1; t += 0.05) {
      pathX.push(2 * (1 - t) * t * midX + t * t * target.x);
      pathY.push(2 * (1 - t) * t * midY + t * t * target.y);
    }

    return (
      <motion.div
        key={i}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
        animate={{
          x: pathX,
          y: pathY,
          opacity: [0, 1, 1, 1, 0],
          scale: [0.5, 1.2, 1, 1, 0.8],
          rotate: [0, curveAmount > 0 ? 45 : -45, 0]
        }}
        transition={{

          duration: Math.random() * 3.5 + 3,
          ease: 'linear', 
          repeat: Infinity,
          repeatDelay: Math.random() * 1.5
        }}
        style={{ position: 'absolute', zIndex: 10, fontSize: '25px', pointerEvents: 'none' }}
      >
        🐝
      </motion.div>
    );
  });
  return <>{bees}</>;
};

// Sub-component that reads the high-performance motion values
const OrbitingNode = ({ item, index, rotation, orbitRadius, onSelectCell, setHoveredCell, hoveredCell }) => {
  const baseAngle = index * 60 - 90;
  
  // Transform the shared rotation value into unique X and Y coordinates natively
  const x = useTransform(rotation, (val) => polarPoint(orbitRadius, baseAngle + val).x);
  const y = useTransform(rotation, (val) => polarPoint(orbitRadius, baseAngle + val).y);

  return (
    <motion.div
      className="cell-wrapper"
      style={{
        top: '105px',
        left: '112px',
        x,
        y
      }}
    >
      <motion.button
        layoutId={`hexagon-${item.id}`}
        className="cell-node"
        onClick={() => onSelectCell(item)}
        onMouseEnter={() => setHoveredCell(item.id)}
        onMouseLeave={() => setHoveredCell(null)}
        whileHover={{ scale: 1.08, filter: 'brightness(1.15) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.2))' }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 320, damping: 28 }}
        style={{ backgroundImage: `url(${hexImage})` }}
      >
        <span className="cell-label">{item.shortLabel}</span>
        {hoveredCell === item.id && <BeeParticles />}
      </motion.button>
    </motion.div>
  );
};

export function HoneycombCluster({ data, onSelectCell, selectedCellId }) {
  const centerNode = data.find((item) => item.id === 'center');
  const orbitingNodes = data.filter((item) => item.id !== 'center');

  const [hoveredCell, setHoveredCell] = useState(null);

  const rotation = useMotionValue(0);


  useAnimationFrame((time, delta) => {
    if (!hoveredCell && !selectedCellId) {
      // Multiply delta (time since last frame) to ensure smooth speed on any monitor refresh rate
      rotation.set((rotation.get() + delta * 0.008) % 360);
    }
  });

  const orbitRadius = 105;

  return (
    <aside className="bee-visual" aria-label="Bee-themed illustration">
      <div className="honeycomb-cluster">

        {/* Central static panel */}
        {centerNode && (
          <div className="cell-wrapper cell-center">
            <motion.button
              layoutId={`hexagon-${centerNode.id}`}
              className="cell-node"
              onClick={() => onSelectCell(centerNode)}
              onMouseEnter={() => setHoveredCell('center')}
              onMouseLeave={() => setHoveredCell(null)}
              whileHover={{ scale: 1.08, filter: 'brightness(1.15) drop-shadow(0 6px 10px rgba(0, 0, 0, 0.2))' }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              style={{ backgroundImage: `url(${hexImage})` }}
            >
              <span className="cell-label">{centerNode.shortLabel}</span>
              {hoveredCell === 'center' && <BeeParticles />}
            </motion.button>
          </div>
        )}

        {/* Orbiting panels */}
        <div className="orbit-ring">
          {orbitingNodes.map((item, index) => (
            <OrbitingNode
              key={item.id}
              item={item}
              index={index}
              rotation={rotation}
              orbitRadius={orbitRadius}
              onSelectCell={onSelectCell}
              setHoveredCell={setHoveredCell}
              hoveredCell={hoveredCell}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}