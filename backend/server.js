import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pkg from 'pg'; // Import pg as default
const { Pool } = pkg; // Destructure the Pool class

// Initialize Express app
const app = express();
app.use(cors());
const port = 5000;

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());

// Create a PostgreSQL pool for database connection
const pool = new Pool({
  user: 'postgres', // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'task_tracking',
  password: 'Abhi@123', // Replace with your PostgreSQL password
  port: 5432,
});

// Test PostgreSQL connection
pool.connect((err) => {
  if (err) {
    console.error('Failed to connect to PostgreSQL:', err);
    process.exit(1); // Exit process if unable to connect
  }
  console.log('Connected to PostgreSQL database.');
});

// Endpoint to add today's work
app.post('/api/tasks', async (req, res) => {
  const { taskDescription, status, estimatedTime, date, memberName } = req.body;

  console.log('Request Body:', req.body); // Log incoming request body for debugging

  if (!taskDescription || !status || !estimatedTime || !date || !memberName) {
    console.log('Missing required fields');
    return res.status(400).json({ error: 'All fields are required' });
  }

  const query = 'INSERT INTO tasks (taskDescription, status, estimatedTime, date, memberName) VALUES ($1, $2, $3, $4, $5) RETURNING *';

  try {
    const results = await pool.query(query, [taskDescription, status, estimatedTime, date, memberName]);
    console.log('Task added:', results.rows[0]); // Log inserted task for confirmation
    res.status(200).json({ message: 'Task added successfully', task: results.rows[0] });
  } catch (err) {
    console.error('Error inserting task:', err);
    res.status(500).json({ error: 'Error saving task', details: err.message });
  }
});


// Example API endpoint to get tasks for a specific member
app.get('/api/tasks', async (req, res) => {
  const { memberName } = req.query; // Get memberName from query parameters

  // Ensure memberName is provided
  if (!memberName) {
    return res.status(400).json({ error: 'Member name is required' });
  }

  const query = 'SELECT * FROM tasks WHERE memberName = $1'; // SQL query to fetch tasks by member name

  try {
    // Run the query with the memberName parameter
    const results = await pool.query(query, [memberName]);
    res.status(200).json(results.rows); // Return tasks as JSON response
    console.log(results.rows)
  } catch (err) {
    console.error('Error retrieving tasks:', err);
    res.status(500).json({ error: 'Error retrieving tasks', details: err.message });
  }
});



// Endpoint to retrieve all tasks
// app.get('/api/tasks', async (req, res) => {
//   const query = 'SELECT * FROM tasks';

//   try {
//     const results = await pool.query(query);
//     console.log('Retrieved tasks:', results.rows); // Log retrieved tasks
//     res.status(200).json(results.rows); // PostgreSQL query results are in 'rows'
//   } catch (err) {
//     console.error('Error retrieving tasks:', err);
//     res.status(500).json({ error: 'Error retrieving tasks' });
//   }
// });

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
