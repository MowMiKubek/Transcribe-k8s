from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper_timestamped as whisper
import os
import threading
import uuid
import hashlib
from pymongo import MongoClient
import datetime
from multiprocessing import Process

# Initialize Flask app
app = Flask(__name__)
CORS(app)

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017/transcribe")

# MongoDB setup
mongo_client = MongoClient(mongo_url)
db = mongo_client["transcriptions_db"]
jobs_collection = db["jobs"]

info = mongo_client.server_info()
print("Connected to MongoDB version", info["version"])

def generate_file_hash(file_path):
    hash_sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_sha256.update(chunk)
    return hash_sha256.hexdigest()

# Background job processing function
def process_transcription(mongo_url, job_id, file_path, language):
    try:
        client = MongoClient(mongo_url)
        collection = client["transcriptions_db"]["jobs"]

        info = client.server_info()
        print("Connected to MongoDB version", info["version"])

        model = whisper.load_model("tiny", device="cpu")
        audio = whisper.load_audio(file_path)
        result = whisper.transcribe(model, audio, language=language)

        print("Job done:", job_id)

        collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "done", "result": result}}
        )
    except Exception as e:
        # Handle errors by updating job status
        collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "error", "error_message": str(e)}}
        )
    finally:
        # Cleanup temporary file
        if os.path.exists(file_path):
            os.remove(file_path)

@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    data = request.form
    language = data.get("language", "en")
    allowed_languages = ["en", "es", "fr", "de", "it", "pl"]

    if language not in allowed_languages:
        language = "en"

    audio_file = request.files["file"]
    file_path = os.path.join("/tmp", audio_file.filename)
    audio_file.save(file_path)

    job_id = str(uuid.uuid4())

    jobs_collection.insert_one({
        "job_id": job_id,
        "status": "pending",
        "file_name": audio_file.filename,
        "language": language,
        "hash": generate_file_hash(file_path)
    })

    # Process the transcription in a background thread
    Process(target=process_transcription, args=(mongo_url, job_id, file_path, language)).start()
    # threading.Thread(target=process_transcription, args=(mongo_url, job_id, file_path, language)).start()

    return jsonify({"job_id": job_id, "status": "pending"}), 202

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
