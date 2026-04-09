#!/usr/bin/env node

const http = require('http');

// Product names to delete
const productsToDelete = [
    'PLA Filament 1kg',
    'Resin 1L',
    'Dragon Miniature - High Detail Resin',
    'Custom Phone Stand - Geometric Design',
    'Articulated Flexi Rex Dinosaur',
    'Desk Organizer - Honeycomb Pattern',
    'Lithophane Photo Frame - Custom',
    'Miniature Castle Tower Set',
    'Cable Management Clips Set of 10',
    'Geometric Planter Pot - Succulent Size',
    'Mechanical Gear Fidget Cube',
    'Architectural Model - Modern House',
    'iphone 13 backcover',
    'Doll barbie',
    'e',
    'dog',
    'Desk',
    's'
];

// Admin credentials - Default admin account created on app startup
const ADMIN_EMAIL = 'admin@itp.edu';
const ADMIN_PASSWORD = 'adminpass';

// Step 0: Login and get auth token
function login() {
    return new Promise((resolve, reject) => {
        const loginData = JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/auth/login',  // Correct endpoint path
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': loginData.length
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.token) {
                        resolve(response.token);
                    } else {
                        reject(new Error(`Login failed: ${JSON.stringify(response)}`));
                    }
                } catch (e) {
                    reject(new Error(`Failed to parse login response: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(loginData);
        req.end();
    });
}

// Step 1: Get all products
function getAllProducts() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8080/api/products', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        });
        req.on('error', reject);
    });
}

// Step 2: Delete product by ID
function deleteProduct(id, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: `/api/products/${id}`,
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(res.statusCode));
        });

        req.on('error', reject);
        req.end();
    });
}

// Main execution
async function main() {
    try {
        console.log('Logging in as admin...');
        const token = await login();
        console.log('✓ Login successful');

        console.log('Fetching all products...');
        const allProducts = await getAllProducts();
        console.log(`Found ${allProducts.length} products`);

        let deletedCount = 0;
        for (const product of allProducts) {
            if (productsToDelete.includes(product.name)) {
                console.log(`Deleting: ${product.name} (ID: ${product.id})`);
                const status = await deleteProduct(product.id, token);
                if (status === 200) {
                    console.log(`✓ Deleted successfully`);
                    deletedCount++;
                } else {
                    console.log(`✗ Failed to delete (Status: ${status})`);
                }
            }
        }

        console.log(`\n✓ Successfully deleted ${deletedCount} products`);
    } catch (error) {
        console.error('Error:', error.message);
        console.error('\n⚠️ If login failed, please update the admin credentials in the script:');
        console.error('   ADMIN_EMAIL and ADMIN_PASSWORD variables');
        process.exit(1);
    }
}

main();
