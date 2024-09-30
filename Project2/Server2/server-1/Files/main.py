from flask import Flask, request, jsonify
from flask_cors import CORS
from bs4 import BeautifulSoup
import requests
import requests
from warnings import filterwarnings

filterwarnings('ignore')

class LeetcodeScraper:
    def __init__(self):
        self.base_url = 'https://leetcode.com/graphql'

    def scrape_user_profile(self, username):
        output = {}
        session = requests.Session()

        def scrape_problems_solved():
            json_data = {
                'query': '''
                    query userProblemsSolved($username: String!) {
                        matchedUser(username: $username) {
                            username
                            profile {
                                realName
                            }
                            submitStatsGlobal {
                                acSubmissionNum {
                                    difficulty
                                    count
                                }
                            }
                        }
                    }
                ''',
                'variables': {'username': username},
                'operationName': 'userProblemsSolved',
            }

            try:
                response = session.post(self.base_url, json=json_data, stream=True, verify=False)
                
                if response.status_code == 200:
                    data = response.json().get('data', {}).get('matchedUser', {})
                    output['username'] = data.get('username')
                    output['name'] = data.get('profile', {}).get('realName')
                    problems_solved_data = data.get('submitStatsGlobal', {}).get('acSubmissionNum', [])
                    output['problemsSolved'] = {entry['difficulty']: entry['count'] for entry in problems_solved_data}
                    print(f"Fetched user data: {output}")
                else:
                    print(f"Failed to fetch data, status code: {response.status_code}")
            except Exception as e:
                print(f'Error scraping data for username {username}: {e}')

        scrape_problems_solved()

        return output



class Scrapper():
    def __init__(self, url) -> None:
        headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://google.com'
            }
        self.url = url
        session = requests.Session()
        self.response = session.get(self.url,headers=headers)

    def eei(self):
        print("Scraping URL:", self.url)
        print("Response Status:", self.response.status_code)
        soup = BeautifulSoup(self.response.content, 'html.parser')
        print(soup.prettify()) 
        return soup.prettify()
    
    def get_res(self):
        soup = BeautifulSoup(self.response.content, 'html.parser')
        if self.response.status_code == 200:
            title = soup.title.string if soup.title else "No Title Found"
            return jsonify({"title": title})
        else:
            return jsonify({"error": "Error fetching the URL"}), 400
    
    def get_geekForGeeks(self):
        print(self.url)
        if self.response.status_code == 200:
            soup = BeautifulSoup(self.response.content, 'html.parser')
            rank = soup.find("span", class_="educationDetails_head_left_userRankContainer--text__wt81s")
            if rank:
                rank = rank.b

            MyDict = {
                "username": "",
                "Rank": int(rank.text.strip('Rank')) if rank else None
            }
            scores = soup.find_all('div', class_="scoreCard_head_left--score__oSi_x")
            if scores:
                MyDict["score"] = int(scores[0].text.strip()) if len(scores) > 0 else None
                MyDict["problems_solved"] = int(scores[1].text.strip()) if len(scores) > 1 else None
                MyDict["contest_rating"] = scores[2].text.strip() if len(scores) > 2 else None
            college_res = soup.find('div', class_="educationDetails_head_left--text__tgi9I")
            MyDict['college'] = college_res.text.strip() if college_res else None
            username_res = soup.find('div', class_="profilePicSection_head_userHandle__oOfFy")
            MyDict['username'] = username_res.text.strip() if username_res else None

            if MyDict['contest_rating'] == "__":
                MyDict['contest_rating'] = 0

            return MyDict
        else:
            print("Err")

        
    def get_CodeChef(self):
        if self.response.status_code == 200:
            soup = BeautifulSoup(self.response.content,'html.parser')
            res = soup.find("section",class_="rating-data-section problems-solved")
            res2 = res.find_all("h3")
            myDict = {
                "problems-Solved" : 0
            }
            for i in res2:
                if i.text.startswith("Total Problems Solved:"):
                    myDict['problems-Solved'] = int(i.text.strip("Total Problems Solved:"))
                if i.text.startswith("Contests"):
                    myDict['contests'] = int(i.text.strip().lstrip("Contests (").rstrip(')') )

            res = soup.find('h1',class_="h2-style")
            myDict['name'] = res.text

            res = soup.find('ul',class_="side-nav")
            re1 = res.find_all('li')
            myDict['username'] = re1[0].text.lstrip("\nUsername:").rstrip("\n").strip("7\u2605")

            return myDict
        

    def get_HackerRank(self):
        if self.response.status_code == 200:
            soup = BeautifulSoup(self.response.content,'html.parser')
            res = soup.find_all('div',class_='hacker-badge')
            myDct = {
                        "badges":{
                            "oneStarBadge": 0,
                            "twoStarBadge": 0,
                            "threeStarBadge": 0,
                            "fourStarBadge": 0,
                            "fiveStarBadge": 0
                        },
                        "certificates":{
                            "basic" : 0,
                            "intermediate":0,
                            "advanced" : 0
                        }
                    }
            for i in range(len(res)):
                re0 = res[i].find('g',class_="star-section")
                res2 = (re0.find_all('svg',class_="badge-star"))
                # myDct['badges'][f"badge-{i+1}"] = len(res2)
                if len(res2) == 1:
                    myDct['badges']['oneStarBadge'] += 1
                if len(res2) == 2:
                    myDct['badges']['twoStarBadge'] += 1
                if len(res2) == 3:
                    myDct['badges']['threeStarBadge'] += 1
                if len(res2) == 4:
                    myDct['badges']['fourStarBadge'] += 1
                if len(res2) == 5:
                    myDct['badges']['fiveStarBadge'] += 1

            res = soup.find_all('a',class_="certificate-link hacker-certificate")
            print(len(res))
            for i in range(len(res)):
                Basic = res[i].find_all("h2")
                print(Basic)
                for j in Basic:
                    j = (str(j.text).split(" "))
                    if "(Basic)" in j:
                        myDct['certificates']['basic'] += 1
                    elif "(Intermediate)" in j:
                        myDct['certificates']['intermediate'] += 1
                    elif "(Advanced)" in j:
                        myDct['certificates']['advanced'] += 1
            name = soup.find('h1',class_="hr-heading-02 profile-title ellipsis")
            myDct['name'] = name.text
            userName = soup.find('p',class_="profile-username-heading hr-body-01 hr-m-t-0.25")
            print(userName)
            myDct['username'] = userName.text.strip("@")
            return myDct

