from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.database import engine, Base
from app.domain.owners.models import Owner
from app.domain.assets.models import Asset
from app.domain.owners.owner_controller import router as owner_router
from app.domain.assets.assets_controller import router as asset_router
from app.domain.auth.auth_controller import router as auth_router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Eyesonasset Backend API", version="1.0.0", redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(owner_router)
app.include_router(asset_router)

@app.get("/")
def read_root():
    return {"message": "API Eyeson Backend"}


@app.get("/health")
def health_check():
    return {"status": "ok"}

