const axios = require('axios');
const express = require('express');
const url = "http://127.0.0.1:10001/";
const morgan = require('morgan')
const turso = require('./db/config')
const cors = require('cors')
const app = express();


app.use(cors());
app.use(express.json())
app.use(morgan('dev'))

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

app.get("/put_departments", (req, res) => {
    const data = [
        {
            departmentCode: "CSE",
            departmentName: "Computer Science and Engineering"
        },
        {
            departmentCode: "IT",
            departmentName: "Information Technology"
        },
        {
            departmentCode: "CSIT",
            departmentName: "Computer Science and Engineering & Information Technology"
        },
        {
            departmentCode: "CSD",
            departmentName: "Computer Science and Engineering Data Science"
        },
        {
            departmentCode: "CSM",
            departmentName: "Computer Science and Engineering (AI & ML)"
        },
        {
            departmentCode: "CSC",
            departmentName: "Computer Science and Engineering Cyber Security"
        },
        {
            departmentCode: "ECE",
            departmentName: "Electronics and Communication Engineering"
        },
        {
            departmentCode: "EEE",
            departmentName: "Electrical and Electronics Engineering"
        },
        {
            departmentCode: "AE",
            departmentName: "Aeronautical Engineering"
        },
        {
            departmentCode: "ME",
            departmentName: "Mechanical Engineering"
        },
        {
            departmentCode: "CE",
            departmentName: "Civil Engineering"
        }
    ];

    const queries = data.map(department => {
        return turso.execute(`INSERT INTO Departments (departmentCode, departmentName) VALUES (?, ?)`, 
                             [department.departmentCode, department.departmentName]);
    });

    Promise.all(queries)
        .then(results => {
            res.status(200).json({ message: "Departments inserted successfully", results });
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ error });
        });
});

app.get("/get-departments",(req,res)=>{
    turso.execute("SELECT * FROM Departments ;")
    .then((resp)=>{
        res.status(200).json(resp.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json(err);
    })
})

app.post('/addStudent',(req,res)=>{
    const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG } = req.body;
    console.log(RollNumber);
    turso.execute({
        sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
	            VALUES (:rollNo,:name,:dept) ;`,
                args:{rollNo:RollNumber,name:Name,dept:Department}
    })
        .then((respp)=>{
            console.log("student Added");
            turso.execute({
                sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
                args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode}
            })
            .then((res0)=>{
                console.log("Leetcode Username added");
                turso.execute({
                    sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
                    args:{roll:RollNumber,GfG:GfG.length===0?null:GfG}
                })
                .then((res1)=>{
                    console.log("CodeChef Username added");
                    turso.execute({
                        sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
                        args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef}
                    })
                    .then((res2)=>{
                        console.log("HackerRank Username added");
                        turso.execute({
                            sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
                            args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank}
                        })
                        .then((res3)=>{
                            console.log("Leetcode Username added");
                            res.status(200).json(JSON.stringify(res3.rows));
                        })
                        .catch((er3)=>{
                            console.log(er3);
                            res.status(400).json(er3);
                        })                    })
                    .catch((er2)=>{
                        console.log(er2);
                        res.status(400).json(er2);
                    })                
                })
                .catch((er1)=>{
                    console.log(er1);
                    res.status(400).json(er0);
                })
            })
            .catch((er0)=>{
                console.log(er0);
                res.status(400).json(er0);
            })
        })
        .catch((er)=>{
            console.log(er);
            res.status(400).json(er);
        })
})

const scrap_function = (username) => {
    
}


app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
