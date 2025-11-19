"""
API v1 routes
"""
from fastapi import APIRouter
from .assets import router as assets_router

api_router = APIRouter()

# Incluir rotas de assets
api_router.include_router(assets_router)

__all__ = ["api_router"]
