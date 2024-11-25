class ExpenseCalculator extends HTMLElement {
    constructor() {
        super();
        this.expenses = [];
        this.expensesProxy = new Proxy(this.expenses, {
            set: (target, property, value) => {
                target[property] = value;
                this.updateDisplay();
                return true;
            }
        });
        this.attachShadow({ mode: 'open' });
        this.render();
        this.addEventListeners();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <h1>Калькулятор расходов</h1>
            <form id="expense-form">
                <input type="text" id="expense-name" placeholder="Название расхода" required>
                <input type="number" id="expense-amount" placeholder="Сумма" required>
                <button type="submit">Добавить расход</button>
            </form>
            <div class="expense-list" id="expense-list"></div>
            <h3>Общая сумма: <span id="total-amount">0</span> ₽</h3>
            <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 20px;
            }
            h1 {
                color: #333;
            }
            form {
                display: flex;
                margin-bottom: 20px;
            }
            input {
                margin: 0 10px;
                
            }
            button {
                padding: 10px 15px;
                font-size: 16px;
                background-color: #5cb85c;
               
            }
            .expense-list {
                max-width: 500px;
                margin: 0 auto;
                padding: 0;
                list-style-type: none;
            }
            .expense-item {
                align-items: center;
                padding: 10px;
            }
            .remove-button {
                background-color: #53843;
                border: none;
                color: white;
                padding: 5px 10px;
                border-radius: 4px;
                cursor: pointer;
            }
        </style>
`;
    }
    addEventListeners() {
        this.shadowRoot.getElementById('expense-form').addEventListener('submit', (event) => {
            event.preventDefault();
            this.addExpense();
        });
    }
    addExpense() {
        const name = this.shadowRoot.getElementById('expense-name').value;
        const amount = parseFloat(this.shadowRoot.getElementById('expense-amount').value);

        if (name && !isNaN(amount)) {
            this.expensesProxy.push({ name, amount });
            this.shadowRoot.getElementById('expense-form').reset();
        }
    }
    updateDisplay() {
        const totalAmountElem = this.shadowRoot.getElementById('total-amount');
        const expenseListElem = this.shadowRoot.getElementById('expense-list');

        totalAmountElem.innerText = this.expensesProxy.reduce((sum, expense) => sum + expense.amount, 0);

        expenseListElem.innerHTML = this.expensesProxy.map((expense, index) => `
            <div class="expense-item">
                <span>${expense.name}: ${expense.amount} ₽</span>
                <button class="remove-button" data-index="${index}">Удалить</button>
            </div>
        `).join('');
        expenseListElem.querySelectorAll('.remove-button').forEach(button => {
            button.addEventListener('click', () => this.removeExpense(button.dataset.index));
        });
    }
    removeExpense(index) {
        this.expensesProxy.splice(index, 1);
    }
}
customElements.define('expense-calculator', ExpenseCalculator);
