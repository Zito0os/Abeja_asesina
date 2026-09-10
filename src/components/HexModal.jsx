import { motion } from 'motion/react';
import '../../src/App.css';

export function HexModal({ cell, onClose }) {
    if (!cell) return null;

    return (
        <div className="hex-modal-backdrop" onClick={onClose}>
            <motion.div
                layoutId={`hexagon-${cell.id}`}
                className="hex-modal-wrapper"
                style={{ '--story-image': `url("${cell.img}")` }}
                onClick={(e) => e.stopPropagation()}
                transition={{ type: 'spring', stiffness: 260, damping: 25 }}
            >
                <div className="hex-modal-card">

                    {/* Triangular close button perfectly mapped to the top point of the hex */}
                    <button
                        type="button"
                        className="hex-close-btn"
                        onClick={onClose}
                        aria-label="Cerrar"
                    >
                        ✕
                    </button>

                    <div className="hex-modal-inner">
                        <h2>{cell.title}</h2>
                        <p className="hex-desc">{cell.text}</p>

                        {cell.stats && (
                            <div className="hex-stat-box">
                                <span className="stat-label">{cell.stats.label}</span>

                                {cell.stats.nativeShare !== undefined ? (
                                    <div className="stat-bar-group">
                                        <div className="stat-bar-track">
                                            <div
                                                className="stat-bar-fill native"
                                                style={{ width: `${cell.stats.nativeShare}%` }}
                                            />
                                            <div
                                                className="stat-bar-fill invasive"
                                                style={{ width: `${cell.stats.invasiveShare}%` }}
                                            />
                                        </div>
                                        <div className="stat-legend">
                                            <span>Nativas: {cell.stats.nativeShare}%</span>
                                            <span>Invasoras: {cell.stats.invasiveShare}%</span>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="stat-metric">
                                        <span className="metric-number">{cell.stats.value}</span>
                                        <span className="metric-unit">{cell.stats.unit}</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}