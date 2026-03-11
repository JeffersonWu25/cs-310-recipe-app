from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from app.routes import ingredients, chat, shopping

app = FastAPI(title="Smart Pantry Assistant")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ingredients.router)
app.include_router(chat.router)
app.include_router(shopping.router)

handler = Mangum(app)
