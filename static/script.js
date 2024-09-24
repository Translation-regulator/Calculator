// 紀錄當前的數學表達式
// 宣告空字串為當前輸入框內的情形
let expression = '';

// 將按鈕的數字以及運算符號表達製輸入框
function appendToExpression(value) {
    // 目前輸入的數學公式加上額外的數字以及運算符號
    expression += value;
    // 使用 document.getElementById 方法來獲取 HTML 頁面上帶有 id="expression" 的輸入框
    document.getElementById('expression').value = expression;
}

// 清空輸入框內的數字以及文字
function clearExpression() {
    expression = '';
    document.getElementById('expression').value = '';
}

// 發起與後端的連線 (POST 請求)，從後端計算結果，前端顯示畫面
function calculate() {
    fetch('/calculate', {
        method: 'POST', //將數據發送到伺服器
        headers: {
            'Content-Type': 'application/json', // 表示發送的數據類行為格式
        },
        // 將JavaScript 中的物件 ({ expression: expression }) 轉換成 JSON 格式的字串形式
        // JSON.stringify 將物件轉換成 JSON 格式
        body: JSON.stringify({ expression: expression }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('expression').value = data.result;
        expression = data.result;
    })
    .catch(error => console.error('Error:', error));
}
