let expression = '';
let calculationEnded = false;  // 是否按下"="

// 顯示輸入的數字或是運算符號
function updateExpression(value) {
    document.getElementById('expression').value = value;
}

// 增加數字或是運算符號到輸入框
function appendToExpression(value) {
    expression = String(expression);  // 確認 expression 是字串

    // 如果計算結束且輸入非運算符號則清空輸入框
    if (calculationEnded) {
        if (isOperator(value)) {
            calculationEnded = false;
        } else {
            expression = '';
            calculationEnded = false;  
        }
    }
    
    // 若沒有先輸入數字，不允許輸入運算符號
    if (expression === '' && isOperator(value)) {
        return;  // 無法輸入運算符號
    }

    // 避免連續輸入多個運算符號
    if (isOperator(expression.slice(-1)) && isOperator(value)) {
        return;
    }

    // 新增數字或是運算符號
    expression += value;
    updateExpression(expression);
}

// 清空輸入框
function clearExpression() {
    expression = '';
    calculationEnded = false;
    updateExpression('');
}

// 統一處理計算和特殊操作（由後端處理）
function calculate(operation = '=') {
    expression = String(expression);  // 確保 expression 是字符串
    
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: expression, operation: operation }),
    })
    .then(response => response.json())
    .then(data => {
        updateExpression(data.result);  // 顯示結果
        expression = String(data.result);  // 更新當前表達式為結果
        calculationEnded = true;  // 標記計算結束
    })
    .catch(error => console.error('Error:', error));
}

// 判斷是否為運算符
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

// 鍵盤事件處理
document.addEventListener('keydown', function(event) {
    const key = event.key;  // 取得按下的鍵

    // 判斷是否為數字
    if (!isNaN(key)) {
        appendToExpression(key);
    }
    // 判斷是否為運算符號
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    }
    // Enter 鍵相當於 "="
    else if (key === 'Enter') {
        event.preventDefault();  // 避免表單提交
        calculate('=');
    }
    // ESC 鍵相當於清空
    else if (key === 'Escape') {
        clearExpression();
    }
    // Backspace 鍵相當於刪除一個字元
    else if (key === 'Backspace') {
        expression = expression.slice(0, -1);  // 刪除最後一個字符
        updateExpression(expression);
    }
    // % 鍵相當於百分比
    else if (key === '%') {
        calculate('%');
    }
    // P 鍵相當於平方
    else if (key.toLowerCase() === 'p') {
        calculate('square');
    }
    // R 鍵相當於平方根
    else if (key.toLowerCase() === 'r') {
        calculate('sqrt');
    }
});
