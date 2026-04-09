#!/usr/bin/env node

const http = require('http');

// Admin credentials
const ADMIN_EMAIL = 'admin@itp.edu';
const ADMIN_PASSWORD = 'adminpass';

// Step 0: Login
function login() {
    return new Promise((resolve, reject) => {
        const loginData = JSON.stringify({
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD
        });

        const options = {
            hostname: 'localhost',
            port: 8080,
            path: '/api/auth/login',
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
                    reject(new Error(`Failed to parse response: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.write(loginData);
        req.end();
    });
}

// Get all STL orders
function getAllStlOrders() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8080/api/stl-orders/admin', (res) => {
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

// Delete individual STL order
function deleteStlOrder(id, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 8080,
            path: `/api/stl-orders/admin/${id}`,
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

// Get all shop orders
function getAllShopOrders() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:8080/api/orders/admin', (res) => {
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

// Main execution
async function main() {
    try {
        console.log('🔐 Logging in as admin...');
        const token = await login();
        console.log('✓ Login successful\n');

        // Get and delete STL orders
        console.log('📊 Fetching all STL orders...');
        const stlOrders = await getAllStlOrders();
        console.log(`Found ${stlOrders.length} STL orders\n`);

        if (stlOrders.length > 0) {
            console.log('🗑️  Deleting STL orders...');
            let deletedStl = 0;
            for (const order of stlOrders) {
                const status = await deleteStlOrder(order.id, token);
                if (status === 200) {
                    console.log(`✓ Deleted STL order ID: ${order.id}`);
                    deletedStl++;
                } else {
                    console.log(`✗ Failed to delete STL order ID: ${order.id} (Status: ${status})`);
                }
            }
            console.log(`\n✓ Successfully deleted ${deletedStl} STL orders\n`);
        }

        // Get shop orders info
        console.log('📊 Fetching all shop orders...');
        const shopOrders = await getAllShopOrders();
        console.log(`Found ${shopOrders.length} shop orders\n`);

        if (shopOrders.length > 0) {
            console.log('⚠️  Shop orders cannot be deleted via API (no delete endpoint exists)\n');
            console.log('📝 To clear shop orders, run these SQL commands:\n');
            console.log('mysql -u root -p ceylon3d << EOF');
            console.log('SET FOREIGN_KEY_CHECKS = 0;');
            console.log('DELETE FROM order_items;');
            console.log('DELETE FROM orders;');
            console.log('SET FOREIGN_KEY_CHECKS = 1;');
            console.log('EOF\n');
            console.log('Or use MySQL GUI and run:');
            console.log('TRUNCATE TABLE order_items;');
            console.log('TRUNCATE TABLE orders;');
        }

        console.log('✅ STL order cleanup complete!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

main();
