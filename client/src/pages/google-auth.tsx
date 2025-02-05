import React, { useState, useContext, useEffect } from 'react';
import { Grid, Box, Typography, Button, Backdrop, CircularProgress, Container, Paper } from '@mui/material';
import { ErrorPopup } from '@/app/components';
import { signIn, useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import SelectedIssuerContext from '@/contexts/SelectedIssuerContext';
import GoogleIcon from '@mui/icons-material/Google';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LinkIcon from '@mui/icons-material/Link';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const GoogleAuthPage = () => {
  const router = useRouter();
  const { userID } = router.query;
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const { selectedIssuerContext } = useContext(SelectedIssuerContext);

  // Check for wallet connection
  useEffect(() => {
    if (typeof window !== 'undefined') {  // Check if running in browser
      const savedWalletAddress = localStorage.getItem('metamaskWalletAddress');
      setWalletAddress(savedWalletAddress || '');
      if (!savedWalletAddress) {
        router.push('/connect-wallet');
      }
    }
  }, [router]);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { 
        redirect: true,
        callbackUrl: `/google-claim?userID=${userID}`  // This will be the final step
      });
    } catch (error) {
      setError(`Google sign-in failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {error && <ErrorPopup error={error} />}

          {/* Header Section */}
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Step 3: Link Your Google Account
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Connect Your Social Identity
          </Typography>

          {/* User Info Display */}
          <Paper elevation={1} sx={{ p: 2, my: 3, bgcolor: 'background.default' }}>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              👤 User ID: {userID}
            </Typography>
            <Typography variant="body1" align="center" sx={{ wordBreak: 'break-all' }}>
              💳 Wallet: {walletAddress}
            </Typography>
          </Paper>

          {/* Description */}
          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            Now that your wallet is connected, let's link your Google account. 
            This step creates a verifiable connection between your Web3 wallet and your Google identity.
          </Typography>

          {/* Google Sign In Button */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button 
              onClick={handleGoogleSignIn} 
              variant="contained" 
              size="large"
              disabled={isLoading}
              startIcon={<GoogleIcon />}
              sx={{ 
                px: 4, 
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem'
              }}
            >
              Sign in with Google
            </Button>
          </Box>

          {/* Instructions */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            What Happens Next:
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { 
                icon: <GoogleIcon />, 
                text: "Click the 'Sign in with Google' button above."
              },
              { 
                icon: <AccountCircleIcon />, 
                text: "Select or sign into your Google account."
              },
              { 
                icon: <LinkIcon />, 
                text: "Approve the connection between your wallet and Google account."
              },
              { 
                icon: <CheckCircleOutlineIcon />, 
                text: "Review and confirm your credential information."
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
            After connecting your Google account, you'll be able to review and confirm your credential information.
          </Typography>

          <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </Paper>
      </Box>
    </Container>
  );
};

export default GoogleAuthPage; 