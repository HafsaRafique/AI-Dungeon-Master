from fastapi import FastAPI
from pydantic import BaseModel

from services.llm_service import generate_text
from services.json_parser import extract_json
from prompts.system_prompts import build_prompt
from services.memory import game_memory

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Request(BaseModel):
    input: str


@app.get("/")
def root():
    return {"status": "running"}


@app.post("/forge")
def forge(req: Request):

    try:

        prompt = build_prompt(
            req.input,
            game_memory
        )

        raw_output = generate_text(prompt)

        parsed = extract_json(raw_output)
        print(raw_output)
        if parsed:

            if "story" in parsed:
                game_memory["history"].append(
                    parsed["story"]
                )

            if "inventory" in parsed:
                game_memory["inventory"] = parsed["inventory"]

            if "location" in parsed:
                game_memory["location"] = parsed["location"]

            print(parsed)
        return parsed

    except Exception as e:
        print(e)
        return {
            "error": str(e)
        }