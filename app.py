from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# 定義計算邏輯
def calculate(expression):
    try:
        result = eval(expression)
        return result
    except Exception as e:
        return str(e)

# 根路徑返回 HTML 文件
@app.route('/')
def index():
    return render_template('index.html')

# 計算路徑的 API
@app.route('/calculate', methods=['POST'])
def calculate_route():
    data = request.json
    expression = data.get('expression')
    result = calculate(expression)
    return jsonify({'result': result})

if __name__ == '__main__':
    app.run(debug=True, port=3000)
