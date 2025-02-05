import React, { useContext } from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box, Button, Typography, Paper, Container } from '@mui/material';
import SelectedIssuerContext from '@/contexts/SelectedIssuerContext';
import { useRouter } from 'next/router';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GoogleIcon from '@mui/icons-material/Google';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';

const HARDCODED_ISSUER = "did:iden3:polygon:amoy:x6x5sor7zpxhPBRFEZXv8dKoxpEibsDHHhFAaCbne";

const App = () => {
    const router = useRouter();
    const { setSelectedIssuerContext } = useContext(SelectedIssuerContext);

    const handleSelfIssue = () => {
        setSelectedIssuerContext(HARDCODED_ISSUER);
        router.push('/signin');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    {/* Header Section */}
                    <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        Welcome to Issuance DApp
                    </Typography>
                    <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                        Your Gateway to Verified Credentials!
                    </Typography>

                    {/* Subtitle */}
                    <Typography variant="h5" gutterBottom align="center" sx={{ mt: 4, mb: 2 }}>
                        Seamlessly Link Your Wallet and Social Login
                    </Typography>

                    {/* Welcome Message */}
                    <Typography variant="body1" paragraph>
                        Hello User,
                    </Typography>
                    <Typography variant="body1" paragraph>
                        We're excited to have you here! The Issuance DApp is designed to help you self-issue a verified credential that securely links your wallet address and social login (Google).
                    </Typography>
                    <Typography variant="body1" paragraph>
                        This process ensures seamless authentication and enhanced security, allowing you to establish a trusted digital identity.
                    </Typography>

                    {/* Steps Section */}
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        Follow These Simple Steps to Get Started:
                    </Typography>
                    <Grid container spacing={2}>
                        {[
                            { icon: <QrCodeScannerIcon />, text: "Scan the QR Code - Authenticate using Polygon Wallet by scanning the QR code with your mobile device." },
                            { icon: <AccountBalanceWalletIcon />, text: "Connect Your MetaMask - Securely connect your MetaMask wallet to the DApp." },
                            { icon: <GoogleIcon />, text: "Link Your Social Account (Google) - Authenticate your Google account to establish a secure link." },
                            { icon: <VerifiedUserIcon />, text: "Issue Your Verified Credential - Generate your Verified Credential proving ownership." }
                        ].map((step, index) => (
                            <Grid xs={12} md={6} key={index}>
                                <Paper elevation={1} sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center', gap: 2 }}>
                                    {step.icon}
                                    <Typography variant="body2">{step.text}</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Benefits Section */}
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        Why Use Issuance DApp?
                    </Typography>
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="body1" paragraph>
                            🔹 Decentralized & Secure – Your credentials are issued securely using blockchain technology.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            🔹 Self-Sovereign Identity – You control your identity without relying on third parties.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            🔹 Interoperability – Use your verified credential across various applications and platforms.
                        </Typography>
                    </Box>

                    {/* CTA Button */}
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Button 
                            variant="contained" 
                            color="primary"
                            size="large"
                            onClick={handleSelfIssue}
                            sx={{ 
                                px: 4, 
                                py: 2,
                                borderRadius: 2,
                                fontSize: '1.1rem',
                                boxShadow: 3,
                                '&:hover': {
                                    boxShadow: 6,
                                }
                            }}
                        >
                            Start Now - Self Issue Verified Credential 🚀
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default App;
