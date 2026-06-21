import urllib.parse

def generate_image(prompt: str):

    clean_prompt = prompt.lower().strip()

    # convert to image-friendly style
    enhanced = f"cinematic, cyberpunk style, {clean_prompt}"

    encoded = urllib.parse.quote(enhanced, safe="")

    return {
        "image_url": f"https://image.pollinations.ai/prompt/{encoded}",
        "prompt": enhanced
    }