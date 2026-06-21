from pydantic import BaseModel

class LoreResponse(BaseModel):
    story: str
    theme: str
    mood: str
    image_prompt: str