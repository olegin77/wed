import React from 'react';

type MapWidgetProps = {
  lat: number;
  lng: number;
  label?: string;
};

export const MapWidget: React.FC<MapWidgetProps> = ({ lat, lng, label }) => (
  <div className="map-widget">
    <strong>{label ?? 'Локация площадки'}</strong>
    <div>Широта: {lat.toFixed(6)}</div>
    <div>Долгота: {lng.toFixed(6)}</div>
    <p>Подключите реальный провайдер карт, чтобы отобразить интерактивную схему.</p>
  </div>
);
