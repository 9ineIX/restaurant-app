import express from 'express';

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'client@example.com' && password === 'password123') {
    res.json({
      access_token: 'fake-token',
      refresh_token: 'fake-refresh',
      user: {
        id: 2,
        email: 'client@example.com',
        fio: 'Test Client'
      }
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});
