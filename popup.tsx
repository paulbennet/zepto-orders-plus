/// <reference types="chrome" />

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// Update the Product interface to include imageUrl
interface Product {
    name: string;
    count: number;
    imageUrl: string;
}

const App = () => {
    const [summary, setSummary] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSummary = () => {
        console.log("Sending message to content script: fetchSummary");
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'fetchSummary' }, (response: { success: boolean; data?: Product[]; error?: string }) => {
            console.log("Received response from content script:", response);
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
                <TableContainer component={Paper} style={{ marginTop: '20px' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Product Image</TableCell>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Quantity</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {summary.map((product) => (
                                <TableRow key={product.name}>
                                    <TableCell>
                                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px', height: '50px' }} />
                                    </TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.count}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
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
