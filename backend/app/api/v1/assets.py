from fastapi import APIRouter, HTTPException, status
from app.schemas.asset import AssetCreate, AssetResponse
from pydantic import ValidationError
from typing import Dict, Any

router = APIRouter(prefix="/integrations", tags=["Assets"])


@router.post(
    "/asset",
    response_model=AssetResponse,
    status_code=status.HTTP_200_OK,
    summary="Criar um novo ativo",
    description="Valida e retorna os dados de um ativo. Nível 1: apenas validação, sem persistência."
)
async def create_asset(asset: AssetCreate) -> AssetResponse:
    """
    Cria um novo ativo com validação completa.
    
    Validações:
    - Todos os campos são obrigatórios
    - id e owner devem ser UUIDs válidos
    - name: máximo 140 caracteres, não pode ser vazio
    - category: máximo 60 caracteres, não pode ser vazio
    
    Retorna os mesmos dados se válidos.
    """
    try:
        # Se chegou aqui, a validação do Pydantic já passou
        # Retornar o objeto validado
        return AssetResponse(
            id=asset.id,
            name=asset.name,
            category=asset.category,
            owner=asset.owner
        )
    except ValidationError as e:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=e.errors()
        )
