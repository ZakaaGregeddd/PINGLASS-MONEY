// app.js - Shared UI and logic across all pages

document.addEventListener('DOMContentLoaded', () => {
    // 1. Setup Navigation Links
    setupNavigation();

    // 2. Inject and Setup Add Transaction Modal
    setupTransactionModal();

    // 3. Listen for Storage Changes to Refresh UI if needed
    window.addEventListener('storage', () => {
        if (typeof renderPage === 'function') {
            renderPage();
        }
    });
});

// Setup nav links to point to exact files and highlight the current page
function setupNavigation() {
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

    // Desktop & Mobile Nav Links
    const navItems = [
        { text: 'Overview', file: 'index.html', icon: 'dashboard' },
        { text: 'Dashboard', file: 'index.html', icon: 'dashboard' },
        { text: 'History', file: 'transactions.html', icon: 'receipt_long' },
        { text: 'Transactions', file: 'transactions.html', icon: 'receipt_long' },
        { text: 'Budgets', file: 'budget.html', icon: 'account_balance_wallet' },
        { text: 'Reports', file: 'analytics.html', icon: 'query_stats' },
        { text: 'Analytics', file: 'analytics.html', icon: 'query_stats' },
        { text: 'Settings', file: '#', icon: 'settings' }
    ];

    // Select all <a> tags that have navigation names and point them to correct files
    const links = document.querySelectorAll('nav a, aside a, ul li a');
    links.forEach(link => {
        const spanText = link.querySelector('span:not(.material-symbols-outlined)');
        if (spanText) {
            const text = spanText.textContent.trim();
            const matchingItem = navItems.find(item => item.text.toLowerCase() === text.toLowerCase());
            if (matchingItem) {
                link.href = matchingItem.file;

                // Highlight active link if file matches
                const isItemActive = matchingItem.file === pageName || 
                                     (pageName === 'index.html' && matchingItem.file === 'index.html') ||
                                     (pageName === '' && matchingItem.file === 'index.html');
                
                if (isItemActive && matchingItem.file !== '#') {
                    // Reset existing classes to highlight active correctly
                    link.className = "flex items-center gap-3 px-3 py-2.5 rounded-lg bg-secondary/10 text-secondary dark:text-secondary-fixed-dim border-l-4 border-secondary translate-x-1 duration-200";
                    const icon = link.querySelector('.material-symbols-outlined');
                    if (icon) {
                        icon.style.variationSettings = "'FILL' 1";
                    }
                } else {
                    // Keep standard hover classes for inactive
                    if (!link.classList.contains('text-secondary')) {
                        link.className = "flex items-center gap-3 px-3 py-2.5 rounded-lg text-on-surface-variant dark:text-on-surface-variant hover:bg-white/5 hover:text-on-surface transition-all group";
                    }
                }
            }
        }
    });

    // Sign out functionality
    const signOutLinks = Array.from(document.querySelectorAll('a')).filter(a => a.textContent.includes('Sign Out'));
    signOutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            if (confirm("Reset application data to defaults?")) {
                window.FinGlassDB.resetDB();
                window.location.reload();
            }
        });
    });
}

