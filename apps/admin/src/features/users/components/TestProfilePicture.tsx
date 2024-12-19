import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Button } from '@mui/material';
import { useAuth } from '../../auth/hooks';

export const TestProfilePicture = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { getAuthHeaders } = useAuth();

  const fetchPhoto = async () => {
    try {
      setLoading(true);
      setError(null);
      setDebugInfo('Starting photo fetch...');

      // First check if auth service is running
      try {
        const healthCheck = await fetch('http://localhost:3001/health');
        if (!healthCheck.ok) {
          throw new Error('Auth service health check failed');
        }
      } catch (err) {
        setDebugInfo('Auth service appears to be down. Please ensure it is running on port 3001');
        throw new Error('Auth service is not running. Please start the auth service (cd services/auth-service && npm run dev)');
      }

      // Get auth headers
      const headers = await getAuthHeaders();
      setDebugInfo(prev => prev + '\nGot auth headers');
      console.log('Auth headers:', {
        ...headers,
        Authorization: headers.Authorization ? '[REDACTED]' : undefined
      });

      // Get user photo URL
      try {
        const userResponse = await fetch('http://localhost:3001/api/users/test/photo-url?email=k.khorshed@cequens.com', {
          headers
        });
        
        if (!userResponse.ok) {
          const text = await userResponse.text();
          console.error('Error response:', text);
          throw new Error(`Failed to get photo URL: ${userResponse.status} ${userResponse.statusText}`);
        }

        const userData = await userResponse.json();
        setDebugInfo(prev => prev + '\nGot user data: ' + JSON.stringify(userData, null, 2));

        if (!userData.photoUrl) {
          throw new Error('No photo URL returned');
        }

        // Now fetch the actual photo
        const photoResponse = await fetch(userData.photoUrl, {
          headers,
          credentials: 'include'
        });

        setDebugInfo(prev => prev + '\nPhoto response status: ' + photoResponse.status);

        if (!photoResponse.ok) {
          throw new Error(`Failed to fetch photo: ${photoResponse.status}`);
        }

        const blob = await photoResponse.blob();
        setDebugInfo(prev => prev + '\nGot photo blob: ' + blob.size + ' bytes');

        const url = URL.createObjectURL(blob);
        setPhotoUrl(url);
      } catch (err) {
        console.error('API Error:', err);
        throw new Error(`API Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error fetching photo:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch photo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhoto();

    return () => {
      if (photoUrl) {
        URL.revokeObjectURL(photoUrl);
      }
    };
  }, [getAuthHeaders]);

  return (
    <Box sx={{ p: 4, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Test Profile Picture
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        User: k.khorshed@cequens.com
      </Typography>

      <Box sx={{ mt: 2 }}>
        {loading ? (
          <Box>
            <CircularProgress />
            <Typography variant="body2" sx={{ mt: 1 }}>
              Loading photo...
            </Typography>
          </Box>
        ) : error ? (
          <Box>
            <Typography color="error" gutterBottom>{error}</Typography>
            <Button 
              variant="contained" 
              onClick={() => fetchPhoto()}
              sx={{ mt: 2 }}
            >
              Retry
            </Button>
          </Box>
        ) : photoUrl ? (
          <Box>
            <img 
              src={photoUrl} 
              alt="Profile" 
              style={{ 
                width: 200, 
                height: 200, 
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #ccc'
              }} 
            />
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              Photo loaded successfully
            </Typography>
          </Box>
        ) : (
          <Typography>No photo available</Typography>
        )}
      </Box>

      <Box sx={{ mt: 4, textAlign: 'left' }}>
        <Typography variant="h6" gutterBottom>Debug Info:</Typography>
        <pre style={{ 
          background: '#f5f5f5', 
          padding: 16, 
          borderRadius: 4,
          overflow: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          Status: {loading ? 'Loading...' : error ? `Error: ${error}` : 'Success'}
          {'\n\n'}
          Debug Log:
          {debugInfo}
        </pre>
      </Box>
    </Box>
  );
};
