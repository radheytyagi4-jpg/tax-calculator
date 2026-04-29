const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Tax Calculation Logic (Simple Progressive Tax - You can customize for your country)
function calculateTax(income) {
    if (income <= 0) return 0;
    
    let tax = 0;
    
    // Slab 1: 0 - 10,000 → 10%
    if (income > 10000) {
        tax += 10000 * 0.10;
        income -= 10000;
    } else {
        tax += income * 0.10;
        return tax;
    }
    
    // Slab 2: 10,001 - 50,000 → 20%
    if (income > 40000) {
        tax += 40000 * 0.20;
        income -= 40000;
    } else {
        tax += income * 0.20;
        return tax;
    }
    
    // Slab 3: Above 50,000 → 30%
    tax += income * 0.30;
    
    return tax;
}

// API Endpoint
app.post('/calculate', (req, res) => {
    const { income } = req.body;
    
    if (!income || income < 0) {
        return res.status(400).json({ error: "Please enter a valid income" });
    }

    const tax = calculateTax(parseFloat(income));
    const total = parseFloat(income) + tax;

    res.json({
        income: parseFloat(income),
        tax: parseFloat(tax.toFixed(2)),
        total: parseFloat(total.toFixed(2))
    });
});

// Serve Frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`🚀 Tax Calculator running on http://localhost:${PORT}`);
});