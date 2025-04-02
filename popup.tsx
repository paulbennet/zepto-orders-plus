/// <reference types="chrome" />

import AppBar from '@mui/material/AppBar';
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
import Toolbar from '@mui/material/Toolbar';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import './styles.css';

// Update the Product interface to include imageUrl
interface Product {
    name: string;
    count: number;
    imageUrl: string;
    orderDates: string[];
}

const theme = createTheme({
    typography: {
        fontFamily: '"Open Sans", sans-serif',
    },
});

const App = () => {
    const [summary, setSummary] = useState<Product[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [sortConfig, setSortConfig] = useState<{ key: keyof Product; direction: 'asc' | 'desc' } | null>(null);
    const [summaryMonthYear, setSummaryMonthYear] = useState<{ month: number; year: number } | null>(null);

    const fetchSummary = () => {
        setLoading(true);
        setSortConfig(null); // Reset sorting state
        chrome.runtime.sendMessage({ action: 'fetchSummary', month: selectedMonth }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Runtime error:', chrome.runtime.lastError.message);
                setSummary(null);
                setSummaryMonthYear(null);
            } else if (response && response.success && response.data) {
                const sortedData = [...response.data].sort((a, b) => a.name.localeCompare(b.name));
                setSummary(sortedData);
                setSortConfig({ key: 'name', direction: 'asc' }); // Set default sorting state

                const currentYear = new Date().getFullYear();
                const summaryYear = selectedMonth > new Date().getMonth() ? currentYear - 1 : currentYear;
                setSummaryMonthYear({ month: selectedMonth, year: summaryYear });
            } else {
                console.error('Error fetching summary:', response?.error || 'Unknown error');
                setSummary(null);
                setSummaryMonthYear(null);
            }
            setLoading(false);
        });
    };

    const renderSortableHeader = (label: string, key: keyof Product) => (
        <TableCell onClick={() => handleSort(key)} style={{ cursor: 'pointer', fontWeight: 'bold' }}>
            {label} {sortConfig?.key === key && (sortConfig.direction === 'asc' ? '▲' : '▼')}
        </TableCell>
    );

    const handleSort = (key: keyof Product) => {
        const newSortConfig: { key: keyof Product; direction: 'asc' | 'desc' } = sortConfig?.key === key
            ? { key, direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' }
            : { key, direction: 'asc' };

        setSortConfig(newSortConfig);

        if (summary) {
            const sortedData = [...summary].sort((a, b) => {
                if (key === 'count') {
                    // Numeric comparison for count
                    return newSortConfig.direction === 'asc' ? a[key] - b[key] : b[key] - a[key];
                } else {
                    // String comparison for other keys
                    if (a[key] < b[key]) return newSortConfig.direction === 'asc' ? -1 : 1;
                    if (a[key] > b[key]) return newSortConfig.direction === 'asc' ? 1 : -1;
                    return 0;
                }
            });
            setSummary(sortedData);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth={false} style={{ padding: 0 }}>
                <CssBaseline />
                <AppBar position="sticky" style={{ width: '100%', backgroundColor: '#3f51b5' }}>
                    <Toolbar>
                        <Typography variant="h6" style={{ fontSize: "1rem", flexGrow: 1, fontWeight: 'bold' }}>
                            Zepto (Unofficial) Orders Plus
                        </Typography>
                        <Box display="flex" alignItems="center">
                            <Select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                style={{ marginRight: '8px', color: 'white', backgroundColor: '#5c6bc0', fontSize: '0.875rem', padding: '4px 8px' }}
                            >
                                <MenuItem value={new Date().getMonth()}>
                                    Current Month ({new Date().toLocaleString('default', { month: 'long' })}, {new Date().getFullYear()})
                                </MenuItem>
                                <MenuItem value={new Date().getMonth() - 1}>
                                    Previous Month ({new Date(new Date().setMonth(new Date().getMonth() - 1)).toLocaleString('default', { month: 'long' })}, {new Date().getFullYear()})
                                </MenuItem>
                            </Select>
                            <Button
                                variant="contained"
                                style={{ backgroundColor: '#ff4081', color: 'white', fontSize: '0.875rem', padding: '4px 8px' }}
                                onClick={fetchSummary}
                                disabled={loading}
                            >
                                {loading ? "Loading..." : "Fetch"}
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Grid container spacing={3} style={{ marginTop: '16px' }}>
                    <Grid>
                        {summary && (
                            <Grid container marginX={1}>
                                <>
                                    {summaryMonthYear && (
                                        <Typography variant="h6" gutterBottom>
                                            Summary for {new Date(summaryMonthYear.year, summaryMonthYear.month).toLocaleString('default', { month: 'long' })}, {summaryMonthYear.year}
                                        </Typography>
                                    )}
                                    <TableContainer component={Paper}>
                                        <Table>
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell>#</TableCell>
                                                    {renderSortableHeader('Product', 'name')}
                                                    {renderSortableHeader('Count', 'count')}
                                                    <TableCell>Ordered on Dates</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {summary.map((product, index) => {
                                                    const uniqueSortedDates = Array.from(new Set(product.orderDates.map(date => new Date(date).getDate()))).sort((a, b) => a - b).join(', ');
                                                    return (
                                                        <TableRow key={product.name} className='table-row'>
                                                            <TableCell>{index + 1}</TableCell>
                                                            <TableCell>
                                                                <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                                                                    <div>
                                                                        <img src={product.imageUrl} alt={product.name} style={{ width: '30px', marginRight: '8px', verticalAlign: 'middle', borderRadius: '5px' }} />
                                                                    </div>
                                                                    <div style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', position: 'relative' }}>
                                                                        <Tooltip title={product.name} placement="top">
                                                                            <span>{product.name}</span>
                                                                        </Tooltip>
                                                                    </div>
                                                                    <div className="copy-icon">
                                                                        <Tooltip title="Copy to clipboard" placement="top">
                                                                            <Button
                                                                                onClick={() => navigator.clipboard.writeText(product.name)}
                                                                            >
                                                                                <ContentCopyIcon />
                                                                            </Button>
                                                                        </Tooltip>
                                                                    </div>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>{product.count}</TableCell>
                                                            <TableCell>{uniqueSortedDates}</TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                </>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
};

createRoot(document.getElementById('root')!).render(<App />);
