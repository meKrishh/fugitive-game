'use server';
import pool from '@/lib/db';

//   Fetch Cities
export async function fetchCities() {
  const [rows] = await pool.query('SELECT * FROM City');
  return rows;
}

//   Fetch Vehicles
export async function fetchVehicles() {
  const [rows] = await pool.query('SELECT * FROM Vehicle');
  return rows;
}

export async function selectCity(copId: number, cityId: number) {
  try {
    // Check if the city is already taken
    const [existingSelection] = await pool.query('SELECT COUNT(*) AS count FROM Cop WHERE cityId = ?', [cityId]);

    if ((existingSelection as any)[0].count > 0) {
      return 'This city is already selected by another cop. Choose a different one!';
    }

    // Assign city to cop (Ensure each cop selects only once)
    await pool.query(`
      INSERT INTO Cop (id, cityId) 
      VALUES (?, ?) 
      ON DUPLICATE KEY UPDATE cityId = VALUES(cityId)
    `, [copId, cityId]);

    return `Cop ${copId} selected City ID: ${cityId}`;
  } catch (error) {
    console.error('Error selecting city:', error);
    return 'Error selecting city.';
  }
}



//   Assign Vehicle to a Cop
export async function selectVehicle(copId: number, vehicleId: number) {
  try {
    // Get the selected cop's city distance
    const [copData]: any = await pool.query('SELECT cityId FROM Cop WHERE id = ?', [copId]);
    if ((copData as any).length === 0) return 'Cop has not selected a city!';
    const cityId: any = copData[0]?.cityId;

    const [city]: any = await pool.query('SELECT distance FROM City WHERE id = ?', [cityId]);
    if ((city as any).length === 0) return 'City not found!';
    const requiredRange = city[0]?.distance * 2; // Round trip distance

    // Get vehicle details
    const [vehicle]: any = await pool.query('SELECT type, range, count FROM Vehicle WHERE id = ?', [vehicleId]);
    if ((vehicle as any).length === 0) return 'Vehicle not found!';
    const { type, range, count } = vehicle[0];

    // Ensure the vehicle has enough range
    if (range < requiredRange) {
      return `Selected vehicle does not have enough range for a round trip! Needed: ${requiredRange} KM, Available: ${range} KM.`;
    }

    // Check if vehicle selection limit is reached
    const [selectedCount] = await pool.query('SELECT COUNT(*) AS count FROM Cop WHERE vehicleId = ?', [vehicleId]);
    if ((selectedCount as any)[0].count >= count) {
      return 'This vehicle is no longer available. Choose another!';
    }

    // Assign vehicle to cop
    await pool.query('UPDATE Cop SET vehicleId=? WHERE id=?', [vehicleId, copId]);

    return `Cop ${copId} selected Vehicle ID: ${vehicleId}`;
  } catch (error) {
    console.error('Error selecting vehicle:', error);
    return 'Error selecting vehicle.';
  }
}


export async function assignFugitive() {
  try {
    // Check if a fugitive location is already assigned
    const [existingFugitive]: any = await pool.query('SELECT cityId FROM Fugitive LIMIT 1');
    if ((existingFugitive as any).length > 0) {
      return `Fugitive is already assigned to City ID: ${existingFugitive[0].cityId}`;
    }

    // Fetch available cities
    const [cities]: any = await pool.query('SELECT id FROM City');
    if ((cities as any).length === 0) {
      return 'No cities available.';
    }

    // Pick a random city
    const randomCityId = (cities as any)[Math.floor(Math.random() * cities.length)].id;

    // Assign fugitive to a random city
    await pool.query('INSERT INTO Fugitive (cityId) VALUES (?)', [randomCityId]);

    console.log(`Fugitive assigned to City ID: ${randomCityId}`);
    return `Fugitive assigned to City ID: ${randomCityId}`;
  } catch (error) {
    console.error('Error assigning fugitive:', error);
    return 'Error assigning fugitive.';
  }
}


//   Check if a Cop Captured the Fugitive
export async function checkCapture() {
  try {
    // Check if fugitive exists
    const [fugitive]: any = await pool.query('SELECT cityId FROM Fugitive LIMIT 1');
    if ((fugitive as any).length === 0) {
      console.log('Fugitive not assigned. Assigning now...');
      await assignFugitive(); // Assign the fugitive first
      return 'Fugitive has now been assigned a location. Try again!';
    }

    const fugitiveCityId = fugitive[0]?.cityId;

    // Check if any cop selected the same city
    const [cops]: any = await pool.query('SELECT name FROM Cop WHERE cityId = ?', [fugitiveCityId]);

    if (cops.length > 0) {
      return `Cop ${cops[0].name} captured the fugitive!`;
    }

    return 'The fugitive escaped!';
  } catch (error) {
    console.error('Error checking capture:', error);
    return 'Error determining result.';
  }
}

