// 紀錄當前的數學表達式
let expression = '';

function appendToExpression(value) {
    expression += value;
    document.getElementById('expression').value = expression;
}

function clearExpression() {
    expression = '';
    document.getElementById('expression').value = '';
}

function calculate() {
    fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: expression }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('expression').value = data.result;
        expression = data.result;
    })
    .catch(error => console.error('Error:', error));
}
