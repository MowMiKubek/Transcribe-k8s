# Speach-to-text using kubernetes environment

## Project description
Main purpose of this project is to host and maintain service, that extracts text from audio/video file and returns it with timestamps. Extraction is done using [whisper](https://github.com/linto-ai/whisper-timestamped) model. Using created webpage we uplod audio file and wait for extraction to be finished. Page should be refreshed periodically to check whether job is complete.

Extraction is a long process (especially using CPU & VM environment). Because of this fact, we decided to apply Horizontal Pod Autoscalling (HPA) for this service. Although file limit is set to 100MB, it is not recommended to upload files longer than 3 minutes, when running on virtual machine host.

## Project tech stach
- frontend (React)
- backend (Express)
- database (MongoDB)
- extraction_service (Flask + whisper model)

## Requirements
In order to run this project following addons are required:
- ingress
- dns
- metrics-server (required for HPA)
- kubernetes-dashboard (optional)
- storage

Project was tested on microk8s channel=1.30/stable (kubernetes v1.30.9).

## How to run project

Deployment was divided into several files and placed into k8s folder. In order to deploy whole app run following command. All images are hosted on docker hub registry. Note that image with AI model can take significant time to download (>2GB).

```bash
kubectl apply -f ./k8s -n <your_namespace>
```

App can be accessed on http://localhost

## Example output

```json
{
  "language": "en",
  "text": " Thank you Mr. President, dear leftists. I'm very happy to take part in this debate about democracy in Europe. So let me give you some example of very major democracy in Poland over thousand years of tradition of Polish nation.",
  "segments": [
    {
      "start": 0.66,
      "end": 4.32,
      "text": " Thank you Mr. President, dear leftists."
    },
    {
      "start": 5.2,
      "end": 8.54,
      "text": " I'm very happy to take part in this debate about democracy in Europe."
    },
    {
      "start": 9.14,
      "end": 13.98,
      "text": " So let me give you some example of very major democracy in Poland over"
    },
    {
      "start": 13.98,
      "end": 17.76,
      "text": " thousand years of tradition of Polish nation."
    },
  ]
}
```