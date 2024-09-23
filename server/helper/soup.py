import requests
from bs4 import BeautifulSoup

# Fetch the HTML content from a URL
url = "http://127.0.0.1:5500/helper/t1.html"
response = requests.get(url)
html_content = ""

# Parse the HTML content using BeautifulSoup
soup = BeautifulSoup(html_content, "html.parser")

# Find   
elements = soup.find_all("div", class_="student-data")
for element in elements:
    name = element.find("span", class_="student-name").text
    roll_number = element.find("span", class_="student-roll-number").text
    print(f"Name: {name}, Roll Number: {roll_number}")