import { useState, useEffect } from 'react'
import { QRCode } from '@/app/components'
import { useRouter } from 'next/router';
import { Grid, Typography, Box, Button, Container, Paper } from '@mui/material';
import { getCredentialOffer } from '@/services/issuer';
import { ErrorPopup } from '@/app/components';
import { signOut } from "next-auth/react";
import LogoutIcon from '@mui/icons-material/Logout';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const App = () => {
    const router = useRouter();
    const routerQuery = router.query;

    const [ credentialOffer, setCredentialOffer ] = useState('')
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCredentialOffer = async () => {
            try {
                const offer = await getCredentialOffer(
                  routerQuery.issuer as string, 
                  routerQuery.subject as string,
                  routerQuery.claimId as string)
                setCredentialOffer(offer)
            } catch (error) {
                setError(`Failed to fetch credential offer: ${error}`);
            }
        }

        fetchCredentialOffer()
    }, [routerQuery])
    
    const handleLogout = async () => {
        // Clear MetaMask address from localStorage
        localStorage.removeItem('metamaskWalletAddress');
        // Clear any errors
        setError(null);
        // Sign out from Google session
        await signOut({ redirect: false });
        // Redirect to index page
        router.push('/');
    };

    return (
        <Container maxWidth="md">
            <Box sx={{ minHeight: '100vh', py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, position: 'relative' }}>
                    {/* Logout Button - moved inside Paper */}
                    <Box sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16
                    }}>
                        <Button
                            onClick={handleLogout}
                            variant="outlined"
                            color="primary"
                            size="small"
                            startIcon={<LogoutIcon />}
                            sx={{ fontWeight: 'bold' }}
                        >
                            Disconnect Wallet
                        </Button>
                    </Box>

                    {error && <ErrorPopup error={error} />}

                    {/* Header Section */}
                    <Typography variant="h4" component="h1" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        Step 5: Accept Your Verified Credential
                    </Typography>
                    <Typography variant="h6" gutterBottom align="center" color="text.secondary">
                        Complete Your Verification Process
                    </Typography>

                    {/* User Info Display */}
                    <Paper elevation={1} sx={{ p: 2, my: 3, bgcolor: 'background.default' }}>
                        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                            👤 User ID: {routerQuery.subject}
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                            ✉️ Email: {routerQuery.issuer}
                        </Typography>
                        <Typography variant="body1" align="center" sx={{ wordBreak: 'break-all' }}>
                            💳 Wallet: {localStorage.getItem('metamaskWalletAddress')}
                        </Typography>
                    </Paper>

                    {/* Description */}
                    <Typography variant="body1" paragraph sx={{ mt: 3 }}>
                        Congratulations! You're now at the final step of the self-issuance process. 
                        To complete the verification, you need to scan the QR code and accept your 
                        Verified Credential in your Polygon Wallet.
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
                        <QRCode value={JSON.stringify(credentialOffer)} />
                    </Box>

                    {/* Instructions */}
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        How to Accept Your Verified Credential:
                    </Typography>

                    <Grid container spacing={2}>
                        {[
                            {
                                icon: <AccountBalanceWalletIcon />,
                                text: "Open your Polygon Wallet on your mobile device or browser extension."
                            },
                            {
                                icon: <QrCodeScannerIcon />,
                                text: "Scan the QR Code displayed on the screen using your wallet's QR scanner."
                            },
                            {
                                icon: <VerifiedUserIcon />,
                                text: "Review the Verified Credential details to ensure everything is correct."
                            },
                            {
                                icon: <CheckCircleOutlineIcon />,
                                text: "Accept and store the credential securely in your wallet."
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
                        After accepting the credential, it will be securely stored in your wallet for future use.
                    </Typography>
                </Paper>
            </Box>
        </Container>
    );
}

export default App;