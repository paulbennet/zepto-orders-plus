/// <reference types="chrome" />

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Define TypeScript types for the API response
interface Product {
    name: string;
    count: number;
}

const App = () => {
    const [summary, setSummary] = useState<Record<string, number> | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSummary = () => {
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'fetchSummary' }, (response: { success: boolean; data?: Record<string, number>; error?: string }) => {
            if (response.success && response.data) {
                setSummary(response.data);
            } else {
                console.error('Error fetching summary:', response.error);
            }
            setLoading(false);
        });
    };

    return (
        <Container>
            <CssBaseline />
            <Typography variant="h4" gutterBottom>
                Zepto Orders Plus
            </Typography>
            <Button variant="contained" color="primary" onClick={fetchSummary} disabled={loading}>
                {loading ? 'Fetching...' : 'Fetch Summary'}
            </Button>
            {summary && (
                <div>
                    <Typography variant="h6" gutterBottom>
                        Product Summary for Current Month
                    </Typography>
                    <ul>
                        {Object.entries(summary).map(([product, count]: [string, number]) => (
                            <li key={product}>{product}: {count}</li>
                        ))}
                    </ul>
                </div>
            )}
        </Container>
    );
};

const rootElement = document.getElementById('root');

if (rootElement) {
    const root = createRoot(rootElement);
    root.render(<App />);
} else {
    console.error("Root element not found");
}
