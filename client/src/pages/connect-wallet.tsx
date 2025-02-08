import React, { useState, useContext } from 'react';
import { Grid, Box, Typography, Button, Backdrop, CircularProgress, Container, Paper } from '@mui/material';
import { ErrorPopup } from '@/app/components';
import { selectMetamaskWallet } from '@/services/metamask';
import { useRouter } from 'next/router';
import SelectedIssuerContext from '@/contexts/SelectedIssuerContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SecurityIcon from '@mui/icons-material/Security';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const ConnectWalletPage = () => {
  const router = useRouter();
  const { userID } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [metamaskWalletAddress, setMetamaskWalletAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedIssuerContext } = useContext(SelectedIssuerContext);

  const connectMetamask = async () => {
    // Show loading spinner while connecting
    setIsLoading(true);
    try {
      // Check if MetaMask is installed in the browser
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed');
      }

      // Attempt to connect to MetaMask and get the wallet address
      const wallet = await selectMetamaskWallet();
      
      // Update state with the connected wallet address
      setMetamaskWalletAddress(wallet.address);
      
      // Store wallet address in localStorage for persistence
      localStorage.setItem('metamaskWalletAddress', wallet.address);
    } catch (error) {
      // Handle any errors during connection and display user-friendly message
      setError(`Wallet connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    // Hide loading spinner after connection attempt (whether successful or not)
    setIsLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {error && <ErrorPopup error={error} />}

          {/* Header Section */}
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Step 2: Connect Your MetaMask Wallet
          </Typography>
          {userID && (
            <Typography variant="subtitle1" align="center" color="text.secondary" sx={{ mb: 2 }}>
              Welcome, User #{userID}! 🎉
            </Typography>
          )}
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Link Your Wallet for Verification
          </Typography>

          {/* Description */}
          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            Now that you've started the verification process, the next step is to connect your MetaMask wallet. 
            This ensures your wallet address is securely linked to your verified credential, allowing seamless 
            interactions across Web3 applications.
          </Typography>

          {/* Wallet Connection Section */}
          {(!metamaskWalletAddress || metamaskWalletAddress === '') ? (
            <Box sx={{ textAlign: 'center', my: 4 }}>
              <Button 
                onClick={connectMetamask} 
                variant="contained" 
                size="large"
                disabled={isLoading}
                startIcon={<AccountBalanceWalletIcon />}
                sx={{ 
                  px: 4, 
                  py: 2,
                  borderRadius: 2,
                  fontSize: '1.1rem'
                }}
              >
                Connect MetaMask Wallet
              </Button>
            </Box>
          ) : (
            <Box>
              <Paper elevation={1} sx={{ p: 2, my: 4, bgcolor: 'background.default' }}>
                <Typography variant="body1" align="center" sx={{ wordBreak: 'break-all' }}>
                  ✅ Wallet Connected: {metamaskWalletAddress}
                </Typography>
              </Paper>
              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Button
                  onClick={() => router.push(`/google-auth?userID=${userID}`)}
                  variant="contained"
                  size="large"
                  color="primary"
                  sx={{
                    px: 4,
                    py: 2,
                    borderRadius: 2,
                    fontSize: '1.1rem'
                  }}
                >
                  Go To Step 3
                </Button>
              </Box>
            </Box>
          )}

          {/* Instructions */}
          <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
            How to Connect Your MetaMask Wallet:
          </Typography>
          
          <Grid container spacing={2}>
            {[
              { 
                icon: <AccountBalanceWalletIcon />, 
                text: "Click on the 'Connect Wallet' Button displayed on the screen."
              },
              { 
                icon: <SecurityIcon />, 
                text: "Select MetaMask from the available wallet options."
              },
              { 
                icon: <CheckCircleOutlineIcon />, 
                text: "Approve the Connection Request in your MetaMask extension or mobile app."
              },
              { 
                icon: <VerifiedUserIcon />, 
                text: "Confirm Your Wallet Address – Ensure you're using the correct wallet for verification."
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
            Once your wallet is connected, you'll be able to proceed with linking your Google account.
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

export default ConnectWalletPage; 