app = Flask("MyApp")
CORS(app)

@app.route("/", methods=['POST', 'GET'])
def default_page():
    scrap = Scrapper(url="https://www.geeksforgeeks.org/user/saivarunchowdarnlth/")
    return scrap.get_res()    

@app.route("/test", methods=['POST', 'GET'])
def test():
    if request.method == 'POST':
        data = request.get_json()
        a = data.get('a')
        b = data.get('b')
        sum_result = a + b
        return jsonify({"sum": sum_result})
    else:
        a = int(request.args.get('a'))
        b = int(request.args.get('b'))
        sum_result = a + b
        return jsonify({"sum": sum_result})
    
@app.route("/test_url_gfg",methods=['POST','GET'])
def test2():
    if request.method == 'POST':
        username = request.get_json()['username']
    else:
        username = request.args.get("username").strip()    
    scrp = Scrapper("https://www.geeksforgeeks.org/user/"+username)
    print(scrp.get_geekForGeeks())
    return scrp.get_geekForGeeks() or "Error Occured"

@app.route("/test_url_cc",methods=['POST','GET'])
def test3():
    if request.method == 'POST':
        username = request.get_json()['username']
    else:
        username = request.args.get("username").strip()
    scrp = Scrapper("https://www.codechef.com/users/"+username)
    resp = scrp.get_CodeChef()
    return  resp or "Error Occured"


@app.route("/test_url_lc",methods=['POST','GET'])
def test4():
    if request.method == 'POST':
        username = request.get_json()['username']
    else:
        username = request.args.get("username").strip()
    leet  =LeetcodeScraper()
    res = leet.scrape_user_profile(username)
    print(dict(res))
    return jsonify(res) or "Error Occured"

@app.route("/test_url_hrc",methods=['POST','GET'])
def test5():
    if request.method == 'POST':
        username = request.get_json()['username']
    else:
        username = request.args.get("username").strip()
    scrap = Scrapper('https://www.hackerrank.com/profile/'+username)
    res = scrap.get_HackerRank()
    return jsonify(res) or "Error Occured"


# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True, port=10001, host="0.0.0.0")
