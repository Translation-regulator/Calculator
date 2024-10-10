let expression = '';
let resetOnNextInput = false;  // 用來標記是否需要清空輸入框
let calculationEnded = false;  // 標記是否已經按下 "=" 表示計算結束

// 更新輸入框顯示
function updateExpression(value) {
    document.getElementById('expression').value = value;
}

// 添加數字或運算符到輸入框
function appendToExpression(value) {
    expression = String(expression);  // 確保 expression 是字符串

    // 如果计算已经结束，且输入的不是运算符，清空输入框并重置状态
    if (calculationEnded) {
        if (isOperator(value)) {
            // 如果输入的是運算符號，繼續運算
            calculationEnded = false;
        } else {
            // 如果输入的是数字，先清除
            expression = '';
            calculationEnded = false;  
        }
    }
    
    // 防止在沒有輸入數字的情況下輸入運算符
    if (expression === '' && isOperator(value)) {
        return;  // 不允許輸入運算符
    }

    // 防止連續輸入多個運算符
    if (isOperator(expression.slice(-1)) && isOperator(value)) {
        return;  // 不允許連續輸入多個運算符
    }

    // 添加數字或運算符到表達式
    expression += value;
    updateExpression(expression);

}

// 清除輸入框
function clearExpression() {
    expression = '';
    resetOnNextInput = false;
    calculationEnded = false;
    updateExpression('');
}

// 發送計算請求
function calculate() {
    expression = String(expression);  // 確保 expression 是字符串
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: expression }),
    })
    .then(response => response.json())
    .then(data => {
        updateExpression(data.result);  // 顯示結果
        expression = String(data.result);  // 更新當前表達式為結果
        calculationEnded = true;  // 標記計算結束
    })
    .catch(error => console.error('Error:', error));
}


// 計算百分比
function calculatePercentage() {
    let result = eval(expression) / 100;
    updateExpression(result);
    expression = result;
    resetOnNextInput = false;  // 允許繼續輸入
}

// 計算平方
function calculateSquare() {
    let result = Math.pow(eval(expression), 2);
    updateExpression(result);
    expression = result;
    resetOnNextInput = false;  // 允許繼續輸入
}

// 計算平方根
function calculateSquareRoot() {
    let result = Math.sqrt(eval(expression));
    updateExpression(result);
    expression = result;
    resetOnNextInput = false;  // 允許繼續輸入
}

// 判斷是否為運算符
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

// 使用鍵盤輸入
document.addEventListener('keydown', function(event) {
    const key = event.key;  // 定義鍵盤按下的按鍵

    // 判斷是否為數字
    if (!isNaN(key)) {
        appendToExpression(key);
    } 
    // 判斷是否為運算符號
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    } 
    // 輸入 Enter，表示為 "="
    else if (key === 'Enter') {
        event.preventDefault();
        calculate();  
    }
    // 輸入 ESC，表示為清空輸入框
    else if (key === 'Escape') {
        clearExpression();
    }
    // 輸入倒退鍵 backspace，表示為刪除一個數字或運算符號
    else if (key === 'Backspace') {
        expression = expression.slice(0, -1);  // 删除一個單位
        updateExpression(expression);
    }
    // 輸入百分比 (%)
    else if (key === '%') {
        calculatePercentage();
    }
    // 輸入平方 (x^2)
    else if (key.toLowerCase() === 'p') {  // 用 "P" 键来表示平方
        calculateSquare();
    }
    // 輸入開根號 (√)
    else if (key.toLowerCase() === 'r') {  // 用 "R" 键来表示平方根
        calculateSquareRoot();
    }
});
