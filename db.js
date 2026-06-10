// db.js - State management via localStorage

const DB_KEY = 'finglass_data';

const DEFAULT_DATA = {
    balance: 142509.80,
    transactions: [
        {
            id: "tx-1",
            date: "2026-06-10T14:32:00",
            merchant: "Whole Foods Market",
            details: "WF #12944 Austin TX",
            category: "Groceries",
            categoryIcon: "local_dining",
            amount: -142.50,
            status: "Cleared"
        },
        {
            id: "tx-2",
            date: "2026-06-09T09:00:00",
            merchant: "TechCorp Inc.",
            details: "Direct Deposit - Salary",
            category: "Income",
            categoryIcon: "payments",
            amount: 4250.00,
            status: "Cleared"
        },
        {
            id: "tx-3",
            date: "2026-06-08T19:45:00",
            merchant: "Uber Rides",
            details: "Trip to Downtown",
            category: "Transport",
            categoryIcon: "directions_car",
            amount: -24.80,
            status: "Cleared"
        },
        {
            id: "tx-4",
            date: "2026-06-07T10:15:00",
            merchant: "AWS Web Services",
            details: "Cloud Hosting Monthly",
            category: "Software",
            categoryIcon: "cloud",
            amount: -112.45,
            status: "Pending"
        },
        {
            id: "tx-5",
            date: "2026-06-05T08:30:00",
            merchant: "Starbucks",
            details: "Coffee",
            category: "Food & Drink",
            categoryIcon: "local_cafe",
            amount: -6.50,
            status: "Cleared"
        }
    ],
    budgets: {
        "Groceries": { limit: 500, spent: 650, icon: "shopping_cart", color: "error" },
        "Housing": { limit: 1500, spent: 1500, icon: "home", color: "primary" },
        "Entertainment": { limit: 300, spent: 120, icon: "movie", color: "secondary" }
    },
    savingsGoal: {
        name: "Vacation Fund",
        target: 5000,
        current: 3250,
        targetDate: "Dec 2026",
        icon: "flight_takeoff"
    }
};

// Initialize DB
function initDB() {
    const data = localStorage.getItem(DB_KEY);
    if (!data) {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        return DEFAULT_DATA;
    }
    return JSON.parse(data);
}

// Get entire data
function getDB() {
    return initDB();
}

// Save entire data
function saveDB(data) {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
    // Trigger storage event for cross-tab updates
    window.dispatchEvent(new Event('storage'));
}

// Getters & Actions
const FinGlassDB = {
    getData: () => getDB(),
    
    getTransactions: () => {
        return getDB().transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    },

    addTransaction: (tx) => {
        const db = getDB();
        const newTx = {
            id: "tx-" + Date.now(),
            date: tx.date || new Date().toISOString(),
            merchant: tx.merchant,
            details: tx.details || "",
            category: tx.category,
            categoryIcon: tx.categoryIcon || "receipt",
            amount: parseFloat(tx.amount),
            status: tx.status || "Cleared"
        };
        db.transactions.push(newTx);
        db.balance += newTx.amount;

        // If it's an expense, update corresponding budget category spent amount
        if (newTx.amount < 0) {
            const cat = newTx.category;
            if (db.budgets[cat]) {
                db.budgets[cat].spent += Math.abs(newTx.amount);
            } else {
                // Initialize default budget if category doesn't exist
                db.budgets[cat] = {
                    limit: 500,
                    spent: Math.abs(newTx.amount),
                    icon: newTx.categoryIcon,
                    color: "secondary"
                };
            }
        }

        saveDB(db);
        return newTx;
    },

    getBudgets: () => {
        return getDB().budgets;
    },

    setBudget: (category, limit, icon = "category", color = "secondary") => {
        const db = getDB();
        if (db.budgets[category]) {
            db.budgets[category].limit = parseFloat(limit);
        } else {
            db.budgets[category] = {
                limit: parseFloat(limit),
                spent: 0,
                icon: icon,
                color: color
            };
        }
        saveDB(db);
    },

    getSavingsGoal: () => {
        return getDB().savingsGoal;
    },

    updateSavingsGoal: (current, target, name, targetDate) => {
        const db = getDB();
        db.savingsGoal = {
            name: name || db.savingsGoal.name,
            target: parseFloat(target) || db.savingsGoal.target,
            current: parseFloat(current) !== undefined ? parseFloat(current) : db.savingsGoal.current,
            targetDate: targetDate || db.savingsGoal.targetDate,
            icon: db.savingsGoal.icon
        };
        saveDB(db);
    },

    resetDB: () => {
        localStorage.setItem(DB_KEY, JSON.stringify(DEFAULT_DATA));
        window.dispatchEvent(new Event('storage'));
    }
};

// Export to window object for global availability in pages
window.FinGlassDB = FinGlassDB;
