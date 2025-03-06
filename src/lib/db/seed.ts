'use server';
import pool from '@/lib/db';

export async function setupDatabase() {
    try {
        await pool.query(`
        CREATE TABLE IF NOT EXISTS City (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          distance INT NOT NULL
        )
      `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Vehicle (
          id INT AUTO_INCREMENT PRIMARY KEY,
          type VARCHAR(50) NOT NULL,
          vehicle_range INT NOT NULL,
          count INT NOT NULL
        )
      `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Fugitive (
          id INT AUTO_INCREMENT PRIMARY KEY,
          cityId INT UNIQUE,
          FOREIGN KEY (cityId) REFERENCES City(id)
        )
      `);

        await pool.query(`
        CREATE TABLE IF NOT EXISTS Cop (
          id INT AUTO_INCREMENT PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          cityId INT,
          vehicleId INT,
          FOREIGN KEY (cityId) REFERENCES City(id),
          FOREIGN KEY (vehicleId) REFERENCES Vehicle(id)
        )
      `);

        const [cityCount] = await pool.query('SELECT COUNT(*) AS count FROM City');
        if ((cityCount as any)[0].count === 0) {
            await pool.query(`
        INSERT INTO City (name, distance) VALUES 
        ('Yapkashnagar', 60), 
        ('Lihaspur', 50), 
        ('Narmis City', 40), 
        ('Shekharvati', 30), 
        ('Nuravgram', 20)
      `);
        }

        const [vehicleCount] = await pool.query('SELECT COUNT(*) AS count FROM Vehicle');
        if ((vehicleCount as any)[0].count === 0) {
            await pool.query(`
        INSERT INTO Vehicle (type, vehicle_range, count) VALUES 
        ('EV Bike', 60, 2), 
        ('EV Car', 100, 1), 
        ('EV SUV', 120, 1)
      `);
        }

        return 'Database setup completed!';
    } catch (error) {
        console.error('Database setup error:', error);
        return 'Error setting up database.';
    }
}