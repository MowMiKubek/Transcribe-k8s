from flask import Flask, request, jsonify
from flask_cors import CORS
import whisper_timestamped as whisper
import os
import threading
import uuid
from pymongo import MongoClient

# Initialize Flask app
app = Flask(__name__)
CORS(app)

mongo_url = os.environ.get("MONGO_URL", "mongodb://localhost:27017/transcribe")

# MongoDB setup
mongo_client = MongoClient(mongo_url)
db = mongo_client["transcriptions_db"]
jobs_collection = db["jobs"]

# Background job processing function
def process_transcription(job_id, file_path):
    try:
        model = whisper.load_model("base")
        audio = whisper.load_audio(file_path)
        result = whisper.transcribe(model, audio, language="en")

        jobs_collection.update_one(
            {"job_id": job_id},
            {"$set": {"status": "done", "result": result}}
        )
    except Exception as e:
        # Handle errors by updating job status
        jobs_collection.update_one(
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

    audio_file = request.files["file"]
    file_path = os.path.join("/tmp", audio_file.filename)
    audio_file.save(file_path)

    job_id = str(uuid.uuid4())

    jobs_collection.insert_one({
        "job_id": job_id,
        "status": "pending",
        "file_name": audio_file.filename
    })

    # Process the transcription in a background thread
    threading.Thread(target=process_transcription, args=(job_id, file_path)).start()

    return jsonify({"job_id": job_id, "status": "pending"}), 202

@app.route("/transcribe/<job_id>", methods=["GET"])
def get_transcription(job_id):
    # Retrieve the job from MongoDB
    job = jobs_collection.find_one({"job_id": job_id})

    if not job:
        return jsonify({"error": "Job not found"}), 404

    # Return the job details
    job["_id"] = str(job["_id"])  # Convert MongoDB ObjectId to string for JSON serialization
    return jsonify(job), 200

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
