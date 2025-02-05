import { useState, useEffect, useContext } from 'react';
import { QRCode, ErrorPopup } from '@/app/components';
import { useRouter } from 'next/router';
import { Typography, Container, Paper, Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import SelectedIssuerContext from '@/contexts/SelectedIssuerContext';
import { produceAuthQRCode, checkAuthSessionStatus } from '@/services/issuer';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

/**
 * SignIn Page Component
 * Handles QR code-based authentication flow using PolygonID
 */
const MyPage = () => {
  // Initialize Next.js router for programmatic navigation
  const router = useRouter();

  // Access the selected issuer from global context
  const { selectedIssuerContext } = useContext(SelectedIssuerContext);

  // State management for the authentication flow
  const [qrCodeData, setQrCodeData] = useState({}); // Stores the QR code content
  const [sessionID, setSessionID] = useState(''); // Tracks the current auth session
  const [error, setError] = useState<string | null>(null); // Manages error states

  /**
   * Effect hook for QR code generation
   * Runs when the component mounts and when selectedIssuerContext changes
   */
  useEffect(() => {
    // Redirect to home if no issuer is selected
    if (!selectedIssuerContext) {
      router.push('/');
      return;
    }

    /**
     * Fetches authentication QR code from the server
     * Sets up the session and QR code data
     */
    const fetchAuthQRCode = async () => {
      try {
        const { sessionId, data } = await produceAuthQRCode(selectedIssuerContext);
        setQrCodeData(data);
        setSessionID(sessionId);
      } catch (error) {
        setError(`Failed to fetch QR code: ${error}`);
      }
    };

    fetchAuthQRCode();
  }, [selectedIssuerContext, router]);

  /**
   * Effect hook for polling authentication status
   * Checks every 2 seconds if the user has authenticated via the mobile app
   */
  useEffect(() => {
    // Don't start polling if session ID is not available
    if (!sessionID) {
      return;
    }

    let interval: NodeJS.Timeout;

    /**
     * Checks the current authentication session status
     * Redirects to claim page if authentication is successful
     */
    const checkStatus = async () => {
      try {
        const response = await checkAuthSessionStatus(sessionID);
        if (response && response.id !== null) {
          clearInterval(interval); // Stop polling once authenticated
          router.push(`/connect-wallet?userID=${response.id}`); // Redirect to claim page
        }
      } catch (error) {
        setError(`Failed to check session status: ${error}`);
      }
    };

    // Start polling every 2 seconds
    interval = setInterval(checkStatus, 2000);
    
    // Cleanup function to clear interval when component unmounts
    return () => clearInterval(interval);
  }, [sessionID, router]);

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {error && <ErrorPopup error={error} />}

          {/* Header Section */}
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Step 1: Scan the QR Code
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Authenticate Using Polygon Wallet
          </Typography>

          {/* Description */}
          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            To begin the self-issuance process, you need to authenticate using your Polygon Wallet. 
            This step establishes a secure connection between your decentralized identity and the Issuance DApp.
          </Typography>

          {/* QR Code Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            my: 4,
            p: 3,
            bgcolor: 'background.default',
            borderRadius: 2
          }}>
            <QRCode value={JSON.stringify(qrCodeData)}/>
          </Box>

          {/* Instructions */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            How to Authenticate:
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { 
                icon: <PhoneAndroidIcon />, 
                text: "Open your Polygon Wallet on your mobile device or browser extension."
              },
              { 
                icon: <QrCodeScannerIcon />, 
                text: "Scan the QR Code displayed on the screen using your wallet's QR scanner."
              },
              { 
                icon: <CheckCircleOutlineIcon />, 
                text: "Approve the authentication request to verify your identity securely."
              }
            ].map((step, index) => (
              <Grid xs={12} key={index}>
                <Paper elevation={1} sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 2,
                  bgcolor: 'background.default'
                }}>
                  {step.icon}
                  <Typography variant="body1">
                    {`${index + 1}️⃣ ${step.text}`}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Additional Info */}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 4, textAlign: 'center' }}>
            Once authenticated, you'll automatically proceed to the next step.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default MyPage;