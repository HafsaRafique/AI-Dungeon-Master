def build_prompt(user_action):

    return f"""
You are an AI Craft Master.

Respond ONLY in JSON.

Format:

{{
    "story":"...",
    "theme":"fantasy|cyberpunk|horror",
    "mood":"tense|happy|mysterious",
    "image_prompt":"..."
}}

Player action:

{user_action}
"""