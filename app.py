from flask import Flask, render_template, request, redirect, jsonify, Response, session, render_template_string, url_for
import csv
import os
import random
from datetime import datetime

app = Flask(__name__)
app.secret_key = 'supersecretkey' 

# === Настройки авторизации ===
MAX_FAILED_ATTEMPTS = 5

@app.route('/glitch')
def glitch():
    strange_pages = [
        "https://mcpehub.org/download-mcpe/",
        "https://zonabelya.ru/catalog/vozbuzhdayushchie-smazki/gel_dlya_muzhchin_titan_gel_tantra_50_ml/",
        "https://www.pleer.ru/?srsltid=AfmBOorueePtqqEaJ-Sy4ZZEPem61VH6big5OjCyYNZM-vkDY33BrVAZ",
    ]
    selected = random.choice(strange_pages)
    return render_template_string(f'''
        <script>
            // открываем странный сайт в новой вкладке
            window.open("{selected}", "_blank");

            // возвращаем пользователя домой через 3 секунды
            setTimeout(function() {{
                window.location.href = "/";
            }}, 3);
        </script>
    ''')

def check_auth(username, password):
    return username == 'admin' and password == 'admin'

def authenticate():
    return Response(
        'Требуется авторизация.', 401,
        {'WWW-Authenticate': 'Basic realm="Admin Panel"'}
    )

def requires_auth(f):
    from functools import wraps
    @wraps(f)
    def decorated(*args, **kwargs):
        if session.get('bypassed_auth'):
            return f(*args, **kwargs)

        auth = request.authorization
        if not auth or not check_auth(auth.username, auth.password):
            session['fail_count'] = session.get('fail_count', 0) + 1

            if session['fail_count'] >= MAX_FAILED_ATTEMPTS:
                session['bypassed_auth'] = True
                return f(*args, **kwargs)

            return authenticate()

        # Успешный логин — сбрасываем счётчик
        session['fail_count'] = 0
        session['bypassed_auth'] = False
        return f(*args, **kwargs)
    return decorated

@app.route('/logout')
def logout():
    session.clear()
    return Response(
        'Вы вышли из системы.', 401,
        {'WWW-Authenticate': 'Basic realm="Admin Panel"'}
    )

@app.route('/mortgage', methods=['POST'])
def mortgage():
    name = request.form.get('name')
    phone = request.form.get('phone')
    term = request.form.get('term')
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open('mortgage.csv', 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([time, name, phone, term])

    return f"<h2>Ипотека одобрена, {name}!</h2><p>Платите {term} месяцев или пока не передумаете. Мы вам позвоним на номер {phone}.</p><a href='/'>Вернуться</a>"


# === Главная страница ===
@app.route('/')
def home():
    return render_template("index.html")

# === Обработка формы обратной связи ===
@app.route('/submit', methods=['POST'])
def submit():
    name = request.form.get('name')
    phone = request.form.get('phone')
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    with open('submissions.csv', 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([time, name, phone, "form"])

    return redirect('/')

# === Заказ услуги ===
@app.route('/order', methods=['POST'])
def order():
    name = request.form.get('name')
    phone = request.form.get('phone')
    services = request.form.getlist('services')
    time = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

    services_str = ', '.join(services)

    with open('orders.csv', 'a', newline='', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow([time, name, phone, services_str])

    return f"<h2>Спасибо за заказ, {name}!</h2><p>Мы свяжемся с вами по номеру {phone}.</p><p><a href='/'>Вернуться на сайт</a></p>"

# === Админ-панель ===
@app.route('/admin')
@requires_auth
def admin():
    submissions = []
    if os.path.exists('submissions.csv'):
        with open('submissions.csv', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 4:
                    submissions.append({
                        'time': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'source': row[3]
                    })

    orders = []
    if os.path.exists('orders.csv'):
        with open('orders.csv', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 4:
                    orders.append({
                        'time': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'services': row[3]
                    })

    # Ипотечные заявки
    mortgages = []
    if os.path.exists('mortgage.csv'):
        with open('mortgage.csv', newline='', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                if len(row) >= 4:
                    mortgages.append({
                        'time': row[0],
                        'name': row[1],
                        'phone': row[2],
                        'term': row[3]
                    })

    return render_template("admin.html", submissions=submissions, orders=orders, mortgages=mortgages)

if __name__ == '__main__':
    app.run(debug=True)
