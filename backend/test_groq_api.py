import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GROQ_API_KEY", "")
from groq import Groq
client = Groq(api_key=api_key)

for m in ["qwen/qwen3.8-27b", "openai/gpt-oss-20b"]:
    try:
        print(f"\n--- Testing Model: {m} ---")
        res = client.chat.completions.create(
            messages=[{"role": "user", "content": 'Return a JSON object: {"greeting": "Hello Groq", "status": "active"}'}],
            model=m,
            response_format={"type": "json_object"},
            max_tokens=60
        )
        print("Success! JSON Output:", res.choices[0].message.content.strip())
    except Exception as e:
        print(f"Error on {m}:", e)
