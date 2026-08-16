import os
from dotenv import load_dotenv
from langchain_tavily import TavilySearch
load_dotenv()
travily_API_KEY=os.getenv("TAVILY_API_KEY")



web_search = TavilySearch(

    max_results=5,
    tavily_api_key=travily_API_KEY
)