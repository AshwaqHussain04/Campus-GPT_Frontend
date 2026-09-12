# CampusGPT

A Retrieval-Augmented Generation (RAG) chatbot that answers campus-specific queries — course material, lecture notes, and institutional documents — using hybrid retrieval and LLM-powered generation.

## Overview

CampusGPT lets students ask natural-language questions and get answers grounded in official PDFs, lecture notes, and other institutional documents. When a query falls outside the ingested knowledge base, the system falls back to general LLM knowledge — but clearly flags the response as such, rather than returning a plain "not covered" message.

Built as a final-year project, the backend is fully functional end-to-end: document ingestion, hybrid retrieval, generation with fallback logic, and JWT-authenticated admin uploads.

## Features

- **Hybrid retrieval** — combines BM25 (sparse) and dense vector search via MongoDB Atlas Vector Search for more accurate document matching
- **Incremental ingestion** — a file-hash manifest ensures only new or changed documents are re-processed
- **Fallback detection** — refusal-phrase-based logic flags answers that fall back to general LLM knowledge instead of retrieved context
- **Admin document upload** — JWT-authenticated endpoint for uploading and managing course PDFs
- **RAGAS-based evaluation** — pipeline includes evaluation for retrieval and generation quality

## Tech Stack

**Backend**
- Python, FastAPI
- LlamaIndex (orchestration)
- MongoDB Atlas Vector Search
- Gemini API — `gemini-embedding-001` (embeddings, 768 dimensions), `gemini-flash-latest` (generation)
- python-jose + bcrypt (authentication)

**Frontend**
- React

## Architecture

```
                ┌─────────────────┐
                │  PDF / Notes     │
                └────────┬─────────┘
                         │  offline ingestion
                         ▼
              ┌────────────────────┐
              │  pypdf extraction   │
              │  chunking (1024/100)│
              └─────────┬───────────┘
                         │
                         ▼
        ┌───────────────────────────────┐
        │  Gemini Embeddings             │
        │  → MongoDB Atlas Vector Search │
        │  (index: autoembed_index)      │
        └───────────────┬────────────────┘
                         │
                         ▼
        ┌───────────────────────────────┐
        │  Hybrid Retrieval              │
        │  (BM25 + Dense, cosine sim)    │
        └───────────────┬────────────────┘
                         │
                         ▼
        ┌───────────────────────────────┐
        │  Gemini Flash Generation       │
        │  + Fallback Detection          │
        └───────────────┬────────────────┘
                         │
                         ▼
                  ┌─────────────┐
                  │   Response   │
                  └─────────────┘
```

## Configuration

| Component | Value |
|---|---|
| Embedding model | `gemini-embedding-001` (768 dim) |
| Chat model | `gemini-flash-latest` |
| Chunk size / overlap | 1024 / 100 |
| Similarity metric | Cosine |
| Collection | `Study_Notes` |
| Vector index | `autoembed_index` |

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js (for the React frontend)
- A MongoDB Atlas cluster with Vector Search enabled
- A Gemini API key

### Backend Setup

```bash
cd campusgpt-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file with:

```
GEMINI_API_KEY=your_api_key
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
```

Run the server:

```bash
uvicorn main:app --reload
```

### Ingesting Documents

Place PDFs in the designated ingestion folder and run the ingestion script. The file-hash manifest ensures already-ingested documents are skipped on subsequent runs.

```bash
python ingest.py
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/query` | Submit a question and receive a grounded answer |
| `POST` | `/admin/upload` | Upload new course documents (JWT-authenticated) |
| `GET` | `/admin/documents` | List ingested documents |

*(Adjust to match your actual route names.)*

## Evaluation

The pipeline includes RAGAS-based evaluation to measure retrieval and generation quality, including hallucination and faithfulness metrics.

## Roadmap

- [ ] Expand ingestion to additional course subjects
- [ ] Complete React frontend integration
- [ ] Add multimodal retrieval support
- [ ] Expand automated evaluation coverage

## License

MIT
