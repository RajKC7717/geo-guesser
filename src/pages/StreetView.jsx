import React, { useEffect, useRef } from 'react';

const StreetView = ({ latitude, longitude, apiKey, radius = 1000 }) => {
  const streetViewRef = useRef(null);


  useEffect(() => {
    if (!apiKey || !latitude || !longitude) return;

    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.onload = initializeStreetView;
      document.head.appendChild(script);
    };

    const initializeStreetView = () => {
      if (!window.google) return;

      const sv = new window.google.maps.StreetViewService();

      const location = new window.google.maps.LatLng(latitude, longitude);

      sv.getPanorama(
        {
          location,
          radius,
        },
        (data, status) => {
          if (status === window.google.maps.StreetViewStatus.OK) {
            new window.google.maps.StreetViewPanorama(streetViewRef.current, {
              pano: data.location.pano,
              pov: {
                heading: 34,
                pitch: 10,
              },
              zoom: 1,
              addressControl: false,
            });
          } else {
            streetViewRef.current.innerHTML = `<div style="text-align: center; padding: 2rem;">No Street View imagery available within ${radius / 1000}km.</div>`;
          }
        }
      );
    };

    if (!window.google) {
      loadGoogleMapsScript();
    } else {
      initializeStreetView();
    }
  }, [latitude, longitude, apiKey, radius]);

  return (
    <div
      ref={streetViewRef}
      style={{
        width: '100%',
        height: '600px',
        borderRadius: '8px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      }}
    />
  );
};

export default StreetView;
