import logging
from flask import Flask, render_template, redirect, url_for

# Configure logging
logging.basicConfig(level=logging.INFO)

app = Flask(__name__)

# Route gốc: Chuyển hướng đến /templates/index.html
@app.route('/')
def redirect_to_index():
    return redirect('/templates/index.html')

# Route để hiển thị trang index.html
@app.route('/templates/index.html')
def index():
    return render_template('templates/index.html')

# Route cho trang About
@app.route('/about')
def about():
    return render_template('templates/pages/about.html')

# Xử lý lỗi 404
@app.errorhandler(404)
def page_not_found(e):
    return render_template('templates/404.html'), 404

if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    except Exception as e:
        logging.error(f"An error occurred: {e}")
        raise