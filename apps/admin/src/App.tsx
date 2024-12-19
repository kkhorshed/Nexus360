import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './features/auth/AuthProvider';
import { TestProfilePicture } from './features/users/components/TestProfilePicture';
import { Box, Typography, Button } from '@mui/material';

const Home = () => (
  <Box sx={{ p: 4, textAlign: 'center' }}>
    <Typography variant="h4" gutterBottom>
      Profile Picture Test Page
    </Typography>
    <Button 
      component={Link} 
      to="/test-photo" 
      variant="contained" 
      color="primary"
      sx={{ mt: 2 }}
    >
      Go to Photo Test
    </Button>
  </Box>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test-photo" element={<TestProfilePicture />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
