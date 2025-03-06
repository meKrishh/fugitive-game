'use client';
import { useState, useEffect } from 'react';
import { fetchCities, selectCity } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function SelectCity() {
  const [cities, setCities]: any = useState([]);
  const [selectedCities, setSelectedCities]: any = useState({ cop1: null, cop2: null, cop3: null });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchCities().then(setCities);
  }, []);

  const handleSelect = async (cop: 'cop1' | 'cop2' | 'cop3', cityId: number) => {
    if (Object.values(selectedCities).includes(cityId)) {
      setError('Each cop must select a unique city!');
      return;
    }

    setSelectedCities((prev: any) => ({ ...prev, [cop]: cityId }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedCities.cop1 || !selectedCities.cop2 || !selectedCities.cop3) {
      setError('All 3 cops must select a city!');
      return;
    }

    // Assign unique cities to each cop
    await selectCity(1, selectedCities.cop1);
    await selectCity(2, selectedCities.cop2);
    await selectCity(3, selectedCities.cop3);

    router.push('/select-vehicle');
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl">Select a City for Each Cop</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 space-y-4">
        {['cop1', 'cop2', 'cop3'].map((cop, index) => (
          <div key={cop} className="flex flex-col">
            <label className="text-lg font-semibold">Cop {index + 1}</label>
            <select
              onChange={(e) => handleSelect(cop as 'cop1' | 'cop2' | 'cop3', Number(e.target.value))}
              className="mt-2 p-2 border"
            >
              <option value="">Choose City</option>
              {cities.map((city: any) => (
                <option key={city.id} value={city.id} disabled={Object.values(selectedCities).includes(city.id)}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      <button onClick={handleSubmit} className="mt-6 px-6 py-2 bg-green-500 text-white rounded">
        Confirm Selections
      </button>
    </div>
  );
}
