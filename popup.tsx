/// <reference types="chrome" />

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';

// Update the Product interface to include imageUrl
interface Product {
    name: string;
    count: number;
    imageUrl: string;
}

const App = () => {
    const [summary, setSummary] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()); // Default to current month
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);

    const fetchSummary = () => {
        setLoading(true);
        chrome.runtime.sendMessage({ action: 'fetchSummary', month: selectedMonth }, (response) => {
            if (response.success && response.data) {
                setSummary(response.data);
            } else {
                console.error('Error fetching summary:', response.error);
            }
            setLoading(false);
        });
    };

    const handleSort = (key: keyof Product) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        if (summary) {
            const sortedData = [...summary].sort((a, b) => {
                if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
                if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
                return 0;
            });
            setSummary(sortedData);
        }
    };

    const renderSortableHeader = (label: string, key: keyof Product) => (
        <TableCell onClick={() => handleSort(key)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {label} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </TableCell>
    );

    return (
        <Container>
            <CssBaseline />
            <Typography variant="h4" gutterBottom>
                Zepto Orders Plus
            </Typography>
            <Grid container spacing={3}>
                <Grid>
                    <Card>
                        <CardHeader title="Select Month" />
                        <CardContent>
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                style={{ width: '100%', padding: '10px', marginBottom: '20px' }}
                            >
                                <option value={new Date().getMonth()}>Current Month</option>
                                <option value={new Date().getMonth() - 1}>Previous Month</option>
                            </select>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={fetchSummary}
                                disabled={loading}
                                fullWidth
                            >
                                {loading ? "Loading..." : "Fetch Summary"}
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid>
                    {summary && (
                        <Card>
                            <CardHeader title="Order Summary" />
                            <CardContent>
                                <TableContainer component={Paper}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>#</TableCell>
                                                {renderSortableHeader('Product', 'name')}
                                                <TableCell>Image</TableCell>
                                                {renderSortableHeader('Count', 'count')}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {summary.map((product, index) => (
                                                <TableRow key={product.name}>
                                                    <TableCell>{index + 1}</TableCell>
                                                    <TableCell>{product.name}</TableCell>
                                                    <TableCell>
                                                        <img src={product.imageUrl} alt={product.name} style={{ width: '50px' }} />
                                                    </TableCell>
                                                    <TableCell>{product.count}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    )}
                </Grid>
            </Grid>
        </Container >
    );
};

createRoot(document.getElementById('root')!).render(<App />);
