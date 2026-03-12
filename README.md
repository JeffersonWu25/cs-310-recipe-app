# Smart Pantry Assistant

AI-powered meal decision tool. Add pantry ingredients, chat with an assistant to get recipe suggestions, then find missing ingredients at nearby Kroger stores or discover top-rated restaurants nearby.

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (TypeScript, Tailwind) |
| Backend | Python, FastAPI, Mangum |
| Hosting | AWS Lambda + API Gateway |
| Database | AWS RDS (MySQL) |
| AI | Google Gemini 2.5 Flash |
| Shopping | Kroger API |
| Restaurants | Google Places API |

---

## Quick Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- A MySQL database (local or RDS)

### 1. Clone

```bash
git clone <repo-url>
cd cs-310-recipe-app
```

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Copy the example env and fill in your keys:

```bash
cp .env.example .env
```

`.env` variables:

```
DB_HOST=...
DB_PORT=...
DB_NAME=...
DB_USER=...
DB_PASSWORD=...
GEMINI_API_KEY=...
KROGER_CLIENT_ID=...
KROGER_CLIENT_SECRET=...
GOOGLE_PLACES_API_KEY=...
```

Start the backend:

```bash
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

### 3. Frontend

```bash
cd frontend
npm install
```

Copy the example env:

```bash
cp .env.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_API_URL=...
```

Start the frontend:

```bash
npm run dev
# Runs on http://localhost:3000
```

---

## Key Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/ingredients` | List pantry items |
| `POST` | `/ingredients` | Add pantry item |
| `PUT` | `/ingredients/{id}` | Update pantry item |
| `DELETE` | `/ingredients/{id}` | Remove pantry item |
| `POST` | `/chat` | Chat + recipe suggestions (Gemini) |
| `POST` | `/shopping/kroger` | Find nearby Kroger stores + ingredient prices |
| `GET` | `/restaurants/nearby` | Top 6 rated restaurants within 25 miles |

---

## How It Works

1. Add ingredients to your pantry
2. Ask the chatbot what you can cook — it returns 1 recipe you can make now and 2 that need a few extra ingredients
3. Click **Get Missing Items** on any recipe — the app requests your location and simultaneously:
   - Finds the 3 nearest Kroger stores and checks availability, price, and delivery eligibility for each missing ingredient
   - Finds the top 6 rated restaurants within 25 miles in case you'd rather go out
