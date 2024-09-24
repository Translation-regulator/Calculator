from flask import Flask, request, jsonify, render_template
import os

app = Flask(__name__, static_folder='static', template_folder='templates')

# 定義計算邏輯
def calculate(expression):
    try:
        # 使用 eval 函數計算數學公式
        result = eval(expression)
        return result
    except Exception as e:
         # 如果計算中出現錯誤，則返回錯誤信息
        return str(e)

# 根路徑返回 HTML 文件
@app.route('/')
def index():
    return render_template('index.html')

# 計算路徑的 API
@app.route('/calculate', methods=['POST'])
def calculate_route():
    # 從前端獲取 JSON 數據
    data = request.json
    expression = data.get('expression') # 取得計算的表達式
    # 計算結果
    result = calculate(expression)
    # 將結果以 JSON 格式回傳給前端
    return jsonify({'result': result})

# 啟動 Flask 應用程式
if __name__ == '__main__':
    app.run(debug=True, port=3000)
