import json

def extract_json(text: str):
    if not text:
        return None

    start = text.find("{")
    if start == -1:
        return None

    depth = 0
    in_string = False
    escape = False

    for i in range(start, len(text)):
        c = text[i]

        if c == '"' and not escape:
            in_string = not in_string

        if in_string:
            escape = (c == '\\' and not escape)
            continue

        if c == "{":
            depth += 1
        elif c == "}":
            depth -= 1

        if depth == 0:
            json_str = text[start:i+1]
            try:
                return json.loads(json_str)
            except Exception as e:
                print("JSON PARSE ERROR:", e)
                print(json_str)
                return None

    return None