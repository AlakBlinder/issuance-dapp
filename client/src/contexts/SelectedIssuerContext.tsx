import React, { createContext, useState, useEffect, ReactNode } from 'react';

interface SelectedIssuerContextProps {
    selectedIssuerContext: string;
    setSelectedIssuerContext: (value: string) => void;
}

const SelectedIssuerContext = createContext<SelectedIssuerContextProps>({
    selectedIssuerContext: '',
    setSelectedIssuerContext: () => {},
});

interface ProviderProps {
    children: ReactNode;
}

export const SelectedIssuerProvider = ({ children }: ProviderProps) => {
    const [selectedIssuerContext, setSelectedIssuerContextState] = useState<string>('');

    // Add debug logging in the initial load
    useEffect(() => {
        const savedIssuer = localStorage.getItem('selectedIssuer');
        console.log('Initial load - savedIssuer from localStorage:', savedIssuer);
        if (savedIssuer) {
            setSelectedIssuerContextState(savedIssuer);
        }
    }, []);

    // Add debug logging in the setter
    const setSelectedIssuerContext = (value: string) => {
        console.log('Setting new issuer value:', value);
        setSelectedIssuerContextState(value);
        if (value) {
            localStorage.setItem('selectedIssuer', value);
        } else {
            localStorage.removeItem('selectedIssuer');
        }
    };

    console.log('Current selectedIssuerContext in provider:', selectedIssuerContext);

    return (
        <SelectedIssuerContext.Provider value={{ selectedIssuerContext, setSelectedIssuerContext }}>
            {children}
        </SelectedIssuerContext.Provider>
    );
};

export default SelectedIssuerContext;
