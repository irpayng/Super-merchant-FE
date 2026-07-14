'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { MapPin, ExternalLink, Loader2 } from 'lucide-react';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface MapComponentProps {
  // Required props
  coordinates: Coordinates;

  // Optional props
  title?: string;
  locationName?: string;
  height?: string | number;
  width?: string | number;
  showFullMapButton?: boolean;
  showMarker?: boolean;
  markerColor?: string;
  className?: string;
  onMapClick?: (coordinates: Coordinates) => void;
  onMarkerClick?: (coordinates: Coordinates) => void;
  loading?: boolean;
  error?: string;

  // Map provider options
  mapProvider?: 'google' | 'leaflet' | 'placeholder';
  apiKey?: string; // For Google Maps
  zoom?: number;

  // Custom styling
  mapStyle?: 'default' | 'satellite' | 'terrain' | 'custom';
  customMapStyle?: string;
}

declare global {
  interface Window {
    google: any;
    L: any;
  }
}

const MapComponent: React.FC<MapComponentProps> = ({
  coordinates,
  title = 'Location',
  locationName,
  height = '300px',
  width = '100%',
  showFullMapButton = true,
  showMarker = true,
  markerColor = '#FC6401',
  className = '',
  onMapClick,
  onMarkerClick,
  loading = false,
  error,
  mapProvider = 'placeholder',
  apiKey,
  zoom = 15,
  mapStyle = 'default',
  customMapStyle,
}) => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);
  const [scriptLoading, setScriptLoading] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const leafletMapRef = useRef<any>(null);
  const leafletMarkerRef = useRef<any>(null);
  const leafletScriptLoadedRef = useRef(false);

  // Load Leaflet scripts only once
  useEffect(() => {
    if (
      mapProvider === 'leaflet' &&
      !leafletScriptLoadedRef.current &&
      !scriptLoading
    ) {
      loadLeafletScripts();
    }
  }, [mapProvider]);

  // Initialize map when scripts are loaded and coordinates change
  useEffect(() => {
    if (mapLoaded && coordinates && mapRef.current) {
      if (mapProvider === 'google' && googleMapRef.current) {
        updateGoogleMap();
      } else if (mapProvider === 'leaflet' && leafletMapRef.current) {
        updateLeafletMap();
      } else if (mapProvider === 'leaflet' && !leafletMapRef.current) {
        // Force reinitialize if map doesn't exist
        initializeLeafletMap();
      }
    }
  }, [coordinates, mapLoaded, mapProvider]);

  // Force reinitialize when coordinates change significantly
  useEffect(() => {
    if (mapProvider === 'leaflet' && leafletMapRef.current) {
      const currentLat = leafletMapRef.current.getCenter()?.lat;
      const currentLng = leafletMapRef.current.getCenter()?.lng;

      if (
        Math.abs(currentLat - coordinates.latitude) > 0.001 ||
        Math.abs(currentLng - coordinates.longitude) > 0.001
      ) {
        initializeLeafletMap();
      }
    }
  }, [coordinates.latitude, coordinates.longitude]);

  const loadLeafletScripts = async () => {
    if (leafletScriptLoadedRef.current || scriptLoading) return;

    setScriptLoading(true);
    setMapError(null);

    try {
      // Check if Leaflet is already loaded
      if (window.L) {
        setMapLoaded(true);
        leafletScriptLoadedRef.current = true;
        setScriptLoading(false);
        return;
      }

      // Load Leaflet CSS
      const cssLink = document.createElement('link');
      cssLink.rel = 'stylesheet';
      cssLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      cssLink.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      cssLink.crossOrigin = '';
      document.head.appendChild(cssLink);

      // Load Leaflet JS
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
      script.crossOrigin = '';

      script.onload = () => {
        console.log('Leaflet loaded successfully');
        setMapLoaded(true);
        leafletScriptLoadedRef.current = true;
        setScriptLoading(false);

        // Small delay to ensure DOM is ready
        setTimeout(() => {
          if (mapRef.current) {
            initializeLeafletMap();
          }
        }, 100);
      };

      script.onerror = () => {
        console.error('Failed to load Leaflet');
        setMapError(
          'Failed to load map library. Please check your internet connection.'
        );
        setScriptLoading(false);
      };

      document.head.appendChild(script);
    } catch (error) {
      console.error('Error loading Leaflet:', error);
      setMapError('Failed to load map library');
      setScriptLoading(false);
    }
  };

  const loadGoogleMapsScript = () => {
    if (!apiKey) {
      setMapError('Google Maps API key is required');
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setMapLoaded(true);
      initializeGoogleMap();
    };
    script.onerror = () => setMapError('Failed to load Google Maps');
    document.head.appendChild(script);
  };

  useEffect(() => {
    if (mapProvider === 'google' && apiKey) {
      loadGoogleMapsScript();
    } else if (mapProvider === 'placeholder') {
      setMapLoaded(true);
    }
  }, [mapProvider, apiKey]);

  const initializeGoogleMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapOptions = {
      center: { lat: coordinates.latitude, lng: coordinates.longitude },
      zoom: zoom,
      mapTypeId:
        mapStyle === 'satellite'
          ? window.google.maps.MapTypeId.SATELLITE
          : mapStyle === 'terrain'
          ? window.google.maps.MapTypeId.TERRAIN
          : window.google.maps.MapTypeId.ROADMAP,
      styles: customMapStyle ? JSON.parse(customMapStyle) : undefined,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    };

    googleMapRef.current = new window.google.maps.Map(
      mapRef.current,
      mapOptions
    );

    if (showMarker) {
      const marker = new window.google.maps.Marker({
        position: { lat: coordinates.latitude, lng: coordinates.longitude },
        map: googleMapRef.current,
        title: locationName || title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
        },
      });

      if (onMarkerClick) {
        marker.addListener('click', () => {
          onMarkerClick(coordinates);
        });
      }
    }

    if (onMapClick) {
      googleMapRef.current.addListener('click', (event: any) => {
        onMapClick({
          latitude: event.latLng.lat(),
          longitude: event.latLng.lng(),
        });
      });
    }
  };

  const initializeLeafletMap = () => {
    if (!mapRef.current || !window.L) {
      console.error('Map container or Leaflet not ready');
      return;
    }

    try {
      // Clean up existing map
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        leafletMarkerRef.current = null;
      }

      // Initialize new map
      leafletMapRef.current = window.L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: false, // Disable scroll wheel zoom to prevent conflicts
        dragging: true,
        touchZoom: true,
        doubleClickZoom: true,
        boxZoom: false,
        keyboard: false,
      }).setView([coordinates.latitude, coordinates.longitude], zoom);

      // Add OpenStreetMap tiles with error handling
      const tileLayer = window.L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19,
          subdomains: 'abc',
          errorTileUrl:
            'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', // Transparent fallback
        }
      );

      tileLayer.addTo(leafletMapRef.current);

      // Add marker if requested
      if (showMarker) {
        const customIcon = window.L.divIcon({
          className: 'custom-marker',
          html: `<div style="width: 20px; height: 20px; background-color: ${markerColor}; border: 3px solid white; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        leafletMarkerRef.current = window.L.marker(
          [coordinates.latitude, coordinates.longitude],
          { icon: customIcon }
        ).addTo(leafletMapRef.current);

        if (locationName) {
          leafletMarkerRef.current.bindPopup(locationName);
        }

        if (onMarkerClick) {
          leafletMarkerRef.current.on('click', () => {
            onMarkerClick(coordinates);
          });
        }
      }

      // Add map click handler
      if (onMapClick) {
        leafletMapRef.current.on('click', (event: any) => {
          onMapClick({
            latitude: event.latlng.lat,
            longitude: event.latlng.lng,
          });
        });
      }

      // Force a resize to ensure proper rendering
      setTimeout(() => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      }, 100);
    } catch (error) {
      console.error('Error initializing Leaflet map:', error);
      setMapError('Failed to initialize map');
    }
  };

  const updateGoogleMap = () => {
    if (googleMapRef.current) {
      const newPosition = {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      };
      googleMapRef.current.setCenter(newPosition);

      // Update marker if it exists
      const markers = googleMapRef.current.markers || [];
      markers.forEach((marker: any) => {
        marker.setPosition(newPosition);
      });
    }
  };

  const updateLeafletMap = () => {
    if (leafletMapRef.current) {
      const newPosition = [coordinates.latitude, coordinates.longitude];
      leafletMapRef.current.setView(newPosition, zoom);

      if (leafletMarkerRef.current) {
        leafletMarkerRef.current.setLatLng(newPosition);
      }
    }
  };

  const handleMapClick = (event: React.MouseEvent) => {
    if (onMapClick) {
      onMapClick(coordinates);
    }
  };

  const handleMarkerClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onMarkerClick) {
      onMarkerClick(coordinates);
    }
  };

  const openFullMap = () => {
    if (mapProvider === 'google') {
      const url = `https://www.google.com/maps?q=${coordinates.latitude},${coordinates.longitude}`;
      window.open(url, '_blank');
    } else if (mapProvider === 'leaflet') {
      const url = `https://www.openstreetmap.org/?mlat=${coordinates.latitude}&mlon=${coordinates.longitude}&zoom=${zoom}`;
      window.open(url, '_blank');
    }
  };

  const renderPlaceholderMap = () => (
    <div
      className='relative w-full h-full bg-gradient-to-br from-blue-50 to-cyan-100 flex items-center justify-center cursor-pointer'
      onClick={handleMapClick}
    >
      <div className='text-center'>
        <div className='bg-white p-4 rounded-full shadow-lg mb-3 inline-block'>
          <MapPin className='h-6 w-6 text-[#FC6401]' />
        </div>
        <p className='text-gray-600 font-medium'>{title}</p>
        <p className='text-sm text-gray-500 mt-1'>
          {locationName ||
            `${coordinates.latitude.toFixed(
              6
            )}, ${coordinates.longitude.toFixed(6)}`}
        </p>
      </div>

      {showMarker && (
        <div
          className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer'
          onClick={handleMarkerClick}
        >
          <div
            className='w-6 h-6 rounded-full border-4 border-white shadow-lg'
            style={{ backgroundColor: markerColor }}
          ></div>
        </div>
      )}
    </div>
  );

  const renderGoogleMap = () => {
    if (!mapLoaded) {
      return (
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-[#FC6401]' />
          <span className='ml-2 text-gray-600'>Loading Google Maps...</span>
        </div>
      );
    }

    return <div ref={mapRef} className='w-full h-full' />;
  };

  const renderLeafletMap = () => {
    if (scriptLoading) {
      return (
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-[#FC6401]' />
          <span className='ml-2 text-gray-600'>Loading map library...</span>
        </div>
      );
    }

    if (!mapLoaded) {
      return (
        <div className='flex items-center justify-center h-full'>
          <Loader2 className='h-6 w-6 animate-spin text-[#FC6401]' />
          <span className='ml-2 text-gray-600'>Initializing map...</span>
        </div>
      );
    }

    return (
      <div
        ref={mapRef}
        className='w-full h-full'
        style={{ minHeight: '200px' }}
      />
    );
  };

  const renderMap = () => {
    switch (mapProvider) {
      case 'google':
        return renderGoogleMap();
      case 'leaflet':
        return renderLeafletMap();
      case 'placeholder':
      default:
        return renderPlaceholderMap();
    }
  };

  if (error || mapError) {
    return (
      <div className='flex items-center justify-center h-full bg-gray-50 border border-gray-200 rounded-lg'>
        <div className='text-center'>
          <MapPin className='h-8 w-8 text-gray-400 mx-auto mb-2' />
          <p className='text-gray-500 text-sm'>{error || mapError}</p>
          {mapProvider === 'leaflet' && (
            <Button
              variant='outline'
              // size='sm'
              className='mt-2'
              onClick={() => {
                setMapError(null);
                setMapLoaded(false);
                leafletScriptLoadedRef.current = false;
                loadLeafletScripts();
              }}
            >
              Retry
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className='flex items-center justify-between mb-3'>
        <p className='text-sm text-gray-500 font-medium'>{title}</p>
        {showFullMapButton && (
          <Button
            variant='outline'
            // size='sm'
            className='text-xs'
            onClick={openFullMap}
          >
            <ExternalLink className='w-3 h-3 mr-1' />
            View Full Map
          </Button>
        )}
        {locationName && <p>{locationName}</p>}
      </div>

      <div
        className='bg-gray-100 border border-gray-300 rounded-lg overflow-hidden relative'
        style={{
          height: typeof height === 'number' ? `${height}px` : height,
          width: typeof width === 'number' ? `${width}px` : width,
        }}
      >
        {loading ? (
          <div className='flex items-center justify-center h-full'>
            <Loader2 className='h-6 w-6 animate-spin text-[#FC6401]' />
            <span className='ml-2 text-gray-600'>Loading...</span>
          </div>
        ) : (
          renderMap()
        )}
      </div>
    </div>
  );
};

export default MapComponent;
