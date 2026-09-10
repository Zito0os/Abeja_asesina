import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function BoundingBoxFetcher({ setObservations }) {
    const map = useMapEvents({
        moveend: () => {
            fetchBounds(map.getBounds());
        }
    });

    const fetchBounds = async (bounds) => {
        const nelat = bounds.getNorthEast().lat;
        const nelng = bounds.getNorthEast().lng;
        const swlat = bounds.getSouthWest().lat;
        const swlng = bounds.getSouthWest().lng;

        const url = `https://api.inaturalist.org/v1/observations?taxon_id=630955&place_id=11169&has_photos=true&per_page=200&nelat=${nelat}&nelng=${nelng}&swlat=${swlat}&swlng=${swlng}`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            setObservations(data.results);
        } catch (error) {
            console.error("Error fetching bounding box data:", error);
        }
    };

    // Fetch observations for the initial map view
    useEffect(() => {
        fetchBounds(map.getBounds());
    }, []);

    return null;
}

export default function BeeMap() {
    const [observations, setObservations] = useState([]);

    const mapCenter = [25.6866, -100.3161];
    const zoomLevel = 7;

    return (
        <div style={{
            height: '500px',
            margin: '28px auto',
            width: 'calc(100% - 56px)',
            border: '4px solid #1a1a1a',
            backgroundColor: '#f8f1df',
            position: 'relative',
            zIndex: '5'
        }}>
            <MapContainer
                center={mapCenter}
                zoom={zoomLevel}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <BoundingBoxFetcher setObservations={setObservations} />

                {observations.map((obs) => {
                    if (!obs.geojson || !obs.geojson.coordinates) return null;

                    const position = [obs.geojson.coordinates[1], obs.geojson.coordinates[0]];

                    return (
                        <CircleMarker
                            key={obs.id}
                            center={position}
                            radius={6}
                            pathOptions={{
                                color: '#17120d',
                                fillColor: '#dca10d',
                                fillOpacity: 0.9,
                                weight: 2
                            }}
                        >
                            <Popup>
                                <div style={{
                                    fontFamily: "Georgia, 'Times New Roman', serif",
                                    color: "#17120d",
                                    minWidth: "150px"
                                }}>
                                    {obs.photos && obs.photos.length > 0 && (
                                        <img
                                            src={obs.photos[0].url.replace('square', 'small')}
                                            alt={obs.taxon?.name}
                                            style={{ width: '100%', border: '2px solid #1a1a1a', borderRadius: '2px' }}
                                        />
                                    )}
                                    <h3 style={{ margin: '8px 0 2px', fontSize: '1.1rem', lineHeight: '1.2' }}>
                                        {obs.taxon?.preferred_common_name || "Abeja"}
                                    </h3>
                                    <p style={{ margin: '0 0 8px', fontStyle: 'italic', fontSize: '0.9rem' }}>
                                        {obs.taxon?.name}
                                    </p>
                                    <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                                        <strong>Autor:</strong> {obs.user?.login}<br />
                                        <strong>Fecha:</strong> {obs.observed_on}
                                    </div>
                                    <a
                                        href={obs.uri}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={{
                                            display: 'block',
                                            marginTop: '10px',
                                            color: '#dca10d',
                                            fontWeight: 'bold',
                                            textDecoration: 'none',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        VER EN INATURALIST →
                                    </a>
                                </div>
                            </Popup>
                        </CircleMarker>
                    );
                })}
            </MapContainer>
        </div>
    );
}