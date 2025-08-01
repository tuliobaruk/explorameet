import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MapPin, Navigation, X, ChevronDown } from 'lucide-react';
import { useLocation } from '@/hooks/useLocation';
import { toast } from 'react-toastify';

interface LocationFilterProps {
  onLocationChange: (filters: LocationFilters) => void;
  selectedFilters?: LocationFilters;
}

export interface LocationFilters {
  cidade?: string;
  estado?: string;
  latitude?: number;
  longitude?: number;
  raio?: number;
}

const ESTADOS_BRASIL = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

const ESTADO_PARA_UF: { [key: string]: string } = {
  'Acre': 'AC',
  'Alagoas': 'AL',
  'Amapá': 'AP',
  'Amazonas': 'AM',
  'Bahia': 'BA',
  'Ceará': 'CE',
  'Distrito Federal': 'DF',
  'Espírito Santo': 'ES',
  'Goiás': 'GO',
  'Maranhão': 'MA',
  'Mato Grosso': 'MT',
  'Mato Grosso do Sul': 'MS',
  'Minas Gerais': 'MG',
  'Pará': 'PA',
  'Paraíba': 'PB',
  'Paraná': 'PR',
  'Pernambuco': 'PE',
  'Piauí': 'PI',
  'Rio de Janeiro': 'RJ',
  'Rio Grande do Norte': 'RN',
  'Rio Grande do Sul': 'RS',
  'Rondônia': 'RO',
  'Roraima': 'RR',
  'Santa Catarina': 'SC',
  'São Paulo': 'SP',
  'Sergipe': 'SE',
  'Tocantins': 'TO'
};

const RAIOS_OPCOES = [
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 25, label: '25 km' },
  { value: 50, label: '50 km' },
  { value: 100, label: '100 km' },
];

const converterEstadoParaUF = (estado: string): string => {
  if (estado.length === 2) {
    return estado.toUpperCase();
  }
  
  return ESTADO_PARA_UF[estado] || estado;
};

const converterUFParaEstado = (uf: string): string => {
  const entrada = Object.entries(ESTADO_PARA_UF).find(([, value]) => value === uf.toUpperCase());
  return entrada ? entrada[0] : uf;
};

export const LocationFilter: React.FC<LocationFilterProps> = ({
  onLocationChange,
  selectedFilters = {}
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<LocationFilters>(selectedFilters);
  const [useCurrentLocation, setUseCurrentLocation] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const {
    currentLocation,
    isLoadingLocation,
    locationError,
    getCurrentLocation,
  } = useLocation();

  // Atualizar filtros locais quando os filtros selecionados mudarem
  useEffect(() => {
    setLocalFilters(selectedFilters);
  }, [selectedFilters]);

  // Aplicar localização atual quando obtida
  useEffect(() => {
    if (useCurrentLocation && currentLocation) {
      const newFilters = {
        ...localFilters,
        latitude: currentLocation.latitude,
        longitude: currentLocation.longitude,
        cidade: currentLocation.cidade,
        estado: currentLocation.estado ? converterEstadoParaUF(currentLocation.estado) : undefined,
        raio: localFilters.raio || 25, // Raio padrão de 25km
      };
      setLocalFilters(newFilters);
      onLocationChange(newFilters);
      setUseCurrentLocation(false);
    }
  }, [currentLocation, useCurrentLocation, localFilters, onLocationChange]);

  // Fechar filtro ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      setUseCurrentLocation(true);
      await getCurrentLocation();
      toast.success('Localização obtida com sucesso!');
    } catch {
      toast.error('Erro ao obter localização atual');
      setUseCurrentLocation(false);
    }
  }, [getCurrentLocation]);

  const handleFilterChange = (key: keyof LocationFilters, value: string | number) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const applyFilters = () => {
    onLocationChange(localFilters);
    setIsFilterOpen(false);
  };

  const clearFilters = () => {
    const emptyFilters: LocationFilters = {};
    setLocalFilters(emptyFilters);
    onLocationChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(
    key => localFilters[key as keyof LocationFilters] !== undefined
  );

  const getFilterText = () => {
    if (localFilters.cidade && localFilters.estado) {
      const estadoDisplay = localFilters.estado.length === 2 ? converterUFParaEstado(localFilters.estado) : localFilters.estado;
      return `${localFilters.cidade}, ${estadoDisplay}`;
    }
    if (localFilters.cidade) {
      return localFilters.cidade;
    }
    if (localFilters.estado) {
      const estadoDisplay = localFilters.estado.length === 2 ? converterUFParaEstado(localFilters.estado) : localFilters.estado;
      return estadoDisplay;
    }
    if (localFilters.latitude && localFilters.longitude) {
      return `Proximidade ${localFilters.raio || 25}km`;
    }
    return 'Localização';
  };

  return (
    <div className="relative" ref={filterRef}>
      <button
        onClick={() => setIsFilterOpen(!isFilterOpen)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 border border-[rgba(137,143,41,0.15)]"
      >
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <MapPin size={18} className="text-gray-600 flex-shrink-0" />
          <span className={`font-medium truncate ${hasActiveFilters ? 'text-green-600' : 'text-gray-700'}`}>
            {getFilterText()}
          </span>
        </div>
        <ChevronDown
          size={18}
          className={`text-gray-600 transition-transform flex-shrink-0 ${
            isFilterOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isFilterOpen && (
        <div className="absolute top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 z-50 left-0 right-0 mx-auto md:right-0 md:left-auto md:mx-0">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Filtrar por Localização</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            {/* Localização Atual */}
            <div className="mb-4">
              <button
                onClick={handleGetCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Navigation size={16} />
                {isLoadingLocation ? 'Obtendo localização...' : 'Usar minha localização atual'}
              </button>
              {locationError && (
                <p className="text-red-500 text-xs mt-1">{locationError}</p>
              )}
            </div>

            {/* Filtros Manuais */}
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cidade
                </label>
                <input
                  type="text"
                  value={localFilters.cidade || ''}
                  onChange={(e) => handleFilterChange('cidade', e.target.value)}
                  placeholder="Ex: São Paulo"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  value={localFilters.estado || ''}
                  onChange={(e) => handleFilterChange('estado', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">Selecione um estado</option>
                  {ESTADOS_BRASIL.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>

              {(localFilters.latitude && localFilters.longitude) && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Raio de busca
                  </label>
                  <select
                    value={localFilters.raio || 25}
                    onChange={(e) => handleFilterChange('raio', Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {RAIOS_OPCOES.map(opcao => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200">
              <button
                onClick={clearFilters}
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              >
                Limpar
              </button>
              <button
                onClick={applyFilters}
                className="flex-1 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors duration-200"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
