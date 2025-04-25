import React, { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

/**
 * Component that checks and displays the backend connection status
 */
const ConnectionStatusIndicator = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // Function to check if the backend is available
  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to fetch the health endpoint
      const response = await fetch('http://localhost:8080/health', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        // Short timeout to avoid long waits
        signal: AbortSignal.timeout(3000),
      });

      // If we get a response, the backend is available
      setIsConnected(response.ok);
      
      // Only show the alert if we're disconnected
      setShowAlert(!response.ok);
    } catch (error) {
      // If there's an error, the backend is unavailable
      console.warn('Backend connection check failed:', error);
      setIsConnected(false);
      setShowAlert(true);
    } finally {
      setIsChecking(false);
    }
  };

  // Check connection on component mount
  useEffect(() => {
    checkConnection();
    
    // Set up periodic checks
    const intervalId = setInterval(checkConnection, 30000); // Check every 30 seconds
    
    return () => clearInterval(intervalId);
  }, []);

  // If connected, don't show anything
  if (isConnected && !showAlert) {
    return null;
  }

  return (
    <Alert 
      variant="destructive" 
      className="fixed bottom-4 right-4 max-w-md z-50 bg-yellow-50 border-yellow-200 text-yellow-800"
    >
      <WifiOff className="h-4 w-4 text-yellow-600" />
      <AlertTitle className="text-yellow-800">Backend Server Unavailable</AlertTitle>
      <AlertDescription className="text-yellow-700">
        <p className="mb-2">
          The application is running in offline mode with limited functionality. 
          Some features may not work correctly.
        </p>
        <div className="flex justify-end gap-2 mt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
            onClick={() => setShowAlert(false)}
          >
            Dismiss
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-yellow-800 border-yellow-300 hover:bg-yellow-100"
            onClick={checkConnection}
            disabled={isChecking}
          >
            {isChecking ? 'Checking...' : 'Check Again'}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default ConnectionStatusIndicator;
