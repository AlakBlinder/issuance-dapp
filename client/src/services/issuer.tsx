import axios from 'axios';

const OnchainIssuerNodeHost = process.env.NEXT_PUBLIC_ISSUER_URL || 'http://localhost:8080';

interface ApiError extends Error {
    response?: {
        status: number;
    };
}

export async function getIssuersList(): Promise<string[]> {
    try {
        const response = await axios.get<string[]>(`${OnchainIssuerNodeHost}/api/v1/issuers`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

interface AuthQRCodeResponse {
    data: any;
    sessionId: string;
}

/**
 * Generates a QR code for authentication with a specified issuer
 * @param issuer - The DID or identifier of the issuer to authenticate with
 * @returns Promise containing the QR code data and session ID for tracking auth status
 */
export async function produceAuthQRCode(issuer: string): Promise<AuthQRCodeResponse> {
    try {
        // Validate that issuer parameter is provided
        if (!issuer) {
            throw new Error('Issuer is not defined');
        }

        // Construct the authentication request URL
        const url = new URL(`${OnchainIssuerNodeHost}/api/v1/requests/auth`);
        // Add issuer as a query parameter
        url.search = new URLSearchParams({ issuer: issuer }).toString();

        // Make GET request to generate auth QR code
        const response = await axios.get<any>(url.toString());

        // Return both the QR code data and the session ID from headers
        return {
            data: response.data,      // Contains QR code data
            sessionId: response.headers['x-id'], // Unique session ID for tracking auth status
        };
    } catch (error) {
        throw error;
    }
}

interface AuthSessionStatusResponse {
    id: string;
}

export async function checkAuthSessionStatus(sessionId: string): Promise<AuthSessionStatusResponse | null> {
    try {
        const url = new URL(`${OnchainIssuerNodeHost}/api/v1/status`);
        url.search = new URLSearchParams({ id: sessionId }).toString();
        const response = await axios.get<any>(url.toString());
        return {
            id: response.data.id,
        };
    } catch (error) {
        const apiError = error as ApiError;
        if (apiError.response && apiError.response.status === 404) {
            return null;
        }
        throw error;
    }
}

export interface CredentialRequest {
    credentialSchema: string;
    type: string;
    credentialSubject: {
        id: string;
        name?: string;
        email?: string;
        balance?: number;
        walletAddress?: string;
    };
    expiration: number;
}

export class GoogleCredentialRequest {
    private credentialSchema: string = 'ipfs://QmPTH4svBrpsJgm8njs8LeVoKvNXJwbJgoHKS3HqAuSsSn';
    private type: string = 'SocialCredential';
    private id: string;
    private name: string;
    private email: string;
    private walletAddress: string;
    private expiration: number;

    constructor(id: string, name: string, email: string, walletAddress: string, expiration?: number) {
        if (!id) throw new Error('ID is required');
        if (!name) throw new Error('Name is required');
        if (!email) throw new Error('Email is required');
        if (!walletAddress) throw new Error('Wallet address is required');
        this.id = id;
        this.name = name;
        this.email = email;
        this.walletAddress = walletAddress;
        this.expiration = expiration || 1746494466;
    }

    construct(): CredentialRequest {
        return {
            credentialSchema: this.credentialSchema,
            type: this.type,
            credentialSubject: {
                id: this.id,
                name: this.name,
                email: this.email,
                walletAddress: this.walletAddress,
            },
            expiration: this.expiration || Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90,
        };
    }
}

export class CredentialBalanceRequest {
    private credentialSchema: string = 'ipfs://QmbgBjetG5V6DecQXTRrJ7s239b4aLydpjgB5Q6tiyZyUi';
    private type: string = 'BalanceCredential';
    private id: string;
    private balance: number;
    private expiration: number;

    constructor(id: string, balance: BigInt, expiration?: number) {
        this.id = id;
        this.balance = Number(balance);
        this.expiration = expiration || Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 90;
    }

    construct(): CredentialRequest {
        return {
            credentialSchema: this.credentialSchema,
            type: this.type,
            credentialSubject: {
                id: this.id,
                balance: this.balance,
            },
            expiration: this.expiration,
        };
    }
}

interface NewCredentialResponse {
    id: string;
}

export async function requestIssueNewCredential(issuerDid: string, credentialRequest: CredentialRequest): Promise<NewCredentialResponse> {
    try {
        const response = await axios.post<any>(
            `${OnchainIssuerNodeHost}/api/v1/identities/${issuerDid}/claims`,
            credentialRequest // JSON payload
        );
        return {
            id: response.data.id,
        };
    } catch (error) {
        throw error;
    }
}

export async function getCredentialOffer(issuerDid: string, subjectDid: string, claimId: string): Promise<any> {
    try {
        const response = await axios.get<any>(
            `${OnchainIssuerNodeHost}/api/v1/identities/${issuerDid}/claims/offer?subject=${subjectDid}&claimId=${claimId}`
        );
        return response.data;
    } catch (error) {
        throw error;
    }
}