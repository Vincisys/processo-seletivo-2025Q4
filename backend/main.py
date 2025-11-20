from fastapi import FastAPI, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr, UUID4
from typing import List, Optional
from sqlalchemy import create_engine, Column, String, ForeignKey, event
from sqlalchemy.engine import Engine
from sqlalchemy.orm import sessionmaker, relationship, declarative_base, Session
from sqlalchemy.exc import IntegrityError
from uuid import uuid4

SQLALCHEMY_DATABASE_URL = "sqlite:///./sql_app.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

@event.listens_for(Engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys=ON")
    cursor.close()

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def generate_uuid():
    return str(uuid4())

class Owner(Base):
    __tablename__ = "owners"

    id = Column(String(36), primary_key=True, default=generate_uuid) 
    name = Column(String(140), nullable=False)
    email = Column(String(140), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)

    assets = relationship("Asset", back_populates="owner_rel", cascade="all, delete-orphan", passive_deletes=True)

class OwnerCreate(BaseModel):
    name: str = Field(..., max_length=140)
    email: EmailStr = Field(..., max_length=140) 
    phone: str = Field(..., max_length=20)

class OwnerUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=140)
    email: Optional[EmailStr] = Field(None, max_length=140)
    phone: Optional[str] = Field(None, max_length=20)

class OwnerSchema(OwnerCreate):
    id: UUID4

    class Config:
        orm_mode = True 

class Asset(Base):
    __tablename__ = "assets"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(140), nullable=False)
    category = Column(String(60), nullable=False)
    owner_id = Column(String(36), ForeignKey('owners.id', ondelete='CASCADE'), nullable=False)
    owner_rel = relationship("Owner", back_populates="assets")

class AssetCreate(BaseModel):
    name: str = Field(..., max_length=140)
    category: str = Field(..., max_length=60)
    owner_id: UUID4 

class AssetUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=140, description="Nome do ativo")
    category: Optional[str] = Field(None, max_length=60, description="Categoria (ex.: Aeronave, Navio)")
    owner: Optional[UUID4] = None

class AssetSchema(AssetCreate):
    id: UUID4

    class Config:
        orm_mode = True 

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="EyesOnAsset API")

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)

@app.post("/integrations/owner", response_model=OwnerSchema, status_code=status.HTTP_201_CREATED)
def create_owner(owner: OwnerCreate, db: Session = Depends(get_db)):
    db_owner = Owner(**owner.dict())

    try:
        db.add(db_owner)
        db.commit()
        db.refresh(db_owner)

        return db_owner
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado."
        )

@app.get("/integrations/owner", response_model=List[OwnerSchema])
def list_owners(db: Session = Depends(get_db)):
    return db.query(Owner).all()

@app.get("/integrations/owner/{owner_id}", response_model=OwnerSchema)
def read_owner(owner_id: UUID4, db: Session = Depends(get_db)):
    db_owner = db.query(Owner).filter(Owner.id == str(owner_id)).first()

    if db_owner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Responsável não encontrado")

    return db_owner

@app.put("/integrations/owner/{owner_id}", response_model=OwnerSchema)
def update_owner(owner_id: UUID4, owner_update: OwnerUpdate, db: Session = Depends(get_db)):
    db_owner = db.query(Owner).filter(Owner.id == str(owner_id)).first()
    if db_owner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Responsável não encontrado")

    update_data = owner_update.dict(exclude_unset=True) 
    
    for key, value in update_data.items():
        setattr(db_owner, key, value)
    
    try:
        db.commit()
        db.refresh(db_owner)
        return db_owner
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já cadastrado ou erro de integridade."
        )

@app.delete("/integrations/owner/{owner_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_owner(owner_id: UUID4, db: Session = Depends(get_db)):
    db_owner = db.query(Owner).filter(Owner.id == str(owner_id)).first()

    if db_owner is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Responsável não encontrado")
    
    db.delete(db_owner)
    db.commit()

    return

@app.post("/integrations/asset", response_model=AssetSchema, status_code=status.HTTP_201_CREATED)
def create_asset(asset: AssetCreate, db: Session = Depends(get_db)):
    owner_id_str = str(asset.owner_id)
    db_owner = db.query(Owner).filter(Owner.id == owner_id_str).first()

    if db_owner is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Responsável com ID '{owner_id_str}' não encontrado."
        )

    db_asset = Asset(
        name=asset.name,
        category=asset.category,
        owner_id=owner_id_str
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)

    return db_asset

@app.get("/integrations/asset", response_model=List[AssetSchema])
def list_assets(db: Session = Depends(get_db)):
    return db.query(Asset).all()

@app.get("/integrations/asset/{asset_id}", response_model=AssetSchema)
def read_asset(asset_id: UUID4, db: Session = Depends(get_db)):
    db_asset = db.query(Asset).filter(Asset.id == str(asset_id)).first()

    if db_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ativo não encontrado")

    return db_asset

@app.put("/integrations/asset/{asset_id}", response_model=AssetSchema)
def update_asset(asset_id: UUID4, asset_update: AssetUpdate, db: Session = Depends(get_db)):
    db_asset = db.query(Asset).filter(Asset.id == str(asset_id)).first()

    if db_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ativo não encontrado")

    update_data = asset_update.dict(exclude_unset=True) 

    if 'owner_id' in update_data:
        owner_id_str = str(update_data['owner_id'])
        db_owner = db.query(Owner).filter(Owner.id == owner_id_str).first()
        if db_owner is None:
             raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Responsável com ID '{owner_id_str}' não encontrado."
            )

        update_data['owner_id'] = owner_id_str
    
    for key, value in update_data.items():
        setattr(db_asset, key, value)
    
    db.commit()
    db.refresh(db_asset)

    return db_asset

@app.delete("/integrations/asset/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_asset(asset_id: UUID4, db: Session = Depends(get_db)):
    db_asset = db.query(Asset).filter(Asset.id == str(asset_id)).first()
    if db_asset is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Ativo não encontrado")
    
    db.delete(db_asset)
    db.commit()
    return