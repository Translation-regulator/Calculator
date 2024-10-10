let expression = '';
let calculationEnded = false;  // 标记是否已经按下 "=" 或特殊运算

// 更新输入框显示
function updateExpression(value) {
    document.getElementById('expression').value = value;
}

// 添加数字或运算符到输入框
function appendToExpression(value) {
    expression = String(expression);  // 确保 expression 是字符串

    // 如果计算已经结束，且输入的不是运算符，清空输入框并重置状态
    if (calculationEnded) {
        if (isOperator(value)) {
            // 如果输入的是运算符号，继续运算
            calculationEnded = false;
        } else {
            // 如果输入的是数字，先清除
            expression = '';
            calculationEnded = false;  
        }
    }
    
    // 防止在没有输入数字的情况下输入运算符
    if (expression === '' && isOperator(value)) {
        return;  // 不允许输入运算符
    }

    // 防止连续输入多个运算符
    if (isOperator(expression.slice(-1)) && isOperator(value)) {
        return;  // 不允许连续输入多个运算符
    }

    // 添加数字或运算符到表达式
    expression += value;
    updateExpression(expression);
}

// 清除输入框
function clearExpression() {
    expression = '';
    calculationEnded = false;
    updateExpression('');
}

// 统一处理计算和特殊操作（=、平方、平方根、百分比）
function calculate(operation = '=') {
    expression = String(expression);  // 确保 expression 是字符串
    let result;

    try {
        // 根据不同的操作符判断执行哪种运算
        if (operation === '=') {
            fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression: expression }),
            })
            .then(response => response.json())
            .then(data => {
                updateExpression(data.result);  // 显示结果
                expression = String(data.result);  // 更新当前表达式为结果
                calculationEnded = true;  // 标记计算结束
            })
            .catch(error => console.error('Error:', error));
        } else if (operation === '%') {
            result = eval(expression) / 100;
            updateExpression(result);
            expression = result;
            calculationEnded = true;
        } else if (operation === 'square') {
            result = Math.pow(eval(expression), 2);
            updateExpression(result);
            expression = result;
            calculationEnded = true;
        } else if (operation === 'sqrt') {
            result = Math.sqrt(eval(expression));
            updateExpression(result);
            expression = result;
            calculationEnded = true;
        }
    } catch (error) {
        console.error('Calculation error:', error);
        updateExpression('Error');
        calculationEnded = true;
    }
}


// 判断是否为运算符
function isOperator(value) {
    return ['+', '-', '*', '/'].includes(value);
}

// 使用键盘输入
document.addEventListener('keydown', function(event) {
    const key = event.key;  // 获取按下的键

    // 判断是否为数字
    if (!isNaN(key)) {
        appendToExpression(key);
    } 
    // 判断是否为运算符号
    else if (['+', '-', '*', '/'].includes(key)) {
        appendToExpression(key);
    } 
    // 输入 Enter，表示为 "="
    else if (key === 'Enter') {
        event.preventDefault();
        calculate('=');  
    }
    // 输入 ESC，表示为清空输入框
    else if (key === 'Escape') {
        clearExpression();
    }
    // 输入退格键 backspace，表示为删除一个数字或运算符号
    else if (key === 'Backspace') {
        expression = expression.slice(0, -1);  // 删除一个单位
        updateExpression(expression);
    }
    // 输入百分比 (%)
    else if (key === '%') {
        calculate('%');
    }
    // 输入平方 (x^2)
    else if (key.toLowerCase() === 'p') {  // 用 "P" 键来表示平方
        calculate('square');
    }
    // 输入开根号 (√)
    else if (key.toLowerCase() === 'r') {  // 用 "R" 键来表示平方根
        calculate('sqrt');
    }
});
