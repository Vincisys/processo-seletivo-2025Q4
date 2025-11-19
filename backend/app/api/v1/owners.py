from fastapi import FastAPI

app = FastAPI()

@app.post("/integrations/owner")
async def create_owner():
    return {"message": "Owner created"}

@app.get("/integrations/owner/{owner_id}")
async def get_owner(owner_id: int):
    return {"owner_id": owner_id, "name": "Sample Owner"}