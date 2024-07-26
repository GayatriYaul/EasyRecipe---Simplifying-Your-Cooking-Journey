import google.generativeai as genai
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv
import os
load_dotenv()

api_key = os.getenv("GENERATIVEAI_API_KEY")
genai.configure(api_key=api_key) # Sets up the Google Generative AI with the retrieved API key for authentication.

generation_config = {
    "temperature": 0.9, # : 0.9 allows some creativity (0.1 - 0.9)
    "top_p": 0.5,  # Focus on high probability words, but allow some variation
    "top_k": 5,     # Consider top 5 most probable words at each step
    "max_output_tokens": 1000,  #  The maximum number of tokens (words or pieces of words) the model will generate.
}

# Specifies categories of harmful content to be blocked by the AI, 
# such as harassment, hate speech, sexually explicit content, and 
# dangerous content.
safety_settings = [
    {
        "category": "HARM_CATEGORY_HARASSMENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_HATE_SPEECH",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
    {
        "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
        "threshold": "BLOCK_MEDIUM_AND_ABOVE"
    },
]

chat = None

def text_summary(text, isNew = False):
    # Creates a model with the specified configuration and safety settings.
    model = genai.GenerativeModel(model_name="gemini-pro",
                                generation_config=generation_config,
                                safety_settings=safety_settings)
     #Uses the global chat variable to maintain the chat session.
    global chat
    
    if isNew:  #Checks if this is a new chat session
        chat = model.start_chat()
        #  Sends an initial message to set the context for the AI (e.g., act like a chef).
        chat.send_message("Act like you are a chef and food ai (specifically for indian food) Dont Generate Bold and Italic Output (*,**) give title in inside <strong> </strong> tag after <strong> </strong> add a <br/> and para text in <p> </p> tag and add 2</br> tag after every title and paragraph  data :  row :- {row},col :-{col}")
        response = chat.send_message(text)
        return response.text
    else: # If it’s not a new chat, it continues the existing session
        response = chat.send_message(text)
        return response.text