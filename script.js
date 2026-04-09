

class ScientificCalculator {
    constructor(previousOperandTextElement, currentOperandTextElement, memoryDisplay) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.memoryDisplay = memoryDisplay;
        this.memory = 0;
        this.clear();
        this.degreesMode = true;
    }

    clear() {
        this.currentOperand = '';
        this.previousOperand = '';
        this.operation = undefined;
        this.waitingForNewNumber = false;
    }

    delete() {
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (this.waitingForNewNumber) {
            this.currentOperand = number;
            this.waitingForNewNumber = false;
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' && this.previousOperand === '') return;
        
        if (this.previousOperand !== '' && !this.waitingForNewNumber) {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.waitingForNewNumber = true;
    }

    compute() {
        let result;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case '+': result = prev + current; break;
            case '-': result = prev - current; break;
            case '×': result = prev * current; break;
            case '÷': 
                if (current === 0) {
                    this.error('Cannot divide by zero');
                    return;
                }
                result = prev / current; 
                break;
            case '%': result = prev * (current / 100); break;
            default: return;
        }
        
        this.currentOperand = this.formatResult(result);
        this.operation = undefined;
        this.previousOperand = '';
        this.waitingForNewNumber = true;
    }

    formatResult(number) {
        if (Number.isInteger(number)) {
            return number.toString();
        }
        return parseFloat(number.toPrecision(10)).toString();
    }

    updateDisplay() {
        this.currentOperandTextElement.innerText = 
            this.currentOperand || '0';
        
        if (this.operation != null && this.previousOperand !== '') {
            this.previousOperandTextElement.innerText = 
                `${this.previousOperand} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
        
        this.memoryDisplay.textContent = this.memory !== 0 ? 'M' : '';
    }

    // Scientific Functions
    sin() { this.unaryOperation(Math.sin, 'rad'); }
    cos() { this.unaryOperation(Math.cos, 'rad'); }
    tan() { this.unaryOperation(Math.tan, 'rad'); }
    
    sinInverse() { this.unaryOperation(Math.asin, 'deg'); }
    cosInverse() { this.unaryOperation(Math.acos, 'deg'); }
    tanInverse() { this.unaryOperation(Math.atan, 'deg'); }
    
    log() { this.unaryOperation(Math.log10); }
    ln() { this.unaryOperation(Math.log); }
    sqrt() { this.unaryOperation(Math.sqrt); }
    
    pow2() { 
        const num = parseFloat(this.currentOperand);
        this.currentOperand = this.formatResult(num * num);
    }
    
    pow3() { 
        const num = parseFloat(this.currentOperand);
        this.currentOperand = this.formatResult(num * num * num);
    }
    
    reciprocal() {
        const num = parseFloat(this.currentOperand);
        if (num === 0) {
            this.error('Cannot divide by zero');
            return;
        }
        this.currentOperand = this.formatResult(1 / num);
    }
    
    factorial() {
        const num = parseInt(this.currentOperand);
        if (num < 0 || !Number.isInteger(num)) {
            this.error('Invalid factorial');
            return;
        }
        this.currentOperand = this.factorialCalc(num).toString();
    }
    
    factorialCalc(n) {
        if (n <= 1) return 1;
        return n * this.factorialCalc(n - 1);
    }
    
    pi() { this.currentOperand = Math.PI.toString(); }
    e() { this.currentOperand = Math.E.toString(); }

    unaryOperation(func, mode = 'none') {
        let num = parseFloat(this.currentOperand);
        if (isNaN(num)) return;
        
        if (mode === 'rad') {
            num = this.degreesMode ? num * Math.PI / 180 : num;
        }
        
        const result = func(num);
        this.currentOperand = this.formatResult(mode === 'deg' ? result * 180 / Math.PI : result);
    }

    memoryClear() { this.memory = 0; this.updateDisplay(); }
    memoryRecall() { this.currentOperand = this.memory.toString(); this.updateDisplay(); }
    memoryAdd() { this.memory += parseFloat(this.currentOperand || 0); this.updateDisplay(); }
    memorySubtract() { this.memory -= parseFloat(this.currentOperand || 0); this.updateDisplay(); }

    error(message) {
        this.currentOperand = 'Error';
        this.operation = undefined;
        this.previousOperand = '';
        console.error(message);
    }
}

// Initialize Calculator
const previousOperandTextElement = document.querySelector('[id="previousOperand"]');
const currentOperandTextElement = document.querySelector('[id="currentOperand"]');
const memoryDisplay = document.querySelector('[id="memoryDisplay"]');

const calculator = new ScientificCalculator(previousOperandTextElement, currentOperandTextElement, memoryDisplay);

// Button Event Listeners
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        const value = button.dataset.value;

        if (action === 'clear') {
            calculator.clear();
        } else if (action === 'clear-entry') {
            calculator.currentOperand = '';
        } else if (action === 'delete') {
            calculator.delete();
        } else if (action === 'equals') {
            calculator.compute();
        } else if (action === 'mc') {
            calculator.memoryClear();
        } else if (action === 'mr') {
            calculator.memoryRecall();
        } else if (action === 'm+') {
            calculator.memoryAdd();
        } else if (action === 'm-') {
            calculator.memorySubtract();
        } else if (action === 'sin') {
            calculator.sin();
        } else if (action === 'cos') {
            calculator.cos();
        } else if (action === 'tan') {
            calculator.tan();
        } else if (action === 'sin-inverse') {
            calculator.sinInverse();
        } else if (action === 'cos-inverse') {
            calculator.cosInverse();
        } else if (action === 'tan-inverse') {
            calculator.tanInverse();
        } else if (action === 'log') {
            calculator.log();
        } else if (action === 'ln') {
            calculator.ln();
        } else if (action === 'sqrt') {
            calculator.sqrt();
        } else if (action === 'pow2') {
            calculator.pow2();
        } else if (action === 'pow3') {
            calculator.pow3();
        } else if (action === '1/x') {
            calculator.reciprocal();
        } else if (action === 'fact') {
            calculator.factorial();
        } else if (action === 'pi') {
            calculator.pi();
        } else if (action === 'e') {
            calculator.e();
        } else if (value) {
            if (['+', '-', '×', '÷', '%'].includes(value)) {
                calculator.chooseOperation(value);
            } else {
                calculator.appendNumber(value);
            }
        }

        calculator.updateDisplay();
    });
});

// Mode Toggle - SIMPLIFIED
document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const mode = btn.dataset.mode;
        
        if (mode === 'basic') {
            document.querySelector('.basic-mode').classList.add('active');
            document.querySelector('.scientific-mode').classList.remove('active');
        } else {
            document.querySelector('.basic-mode').classList.remove('active');
            document.querySelector('.scientific-mode').classList.add('active');
        }
    });
});

// Keyboard Support
document.addEventListener('keydown', (event) => {
    if (event.key >= 0 && event.key <= 9 || event.key === '.') {
        event.preventDefault();
        calculator.appendNumber(event.key);
    } else if (['+', '-', '*', '/'].includes(event.key)) {
        event.preventDefault();
        calculator.chooseOperation(event.key === '*' ? '×' : event.key === '/' ? '÷' : event.key);
    } else if (event.key === '%') {
        event.preventDefault();
        calculator.chooseOperation('%');
    } else if (event.key === 'Enter' || event.key === '=') {
        event.preventDefault();
        calculator.compute();
    } else if (event.key === 'Escape') {
        event.preventDefault();
        calculator.clear();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        calculator.delete();
    }
    
    calculator.updateDisplay();
});


// Info Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
    const infoBtn = document.querySelector('.info-btn');
    const infoModal = document.getElementById('infoModal');
    const closeBtn = document.querySelector('.close-btn');

    // Open modal
    infoBtn.addEventListener('click', function() {
        infoModal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        infoModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === infoModal) {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && infoModal.style.display === 'block') {
            infoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
});




