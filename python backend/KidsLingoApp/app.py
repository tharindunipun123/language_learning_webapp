# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from nltk.tokenize import word_tokenize, sent_tokenize
import nltk

app = Flask(__name__)
CORS(app)
nltk.download('punkt_tab')

# Sample quiz data
quizzes = [
    {
        "id": 1,
        "title": "Alphabet Recognition Quiz",
        "questions": [
            {
                "text": "Identify the Sinhala letter: අ",
                "options": ["a", "aa", "ae", "i"],
                "correct_answer": "a"
            },
            {
                "text": "Match the romanized equivalent: ක",
                "options": ["ka", "ga", "cha", "ja"],
                "correct_answer": "ka"
            }
        ]
    },
    {
        "id": 2,
        "title": "Basic Vocabulary Quiz",
        "questions": [
            {
                "text": "What is the Sinhala word for 'water'?",
                "options": ["වතුර", "ගස", "මල", "ගෙදර"],
                "correct_answer": "වතුර"
            },
            {
                "text": "Translate 'hello' to Sinhala:",
                "options": ["ආයුබෝවන්", "ස්තූතියි", "සමාවෙන්න", "ගිහින් එන්නම්"],
                "correct_answer": "ආයුබෝවන්"
            }
        ]
    }
]

@app.route('/api/quizzes', methods=['GET'])
def get_quizzes():
    return jsonify(quizzes)

@app.route('/api/submit-quiz', methods=['POST'])
def submit_quiz():
    data = request.json
    quiz_id = data['quizId']
    user_answers = data['answers']
    
    quiz = next((q for q in quizzes if q['id'] == quiz_id), None)
    if not quiz:
        return jsonify({"error": "Quiz not found"}), 404
    
    score = 0
    for i, question in enumerate(quiz['questions']):
        if str(i) in user_answers and user_answers[str(i)] == question['correct_answer']:
            score += 1
    
    return jsonify({"score": score})


@app.route('/tokenize', methods=['POST'])
def tokenize_text():
    
    corpus = request.get_json()
    
    text = corpus['text']
    
    try:
        word_tokens = word_tokenize(text)
        
        response = {
            'word_tokens': word_tokens,
            'word_count': len(word_tokens),
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({
            'error': f'Error during tokenization: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True)