import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, TextField, MenuItem, Select, InputLabel, FormControl } from '@mui/material';

function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    taskDescription: '',
    status: 'Pending',
    estimatedTime: '',
    date: new Date().toLocaleDateString(),
    memberName: '', // Initially empty, will be set after user selection
  });

  const [tasks, setTasks] = useState([]); // State to store tasks
  const [selectedMember, setSelectedMember] = useState(''); // State for selected member to filter tasks

  const location = useLocation(); // Use location hook to access the state passed from UserSelection
  const user = location.state?.user; // Access the user from state

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({ ...prevData, memberName: user })); // Set selected user as memberName
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formattedDate = new Date(formData.date).toISOString().split('T')[0];
    const updatedFormData = { ...formData, date: formattedDate };
  
    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (response.ok) {
        alert('Task Added Successfully!');
        setShowForm(false);
      } else {
        alert('Error adding task.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error adding task.');
    }
  };

  const fetchTasksForMember = async (memberName) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks?memberName=${memberName}`);
      if (response.ok) {
        const tasksData = await response.json();
        setTasks(tasksData);
      } else {
        console.error('Failed to fetch tasks');
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleMemberSelect = (e) => {
    const member = e.target.value;
    setSelectedMember(member);
    fetchTasksForMember(member);
  };

  return (
    <div>
      <AppBar position="static" sx={{ marginBottom: 2 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setShowForm(true)}>
            Add Today's Work
          </Button>
          <Button color="inherit" onClick={() => setShowForm(false)}>
            See All Work
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ padding: 2 }}>
        {!showForm ? (
          <>
            <Typography variant="h4">Welcome to Your Dashboard, {formData.memberName}!</Typography>
            <Typography variant="body1">Use the navigation bar to add or view work updates.</Typography>
            {/* Member Selection Dropdown */}
            <FormControl fullWidth sx={{ marginBottom: 2 }}>
              <InputLabel>Member</InputLabel>
              <Select
                value={selectedMember}
                onChange={handleMemberSelect}
                label="Member"
              >
                <MenuItem value="Shaymal">Shaymal</MenuItem>
                <MenuItem value="Vaishnavi">Vaishnavi</MenuItem>
                <MenuItem value="Shantanu">Shantanu</MenuItem>
                <MenuItem value="Abhishek">Abhishek</MenuItem>
              </Select>
            </FormControl>
            {/* Display Tasks */}
            {tasks.length > 0 ? (
              <div>
                <Typography variant="h5">Tasks for {selectedMember}:</Typography>
                <ul>
                  {tasks.map((task) => (
                    <li key={task.id}>
                      <Typography variant="body1">
                        <strong>Task:</strong> {task.taskdescription} <br />
                        <strong>Status:</strong> {task.status} <br />
                        <strong>Estimated Time:</strong> {task.estimatedtime} hours <br />
                        <strong>Date:</strong> {new Date(task.date).toLocaleDateString()} <br />
                      </Typography>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <Typography variant="body1">No tasks found for this member.</Typography>
            )}
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" sx={{ marginBottom: 2 }}>
              Add Today's Work
            </Typography>
            <TextField
              label="Task Description"
              name="taskDescription"
              value={formData.taskDescription}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Status"
              name="status"
              select
              value={formData.status}
              onChange={handleChange}
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="In Progress">In Progress</MenuItem>
              <MenuItem value="Completed">Completed</MenuItem>
            </TextField>
            <TextField
              label="Estimated Time (in hours)"
              name="estimatedTime"
              value={formData.estimatedTime}
              onChange={handleChange}
              type="number"
              fullWidth
              sx={{ marginBottom: 2 }}
              required
            />
            <TextField
              label="Date"
              name="date"
              value={formData.date}
              disabled
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <TextField
              label="Member Name"
              name="memberName"
              value={formData.memberName}
              disabled
              fullWidth
              sx={{ marginBottom: 2 }}
            />
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => setShowForm(false)}
              sx={{ marginLeft: 2 }}
            >
              Cancel
            </Button>
          </form>
        )}
      </Box>
    </div>
  );
}

export default Dashboard;
