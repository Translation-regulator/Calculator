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

    // 當 resetOnNextInput 為 true 且當前輸入的 value 不是運算符時，執行以下操作
    if (resetOnNextInput && !isOperator(value)) {
        expression = '';  // 清空表達式
        resetOnNextInput = false;  // 重置標誌
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
