from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class OwnerBase(BaseModel):
    name: str = Field(..., max_length=140)
    email: EmailStr
    phone: str = Field(..., max_length=14)

    class Config:
        from_attributes = True


class OwnerCreate(OwnerBase):
    pass


class OwnerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=140)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=14)

    class Config:
        from_attributes = True


class OwnerResponse(OwnerBase):
    id: str

    class Config:
        from_attributes = True

