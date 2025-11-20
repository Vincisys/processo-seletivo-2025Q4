from pydantic import BaseModel, Field
from typing import Optional


class AssetBase(BaseModel):
    name: str = Field(..., max_length=140)
    category: Optional[str] = Field(None, max_length=60)
    owner_id: str


class AssetCreate(AssetBase):
    pass


class AssetUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=140)
    category: Optional[str] = Field(None, max_length=60)
    owner_id: Optional[str] = None


class AssetResponse(AssetBase):
    id: str

    class Config:
        from_attributes = True

