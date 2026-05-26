from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# Đáp án đúng
correct_answers = {
    "fami.jpg": "organic",
    "pallet_go.jpg": "recycle",
    "vo_hoa_qua.jpg": "organic",
    "ac_quy.jpg": "hazard",
    "pallet_nhua.jpg": "recycle",
    "thuc_an.jpg": "organic",
    "son.jpg": "hazard",
    "chai_nhua.jpg": "recycle",
    "rac_hoa_chat.jpg": "hazard",
    "nilon.jpg": "recycle",
    "hop_xop.jpg": "organic",
    "pin.jpg": "hazard"
}

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    image = data['image']
    category = data['category']

    correct = correct_answers.get(image) == category
    return jsonify({"correct": correct})

if __name__ == '__main__':
    # chạy LAN
    app.run(host='0.0.0.0', port=5000, debug=True)