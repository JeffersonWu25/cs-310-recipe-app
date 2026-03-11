import os
import json
from dotenv import load_dotenv
from google import genai
from google.genai import types
from app.schemas.chat import ChatMessage, IngredientIn, RecipeResult, ChatResponse

load_dotenv()

client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])

GENERATE_RECIPES_TOOL = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="generate_recipes",
            description=(
                "Generate recipe suggestions based on the user's pantry. "
                "Call this when the user is asking for recipe ideas or what they can cook. "
                "Return exactly 1 recipe they can make now and 2 that require a few extra ingredients."
            ),
            parameters=types.Schema(
                type="OBJECT",
                properties={
                    "recipes": types.Schema(
                        type="ARRAY",
                        items=types.Schema(
                            type="OBJECT",
                            properties={
                                "name": types.Schema(type="STRING"),
                                "description": types.Schema(type="STRING", description="One sentence description of the recipe"),
                                "difficulty": types.Schema(type="STRING", enum=["easy", "medium", "hard"]),
                                "time": types.Schema(type="INTEGER", description="Prep + cook time in minutes"),
                                "servings": types.Schema(type="INTEGER"),
                                "have_ingredients": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(type="STRING"),
                                    description="Ingredients the user already has"
                                ),
                                "missing_ingredients": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(type="STRING"),
                                    description="Ingredients the user needs to buy"
                                ),
                                "instructions": types.Schema(
                                    type="ARRAY",
                                    items=types.Schema(type="STRING"),
                                    description="Step-by-step cooking instructions"
                                ),
                            },
                            required=["name", "description", "difficulty", "time", "servings", "have_ingredients", "missing_ingredients", "instructions"],
                        ),
                    )
                },
                required=["recipes"],
            ),
        )
    ]
)


def build_system_prompt(ingredients: list[IngredientIn]) -> str:
    pantry = "\n".join(
        f"- {i.ingredient_name} ({i.quantity} {i.unit}, {i.category})"
        for i in ingredients
    )
    return (
        "You are a smart pantry assistant that helps users decide what to cook.\n\n"
        f"The user's current pantry:\n{pantry}\n\n"
        "If the user asks about recipes or what to cook, call the `generate_recipes` tool. "
        "Otherwise, answer their question conversationally. "
        "Keep responses concise and friendly."
    )


def build_contents(messages: list[ChatMessage], query: str) -> list[types.Content]:
    contents = []
    for msg in messages:
        role = "user" if msg.role == "user" else "model"
        contents.append(types.Content(role=role, parts=[types.Part(text=msg.content)]))
    contents.append(types.Content(role="user", parts=[types.Part(text=query)]))
    return contents


def run_chat(messages: list[ChatMessage], query: str, ingredients: list[IngredientIn]) -> ChatResponse:
    system_prompt = build_system_prompt(ingredients)
    contents = build_contents(messages, query)

    # First turn — model may call generate_recipes or respond directly
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            tools=[GENERATE_RECIPES_TOOL],
        ),
    )

    candidate = response.candidates[0].content
    function_call = next(
        (part.function_call for part in candidate.parts if part.function_call),
        None,
    )

    if function_call is None:
        # No tool call — plain conversational response
        text = next(part.text for part in candidate.parts if part.text)
        return ChatResponse(response=text, recipes=None)

    # Tool was called — extract recipes from args
    args = json.loads(function_call.args) if isinstance(function_call.args, str) else dict(function_call.args)
    recipes = [RecipeResult(**r) for r in args["recipes"]]

    # Second turn — send tool result back to get the conversational text
    contents.append(candidate)
    contents.append(
        types.Content(
            role="user",
            parts=[
                types.Part(
                    function_response=types.FunctionResponse(
                        name="generate_recipes",
                        response={"recipes": args["recipes"]},
                    )
                )
            ],
        )
    )

    follow_up = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=contents,
        config=types.GenerateContentConfig(system_instruction=system_prompt),
    )

    text = follow_up.text
    return ChatResponse(response=text, recipes=recipes)
