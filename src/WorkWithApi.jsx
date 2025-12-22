import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  IconButton,
  Alert,
  Stack,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

const API_URL = 'http://localhost:3001/users';

export default function WorkWithApi() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  // async - This keyword means "this function will wait for things that take time" (like getting data from a server)
  const fetchUsers = async () => {
    try {
      const res = await fetch(API_URL); // Ask the server for data from this URL
      const data = await res.json(); // await - "Wait here until the server responds" (fetching takes time!)
      // res - The response we get back from the server
      // You DO need res.json() to parse the incoming response. The server sends back a JSON string, and res.json() parses it back into a JavaScript object

      /* Outbound (your app → server): JSON.stringify() converts object → string
      Inbound (server → your app): res.json() converts string → object */
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      setLoading(false);
    }
  };

  /* Why async/await?
    Without it, we'd have to use .then() chains which are harder to read:
    javascriptfetch(API_URL)
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error(err));
  */

  const addUser = async () => {
    if (!formData.name || !formData.email) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
        // This converts your JavaScript object {name: "John", email: "..."} into a JSON string that can be transmitted.
      });
      const newUser = await res.json();
      setUsers([...users, newUser]);
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error('Error adding user:', err);
    }
  };

  const updateUser = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const updatedUser = await res.json();
      setUsers(users.map(u => u.id === id ? updatedUser : u));
      setEditingId(null);
      setFormData({ name: '', email: '' });
    } catch (err) {
      console.error('Error updating user:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
    }
  };

  const startEdit = (user) => {
    setEditingId(user.id);
    setFormData({ name: user.name, email: user.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', email: '' });
  };

  const handleSubmit = () => {
    if (editingId) {
      updateUser(editingId);
    } else {
      addUser();
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        bgcolor="grey.100"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e3f2fd 0%, #c5cae9 100%)',
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            User Management
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                variant="outlined"
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                variant="outlined"
              />
              <Stack direction="row" spacing={1} sx={{ minWidth: 'fit-content' }}>
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  startIcon={editingId ? <SaveIcon /> : <AddIcon />}
                  sx={{ whiteSpace: 'nowrap' }}
                >
                  {editingId ? 'Update' : 'Add'}
                </Button>
                {editingId && (
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={cancelEdit}
                    startIcon={<CancelIcon />}
                  >
                    Cancel
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>

          <Stack spacing={2}>
            {users.length === 0 ? (
              <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                No users yet. Add one above!
              </Typography>
            ) : (
              users.map(user => (
                <Card key={user.id} variant="outlined" sx={{ '&:hover': { bgcolor: 'action.hover' } }}>
                  <CardContent sx={{ pb: 1 }}>
                    <Typography variant="h6" component="div">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: 'flex-end' }}>
                    <IconButton
                      color="primary"
                      onClick={() => startEdit(user)}
                      aria-label="edit"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user.id)}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              ))
            )}
          </Stack>
        </Paper>

        <Alert severity="warning">
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Setup Instructions:
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 2, '& li': { mb: 0.5 } }}>
            <li>Install json-server: <code>npm install -g json-server</code></li>
            <li>Create a <code>db.json</code> file with: <code>{`{"users": []}`}</code></li>
            <li>Run: <code>json-server --watch db.json --port 3001</code></li>
            <li>Start your React app and begin adding users!</li>
          </Box>
        </Alert>
      </Container>
    </Box>
  );
}
