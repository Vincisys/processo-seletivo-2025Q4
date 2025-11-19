"""
API v1 routes
"""
from fastapi import APIRouter
from .assets import router as assets_router
from .owners import router as owners_router

api_router = APIRouter()

# Incluir rotas de assets e owners
api_router.include_router(assets_router)
api_router.include_router(owners_router)

__all__ = ["api_router"]

