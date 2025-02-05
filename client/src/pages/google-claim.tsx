import React, { useState, useContext, useEffect } from 'react';
import { Grid, Box, Typography, Button, Backdrop, CircularProgress, Container, Paper } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import { ErrorPopup } from '@/app/components';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/router';
import SelectedIssuerContext from '@/contexts/SelectedIssuerContext';
import { requestIssueNewCredential, CredentialRequest, GoogleCredentialRequest } from '@/services/issuer';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import PreviewIcon from '@mui/icons-material/Preview';
import SendIcon from '@mui/icons-material/Send';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const GoogleClaimPage = () => {
  const router = useRouter();
  const { userID } = router.query;
  const { data: session } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { selectedIssuerContext } = useContext(SelectedIssuerContext);
  const [credentialRequest, setCredentialRequest] = useState<CredentialRequest | undefined>();
  const [walletAddress, setWalletAddress] = useState<string>('');

  // Check for wallet connection and session
  useEffect(() => {
    // Move localStorage access inside useEffect
    const savedWalletAddress = localStorage.getItem('metamaskWalletAddress');
    setWalletAddress(savedWalletAddress || '');
    
    if (!savedWalletAddress) {
      console.log('No wallet address or session found');
      router.push('/connect-wallet');
      return;
    }

    // Create credential request
    if (session?.user && !credentialRequest) {
      try {
        const cr = new GoogleCredentialRequest(
          userID as string,
          session.user.name || '',
          session.user.email || '',
          savedWalletAddress
        ).construct();
        setCredentialRequest(cr);
      } catch (error) {
        setError(`Failed to create credential request: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  }, [session, router, credentialRequest, userID]);

  const submitCredentialRequest = async () => {
    setIsLoading(true);
    try {
      if (!credentialRequest || !selectedIssuerContext) {
        throw new Error('Missing credential request or issuer');
      }

      const credentialInfo = await requestIssueNewCredential(
        selectedIssuerContext,
        credentialRequest
      );

      if (!credentialInfo?.id) {
        throw new Error('Failed to create credential');
      }
     
      router.push(`/offer?claimId=${credentialInfo.id}&issuer=${selectedIssuerContext}&subject=${userID}`);
    } catch (error) {
      setError(`Credential request failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    setIsLoading(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ minHeight: '100vh', py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {error && <ErrorPopup error={error} />}

          {/* Header Section */}
          <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
            Step 4: Review Your Credential
          </Typography>
          <Typography variant="h6" gutterBottom align="center" color="text.secondary">
            Verify and Submit Your Credential Request
          </Typography>

          {/* User Info Display */}
          <Paper elevation={1} sx={{ p: 2, my: 3, bgcolor: 'background.default' }}>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              👤 User ID: {userID}
            </Typography>
            <Typography variant="body1" align="center" sx={{ mb: 1 }}>
              ✉️ Email: {session?.user?.email}
            </Typography>
            <Typography variant="body1" align="center" sx={{ wordBreak: 'break-all' }}>
              💳 Wallet: {walletAddress}
            </Typography>
          </Paper>

          {/* Description */}
          <Typography variant="body1" paragraph sx={{ mt: 3 }}>
            You've successfully connected your wallet and Google account. 
            Please review your credential information below before submitting the request.
          </Typography>

          {/* Credential Preview */}
          {credentialRequest && (
            <Paper elevation={1} sx={{ p: 3, my: 4, bgcolor: 'background.default', borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PreviewIcon /> Credential Preview
              </Typography>
              <JSONPretty 
                id="json-pretty" 
                data={credentialRequest}
                theme={{
                  main: 'line-height:1.3;color:#66d9ef;background:transparent;overflow:auto;',
                  key: 'color:#f92672;',
                  string: 'color:#fd971f;',
                  value: 'color:#a6e22e;',
                  boolean: 'color:#ac81fe;',
                }}
              />
            </Paper>
          )}

          {/* Submit Button */}
          <Box sx={{ textAlign: 'center', my: 4 }}>
            <Button 
              onClick={submitCredentialRequest} 
              variant="contained" 
              size="large"
              disabled={isLoading || !credentialRequest}
              startIcon={<SendIcon />}
              sx={{ 
                px: 4, 
                py: 2,
                borderRadius: 2,
                fontSize: '1.1rem'
              }}
            >
              Submit Credential Request
            </Button>
          </Box>

          {/* Steps Overview */}
          <Grid container spacing={2}>
            {[
              { 
                icon: <VerifiedUserIcon />, 
                text: "Your wallet and Google account are now connected."
              },
              { 
                icon: <PreviewIcon />, 
                text: "Review your credential information above."
              },
              { 
                icon: <SendIcon />, 
                text: "Submit your request to receive your verified credential."
              },
              { 
                icon: <CheckCircleOutlineIcon />, 
                text: "Once approved, you'll be able to download your credential."
              }
            ].map((step, index) => (
              <Grid item xs={12} key={index}>
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

export default GoogleClaimPage;