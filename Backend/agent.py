
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(
    model="gpt-4o-mini",
    temperature=0.7,
    api_key="Your-API-Key"
)

def generate_podcast_plan(guest_name: str, topic: str,tone: str = "Professional/Informative"):
    prompt = ChatPromptTemplate.from_template(
        """
        You are an AI podcast planner.
        Guest: {guest_name}
        Topic: {topic}
        INSTRUCTION: The entire plan, including the suggested questions and host dialogue, must be written in a **{tone}** style.
        Provide:
        1.Episode Title & Description
        2. A detailed Guest Profile:
        - Bio & career highlights
        - Interesting facts
        - Recent work/projects
        - Why they are relevant to the topic
        3. A short guest intro
        4. 5-7 key questions in a conversational tone
        5. Suggested episode outline with segments and approximate timings
        6. Optional icebreaker questions or fun facts
        7. 2-3 social media post ideas to promote the episode

        and any more insights that you wanna provide
        """
    )
    chain = prompt | llm 
    response = chain.invoke({"guest_name": guest_name, "topic": topic, "tone": tone })
    return response.content

def generate_suggestions(guest_name: str, topic: str):
    prompt = ChatPromptTemplate.from_template(
        """
        You are an AI assistant specialized in podcast guest recommendations.
        Given the main guest "{guest_name}" and the topic "{topic}",
        provide 3-5 distinct, relevant, and interesting personalities or topics that would make excellent follow-up podcast episodes.
        Format your response as a Markdown unordered list, starting with the header "## Similar Profile Suggestions".
        
        Example:
        ## Similar Profile Suggestions
        * Person A (Relevant Field)
        * Person B (Another Relevant Field)
        * Topic X (Related Sub-topic)
        """
    )

    chain = prompt | llm 
    response = chain.invoke({"guest_name": guest_name, "topic": topic })
    return response.content