// Global modal builder and event binding
function setupTransactionModal() {
    // Create Modal HTML structure
    const modalHTML = `
    <div id="add-tx-modal" class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div class="glass-card rounded-2xl w-full max-w-lg p-md md:p-lg border border-white/10 shadow-2xl relative overflow-hidden bg-surface-container-high/90">
            <!-- Glow background -->
            <div class="absolute -top-12 -right-12 w-32 h-32 bg-secondary/15 rounded-full blur-2xl pointer-events-none"></div>
            
            <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                <h3 class="text-headline-md font-headline-md text-on-surface flex items-center gap-2">
                    <span class="material-symbols-outlined text-secondary">add_circle</span>
                    Add Transaction
                </h3>
                <button id="close-tx-modal" class="text-on-surface-variant hover:text-on-surface p-1 rounded-full hover:bg-white/5 transition-all">
                    <span class="material-symbols-outlined">close</span>
                </button>
            </div>

            <form id="tx-form" class="space-y-sm">
                <div>
                    <label class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Type</label>
                    <div class="grid grid-cols-2 gap-sm">
                        <button type="button" id="btn-expense" class="py-2.5 rounded-xl border border-secondary bg-secondary/15 text-secondary font-label-sm font-semibold transition-all">
                            Expense
                        </button>
                        <button type="button" id="btn-income" class="py-2.5 rounded-xl border border-white/10 hover:border-secondary/50 text-on-surface-variant font-label-sm transition-all">
                            Income
                        </button>
                    </div>
                    <input type="hidden" id="tx-type" value="expense">
                </div>

                <div>
                    <label for="tx-merchant" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Merchant / Source</label>
                    <input type="text" id="tx-merchant" required placeholder="e.g. Whole Foods Market, Salary" 
                           class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                </div>

                <div class="grid grid-cols-2 gap-sm">
                    <div>
                        <label for="tx-amount" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Amount ($)</label>
                        <input type="number" id="tx-amount" step="0.01" required placeholder="0.00"
                               class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                    </div>
                    <div>
                        <label for="tx-category" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Category</label>
                        <select id="tx-category" class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                            <option value="Groceries">Groceries</option>
                            <option value="Housing">Housing</option>
                            <option value="Entertainment">Entertainment</option>
                            <option value="Transport">Transport</option>
                            <option value="Software">Software</option>
                            <option value="Food & Drink">Food & Drink</option>
                            <option value="Bills">Bills</option>
                            <option value="Income">Income</option>
                        </select>
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-sm">
                    <div>
                        <label for="tx-date" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Date</label>
                        <input type="datetime-local" id="tx-date" required
                               class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                    </div>
                    <div>
                        <label for="tx-status" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Status</label>
                        <select id="tx-status" class="w-full bg-surface-container-high border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                            <option value="Cleared">Cleared</option>
                            <option value="Pending">Pending</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label for="tx-details" class="block text-label-sm font-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Details / Note</label>
                    <input type="text" id="tx-details" placeholder="Optional notes"
                           class="w-full bg-surface-container border border-white/10 rounded-xl px-4 py-2.5 font-body-md text-on-surface focus:border-secondary/50 focus:ring-0 outline-none transition-all">
                </div>

                <div class="pt-4 flex justify-end gap-sm">
                    <button type="button" id="cancel-tx" class="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 font-label-sm transition-all">
                        Cancel
                    </button>
                    <button type="submit" class="px-6 py-2.5 rounded-xl bg-gradient-to-b from-[#3cddc7] to-[#03c6b2] text-on-secondary-fixed shadow-[0_0_15px_rgba(68,226,205,0.2)] hover:shadow-[0_0_20px_rgba(68,226,205,0.4)] font-label-sm font-semibold transition-all">
                        Add Transaction
                    </button>
                </div>
            </form>
        </div>
    </div>
    `;

    // Inject modal into document body
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML = modalHTML;
    document.body.appendChild(modalWrapper.firstElementChild);

    const modal = document.getElementById('add-tx-modal');
    const closeBtn = document.getElementById('close-tx-modal');
    const cancelBtn = document.getElementById('cancel-tx');
    const form = document.getElementById('tx-form');
    const btnExpense = document.getElementById('btn-expense');
    const btnIncome = document.getElementById('btn-income');
    const txType = document.getElementById('tx-type');
    const txCategorySelect = document.getElementById('tx-category');

    // Default Date to Now
    const dateInput = document.getElementById('tx-date');
    const now = new Date();
    // Format to YYYY-MM-DDTHH:MM
    const tzoffset = now.getTimezoneOffset() * 60000; //offset in milliseconds
    const localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 16);
    dateInput.value = localISOTime;

    // Handle Type Selection
    btnExpense.addEventListener('click', () => {
        txType.value = 'expense';
        btnExpense.className = "py-2.5 rounded-xl border border-secondary bg-secondary/15 text-secondary font-label-sm font-semibold transition-all";
        btnIncome.className = "py-2.5 rounded-xl border border-white/10 hover:border-secondary/50 text-on-surface-variant font-label-sm transition-all";
        if (txCategorySelect.value === 'Income') {
            txCategorySelect.value = 'Groceries';
        }
    });

    btnIncome.addEventListener('click', () => {
        txType.value = 'income';
        btnIncome.className = "py-2.5 rounded-xl border border-secondary bg-secondary/15 text-secondary font-label-sm font-semibold transition-all";
        btnExpense.className = "py-2.5 rounded-xl border border-white/10 hover:border-secondary/50 text-on-surface-variant font-label-sm transition-all";
        txCategorySelect.value = 'Income';
    });

    // Map categories to standard icons
    const iconMap = {
        'Groceries': 'local_dining',
        'Housing': 'home',
        'Entertainment': 'movie',
        'Transport': 'directions_car',
        'Software': 'cloud',
        'Food & Drink': 'local_cafe',
        'Bills': 'electrical_services',
        'Income': 'payments'
    };

    // Open Modal function
    window.openTransactionModal = () => {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
        // Reset defaults
        dateInput.value = (new Date(Date.now() - now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    };

    // Close Modal function
    window.closeTransactionModal = () => {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
        form.reset();
    };

    closeBtn.addEventListener('click', window.closeTransactionModal);
    cancelBtn.addEventListener('click', window.closeTransactionModal);

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = txType.value;
        const merchant = document.getElementById('tx-merchant').value;
        const amountVal = parseFloat(document.getElementById('tx-amount').value);
        const category = txCategorySelect.value;
        const date = new Date(dateInput.value).toISOString();
        const status = document.getElementById('tx-status').value;
        const details = document.getElementById('tx-details').value;

        const amount = type === 'expense' ? -Math.abs(amountVal) : Math.abs(amountVal);
        const categoryIcon = iconMap[category] || 'receipt';

        window.FinGlassDB.addTransaction({
            merchant,
            amount,
            category,
            categoryIcon,
            date,
            status,
            details
        });

        window.closeTransactionModal();

        // Custom update callback on pages if defined
        if (typeof renderPage === 'function') {
            renderPage();
        } else {
            // fallback
            window.location.reload();
        }
    });

    // Bind all Add Transaction buttons on the pages
    bindAddTransactionButtons();
}

function bindAddTransactionButtons() {
    // Select buttons based on innerText matching 'add transaction' or specific layout signatures
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        if (button.textContent.toLowerCase().includes('add transaction')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                window.openTransactionModal();
            });
        }
    });
}
