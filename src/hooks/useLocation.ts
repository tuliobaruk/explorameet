import { useState, useEffect, useCallback } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  cidade?: string;
  estado?: string;
}

export interface MapFilters {
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  raio?: number;
}

export const useLocation = () => {
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const getCurrentLocation = useCallback((): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocalização não é suportada neste navegador'));
        return;
      }

      setIsLoadingLocation(true);
      setLocationError(null);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            
            // Usar API de geocodificação reversa para obter cidade e estado
            const address = await reverseGeocode(latitude, longitude);
            
            const locationData: LocationData = {
              latitude,
              longitude,
              cidade: address?.cidade,
              estado: address?.estado,
            };

            setCurrentLocation(locationData);
            setIsLoadingLocation(false);
            resolve(locationData);
          } catch (error) {
            setLocationError('Erro ao obter informações de localização');
            setIsLoadingLocation(false);
            reject(error);
          }
        },
        (error) => {
          let errorMessage = 'Erro ao obter localização';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permissão de localização negada';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Localização indisponível';
              break;
            case error.TIMEOUT:
              errorMessage = 'Tempo limite para obter localização';
              break;
          }

          setLocationError(errorMessage);
          setIsLoadingLocation(false);
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutos
        }
      );
    });
  }, []);

  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Usando a API do Nominatim (OpenStreetMap) que é gratuita
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`
      );
      
      if (!response.ok) {
        throw new Error('Erro na geocodificação reversa');
      }

      const data = await response.json();
      
      return {
        cidade: data.address?.city || data.address?.town || data.address?.village || 'Cidade não encontrada',
        estado: data.address?.state || 'Estado não encontrado',
        pais: data.address?.country || 'Brasil'
      };
    } catch (error) {
      console.error('Erro na geocodificação reversa:', error);
      return null;
    }
  };

  const calculateDistance = (
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    // Fórmula de Haversine para calcular distância entre dois pontos
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  useEffect(() => {
    // Tentar obter localização automaticamente quando o hook é montado
    if (navigator.geolocation) {
      getCurrentLocation().catch(() => {
        // Silenciosamente falha se o usuário não permitir
      });
    }
  }, [getCurrentLocation]);

  return {
    currentLocation,
    isLoadingLocation,
    locationError,
    getCurrentLocation,
    calculateDistance,
    reverseGeocode,
  };
};
