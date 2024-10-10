from flask import Flask, request, jsonify, render_template
import math

app = Flask(__name__, static_folder='static', template_folder='templates')

# 定義計算邏輯
def calculate(expression, operation):
    try:
        # 將百分比符號替換為 /100 以便計算
        expression = expression.replace('%', '/100')

        if operation == '=':
            # 基本運算
            result = eval(expression)
        elif operation == '%':
            # 計算百分比
            result = eval(expression) / 100
        elif operation == 'square':
            # 計算平方
            result = math.pow(eval(expression), 2)
        elif operation == 'sqrt':
            # 計算平方根
            result = math.sqrt(eval(expression))
        else:
            return "Invalid operation"  # 處理無效操作符的情況

        return result
    except Exception as e:
        return str("Error")  # 如果計算中出錯，返回錯誤信息

# 根路徑返回 HTML 文件
@app.route('/')
def index():
    return render_template('index.html')

# 供前端使用的計算 API
@app.route('/calculate', methods=['POST'])
def calculate_route():
    data = request.json
    expression = data.get('expression')  # 取得計算的表達式
    operation = data.get('operation', '=')  # 取得操作符，默認為 '='
    
    # 計算結果
    result = calculate(expression, operation)
    
    return jsonify({'result': result})

# 啟動 Flask 應用程序
if __name__ == '__main__':
    app.run(debug=True, port=3000)
