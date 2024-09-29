const axios = require('axios');
const express = require('express');
const url = "http://127.0.0.1:10001/";
const app = express();

const turso = require('./db/config')

const get_CodeChef = (username) => {
    console.log("CodeChef");
    return axios.post(url + "test_url_cc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching CodeChef data:", err);
            return {}; 
        }); 
};

const get_LeetCode = (username) => {
    console.log("LeetCode");
    return axios.post(url + "test_url_lc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching LeetCode data:", err);
            return {}; 
        });
};

const get_GeekForGeeks = (username) => {
    console.log("GFG");
    return axios.post(url + "test_url_gfg", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching GFG data:", err);
            return {};  
        });
};

const get_HackerRank = (username) => {
    console.log("HackerRank");
    return axios.post(url + "test_url_hrc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching HackerRank data:", err);
            return {};  
        });
};

app.get("/", (req, res) => {
    const usernames = {
        leetcode: "varun_chowdary99",
        gfg: "saivarunchowdary",
        codechef: "varun9392",
        hackerrank: "saivarunchowdar2"
    };
    const leetcodePromise = get_LeetCode(usernames.leetcode);
    const codechefPromise = get_CodeChef(usernames.codechef);
    const hackerrankPromise = get_HackerRank(usernames.hackerrank);
    const gfgPromise = get_GeekForGeeks(usernames.gfg);

    Promise.all([leetcodePromise, codechefPromise, hackerrankPromise, gfgPromise])
        .then((results) => {
            const studentData = {
                name: "Polusasu Sai Varun",
                roll: "22951A05G8",
                ScoreData: {
                    leetcode: results[0],
                    codechef: results[1],
                    hackerrank: results[2],
                    geekforgeeks: results[3]
                }
            };

            console.log(JSON.stringify(studentData));
            res.status(200).json(studentData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("An error occurred while fetching data.");
        });
});

app.get("/a",(req,res)=>{
    const usernames = {
        leetcode: "saicharan2005",
        gfg: "kundurusa1up3",
        codechef: "saicharan2701",
        hackerrank: "kundurusaicharan"
    };

    const leetcodePromise = get_LeetCode(usernames.leetcode);
    const codechefPromise = get_CodeChef(usernames.codechef);
    const hackerrankPromise = get_HackerRank(usernames.hackerrank);
    const gfgPromise = get_GeekForGeeks(usernames.gfg);

    Promise.all([leetcodePromise, codechefPromise, hackerrankPromise, gfgPromise])
        .then((results) => {
            const studentData = {
                name: "sai charan",
                roll: "22951A05G1",
                department : "CSE",
                ScoreData: {
                    leetcode: results[0],
                    codechef: results[1],
                    hackerrank: results[2],
                    geekforgeeks: results[3]
                }
            };

            console.log(JSON.stringify(studentData));
            res.status(200).json(studentData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("An error occurred while fetching data.");
        });
})

app.get("/put_departments",(req,res)=>{
    const data = {
        departmentCode : "CSE",
        departmentName : "Computer Science and Engineering"
    };
    turso.execute("DESC Departments;")
        .then((respp)=>{
            res.status(200).json(respp.rows);
        })
        .catch((eerr)=>{
            console.log(eerr)
            res.status(400).json(eerr);
        })
})
app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
