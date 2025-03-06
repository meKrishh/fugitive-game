'use client';
import { useState, useEffect } from 'react';
import { fetchVehicles, selectVehicle } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function SelectVehicle() {
  const [vehicles, setVehicles]: any = useState([]);
  const [selectedVehicles, setSelectedVehicles] = useState({ cop1: null, cop2: null, cop3: null });
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchVehicles().then(setVehicles);
  }, []);

  const handleSelect = async (cop: 'cop1' | 'cop2' | 'cop3', vehicleId: number) => {
    // Count selections per vehicle type
    const selectionCounts = Object.values(selectedVehicles).reduce((acc: Record<number, number>, id) => {
      if (id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    const vehicle: any = vehicles.find((v: any) => v.id === vehicleId);
    if (!vehicle) {
      setError('Selected vehicle not found.');
      return;
    }

    // Ensure availability limit is respected
    if (selectionCounts[vehicleId] >= vehicle.count) {
      setError(`Maximum limit reached for ${vehicle.type}. Choose another!`);
      return;
    }

    setSelectedVehicles((prev) => ({ ...prev, [cop]: vehicleId }));
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedVehicles.cop1 || !selectedVehicles.cop2 || !selectedVehicles.cop3) {
      setError('All 3 cops must select a vehicle!');
      return;
    }

    // Assign unique vehicles to each cop
    await selectVehicle(1, selectedVehicles.cop1);
    await selectVehicle(2, selectedVehicles.cop2);
    await selectVehicle(3, selectedVehicles.cop3);

    router.push('/result');
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl">Select a Vehicle for Each Cop</h2>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mt-4 space-y-4">
        {['cop1', 'cop2', 'cop3'].map((cop, index) => (
          <div key={cop} className="flex flex-col">
            <label className="text-lg font-semibold">Cop {index + 1}</label>
            <select
              onChange={(e) => handleSelect(cop as 'cop1' | 'cop2' | 'cop3', Number(e.target.value))}
              className="mt-2 p-2 border"
            >
              <option value="">Choose Vehicle</option>
              {vehicles.map((vehicle: any) => {
                // Count how many times the vehicle is selected
                const selectionCount = Object.values(selectedVehicles).filter((v) => v === vehicle.id).length;
                const isDisabled = selectionCount >= vehicle.count;

                return (
                  <option key={vehicle.id} value={vehicle.id} disabled={isDisabled}>
                    {vehicle.type} (Range: {vehicle.range} KM, Available: {vehicle.count - selectionCount})
                  </option>
                );
              })}
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
