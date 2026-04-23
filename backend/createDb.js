const { Client } = require('pg');

async function main() {
  const client = new Client({ connectionString: 'postgresql://postgres:pedro@localhost:5433/postgres' });
  await client.connect();
  try {
    await client.query('CREATE DATABASE worship_app');
    console.log('Database worship_app created successfully.');
  } catch (err) {
    if (err.code === '42P04') {
        console.log('Database already exists.');
    } else {
        console.error('Error creating database:', err);
    }
  } finally {
    await client.end();
  }
}

main();
