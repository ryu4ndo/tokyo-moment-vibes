import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '24px',
};

function computeCenter(points) {
  if (points.length === 0) {
    return { lat: 35.6812, lng: 139.7671 };
  }

  const lat = points.reduce((sum, point) => sum + point.lat, 0) / points.length;
  const lng = points.reduce((sum, point) => sum + point.lng, 0) / points.length;
  return { lat, lng };
}

function buildEmbedUrl(markers, center) {
  if (markers.length === 0) {
    return `https://maps.google.com/maps?q=${center.lat},${center.lng}&hl=ja&z=14&output=embed`;
  }

  if (markers.length === 1) {
    const spot = markers[0];
    return `https://maps.google.com/maps?q=${spot.lat},${spot.lng}&hl=ja&z=15&output=embed`;
  }

  const path = markers.map((spot) => `${spot.lat},${spot.lng}`).join('/');
  return `https://www.google.com/maps/dir/${path}/@${center.lat},${center.lng},14z/data=!4m2!4m1!3e2?hl=ja&output=embed`;
}

function EmbedMap({ markers, center }) {
  return (
    <div className="rounded-3xl overflow-hidden border border-white/10 bg-black/40">
      <iframe
        title="Tokyo route map"
        src={buildEmbedUrl(markers, center)}
        width="100%"
        height="400"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="flex flex-wrap gap-2 p-4 border-t border-white/10">
        {markers.map((spot, index) => (
          <div
            key={spot.id}
            className="px-3 py-1.5 rounded-full bg-white/10 text-xs font-bold text-white/80"
          >
            {index + 1}. {spot.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Map({ spots: planSpots = [], startPoint }) {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const markers = [
    ...(startPoint ? [{ id: 'start', name: startPoint.label, lat: startPoint.lat, lng: startPoint.lng }] : []),
    ...planSpots.filter((spot) => spot.lat != null && spot.lng != null),
  ];
  const center = computeCenter(markers);

  if (!apiKey) {
    return <EmbedMap markers={markers} center={center} />;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={14}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
        }}
      >
        {markers.map((spot, index) => (
          <Marker
            key={spot.id}
            position={{ lat: spot.lat, lng: spot.lng }}
            label={{
              text: `${index + 1}`,
              color: '#ffffff',
              fontWeight: 'bold',
            }}
            title={spot.name}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}
