from pydantic import BaseModel
from datetime import datetime


class UserCreate(BaseModel):
    login: str
    password: str


class UserResponse(BaseModel):
    id: str
    login: str
    created_at: datetime

    class Config:
        from_attributes = True

