from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import json

#import custom function

from chef import text_summary

app = Flask(__name__) 
CORS(app)   # CORS: Allows your API to be accessed from different domains.


# Route /chef: This is an endpoint that accepts POST requests.
@app.route('/chef', methods=['POST'])
def summarize_text():

# Get the text from the request body
    text = request.json['text']
    isNew = request.json['isNew']

    # : Calls the text_summary function with the text and isNew flag.
    response = text_summary(text, isNew)

    #  Sends back the summarized text as a JSON response.
    return jsonify({"response": response})

# runs the app 
if __name__ == '__main__':
    app.run(debug=True, port=5000)