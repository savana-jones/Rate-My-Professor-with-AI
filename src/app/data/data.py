import firebase_admin
from firebase_admin import credentials, firestore
import weaviate
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.weaviate import WeaviateVectorStore
from llama_index.core import StorageContext
from llama_index.core import Document as LlamaDocument
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings
from sentence_transformers import SentenceTransformer
from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv

app = Flask(__name__)
CORS(app)

load_dotenv()

cred = credentials.Certificate("src/app/data/rate-my-professor.json")  # Replace with your Firestore service account key
firebase_admin.initialize_app(cred)
db = firestore.client()
url=os.getenv("WEAVIATE_URL")
print(url)
client = weaviate.Client(
  url=os.getenv("WEAVIATE_URL"),
  auth_client_secret=weaviate.AuthApiKey(api_key=os.getenv("WEAVIATE_API_KEY"))
)

def get_professors_data():
    professors_ref = db.collection('professors')
    docs = professors_ref.stream()
    data = []
    for doc in docs:
        data.append(doc.to_dict()) 
    return data

data = get_professors_data()

schema = {
    "classes": [
        {
            "class": "Review",
            "description": "A collection of reviews with name and specialization",
            "properties": [
                {
                    "name": "name",
                    "dataType": ["string"],
                },
                {
                    "name": "specialization",
                    "dataType": ["string"],
                },
                {
                    "name": "review",
                    "dataType": ["text"],
                }
            ],
        }
    ]
}

#weaviate_client.schema.create(schema)

from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')

def text_to_vector(name, specialization, review):
    combined_text = f"Name: {name}. Specialization: {specialization}. Review: {review}."
    return model.encode(combined_text).tolist()
    
def upload_to_weaviate(data):
    for prof in data:
        combined_vector = text_to_vector(prof["name"], prof["specialization"], prof["review"])
        client.data_object.create({
            "name": prof["name"],
            "specialization": prof["specialization"],
            "review": prof["review"],
            "vector": combined_vector
        }, "Review") 

#upload_to_weaviate(data)
def text_to_vector(text):
    from sentence_transformers import SentenceTransformer
    model = SentenceTransformer('all-MiniLM-L6-v2')
    return model.encode(text).tolist()

vector_store = WeaviateVectorStore(
    weaviate_client=client, index_name="Review"
)

storage_context = StorageContext.from_defaults(vector_store=vector_store)

class Document(LlamaDocument):
    def __init__(self, text, metadata):
        super().__init__(text=text, metadata=metadata)
        self.id_ = str(hash(text)) 

Settings.embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")

def create_index_from_dict(data):
    documents = [
        Document(
            text=item['review'],
            metadata={
                'name': item['name'],
                'specialization': item['specialization'],
                'review': item['review']
            }
        )
        for item in data
    ]
    return VectorStoreIndex.from_documents(documents)

index = create_index_from_dict(data)

from llama_index.llms.openrouter import OpenRouter

def query_professor_info(query):
    llm = OpenRouter(api_key=os.getenv("OPENROUTER_API_KEY"), max_tokens=256, context_window=4096, model="meta-llama/llama-3-8b-instruct:free")
    query_engine = index.as_query_engine(llm=llm)
    response = query_engine.query(query)
    return str(response)
#display(Markdown(f"{response}"))
@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    messages = data.get('messages', '')
    response_text = query_professor_info(messages)
    return jsonify({"response": response_text})

if __name__ == '__main__':
    app.run(port=5000)
