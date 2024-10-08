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
    // console.log("CodeChef");
    return axios.post(url + "test_url_cc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching CodeChef data:", err);
            return {}; 
        }); 
};

const get_LeetCode = (username) => {
    // console.log("LeetCode");
    return axios.post(url + "test_url_lc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching LeetCode data:", err);
            return {}; 
        });
};

const get_GeekForGeeks = (username) => {
    return axios.post(url + "test_url_gfg", { username:username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching GFG data:", err);
            return {};  
        });
};

const get_HackerRank = (username) => {
    // console.log("HackerRank");
    return axios.post(url + "test_url_hrc", { username })
        .then((res) => res.data)
        .catch((err) => {
            console.error("Error fetching HackerRank data:", err);
            return {};  
        });
};

const scrap_function = (usernames,idx) => {
    // Check if LeetCode username is not empty
    if (usernames.leetcode) {
        const data_leet = get_LeetCode(usernames.leetcode);
        Promise.resolve(data_leet)
            .then((res) => {
                const name = res.name || '';
                const easy = res.problemsSolved.Easy || 0;
                const medium = res.problemsSolved.Medium || 0;
                const hard = res.problemsSolved.Hard || 0;
                const user = usernames.leetcode || '';
                turso.execute({
                    sql: `UPDATE LeetCode SET Name = :name, EasyProblemSolved = :easy, 
                            MediumProblemSolved = :medium, HardProblemSolved = :hard WHERE username = :user;`,
                    args: { name, easy, medium, hard, user }
                })
                .then((result) => {
                    console.log(idx," - LeetCode ",usernames.leetcode," Updated Successfully. Progress : 1/4 ");
                    // Check if CodeChef username is not empty
                })
                .catch((err) => {
                    console.error("LeetCode Update Failed:", err);
                });
            })
            .catch((err) => {
                console.error("Error fetching LeetCode data:", err);
            });
    }
    else{
        console.log(usernames.RollNumber+"No LeetCode account ?")
    }


    if (usernames.codechef) {
        const data_codechef = get_CodeChef(usernames.codechef);
        Promise.resolve(data_codechef)
            .then((res1) => {
                const name = res1.name || '';
                const contests = res1.contests || 0;
                const problemSolved = res1['problems-Solved'] || 0;
                const user = usernames.codechef || '';
                turso.execute({
                    sql: `UPDATE CodeChef SET Name = :name, Contests = :contests, 
                        ProblemSolved = :problemSolved WHERE Username = :user;`,
                    args: { name, contests, problemSolved, user }
                })
                .then((res_1) => {
                    console.log(idx," - CodeChef ",usernames.codechef," Updated Successfully. Progress: 2/4");
                    // Check if GeekForGeeks username is not empty
                    
                })
                .catch((err1) => {
                    console.log(err1);
                });
            })
            .catch((err1) => {
                console.log(err1);
            });
    }
    else{
        console.log(usernames.RollNumber+"No CodeChef account ?")
    }

    if (usernames.gfg) {
        const data_gfg = get_GeekForGeeks(usernames.gfg);
        Promise.resolve(data_gfg)
            .then((res12) => {
                const collegeName = res12.college || '';
                const rank = res12.Rank || null;
                const problemSolved = res12.problems_solved || 0;
                const contestRating = res12.contest_rating || 0;
                const score = res12.score || 0;
                const user = usernames.gfg || '';
                turso.execute({
                    sql: `UPDATE GeekForGeeks SET CollegeName = :collegeName, Rank_ = :rank, 
                        ProblemSolved = :problemSolved, ContestRating = :contestRating, 
                        Score = :score WHERE Username = :user;`,
                    args: { collegeName, rank, problemSolved, contestRating, score, user }
                })
                .then((res_12) => {
                    console.log(idx," - GeekForGeeks ",usernames.gfg," Updated Successfully. Progress: 3/4");
                    // Check if HackerRank username is not empty
                    
                })
                .catch((err12) => {
                    console.log(err12);
                });
            })
            .catch((err1) => {
                console.log(err1);
            });
    } else{
        console.log(usernames.RollNumber+"No GFG account ?")
    }

    if (usernames.hackerrank) {
        const data_hacker_rank = get_HackerRank(usernames.hackerrank);
        Promise.resolve(data_hacker_rank)
            .then((res123) => {
                const name = res123.name || '';
                const oneStarBadge = res123.badges.oneStarBadge || 0;
                const twoStarBadge = res123.badges.twoStarBadge || 0;
                const threeStarBadge = res123.badges.threeStarBadge || 0;
                const fourStarBadge = res123.badges.fourStarBadge || 0;
                const fiveStarBadge = res123.badges.fiveStarBadge || 0;
                const advancedCert = res123.certificates.advanced || 0;
                const intermediateCert = res123.certificates.intermediate || 0;
                const basicCert = res123.certificates.basic || 0;
                const user = usernames.hackerrank || '';
                turso.execute({
                    sql: `UPDATE HackerRank SET Name = :name, oneStarBadge = :oneStarBadge, 
                        twoStarBadge = :twoStarBadge, threeStarBadge = :threeStarBadge, 
                        fourStarBadge = :fourStarBadge, fiveStarBadge = :fiveStarBadge, 
                        AdvancedCertifications = :advancedCert, IntermediateCertifications = :intermediateCert, 
                        BasicCertifications = :basicCert WHERE Username = :user;`,
                    args: { name, oneStarBadge, twoStarBadge, threeStarBadge, 
                            fourStarBadge, fiveStarBadge, advancedCert, 
                            intermediateCert, basicCert, user }
                })
                .then((res1234) => {
                    console.log(idx," - HackerRank ",usernames.hackerrank," Updated Successfully. Progress: 4/4");
                })
                .catch((Err1234) => {
                    console.log(Err1234);
                });
            })
            .catch((err123) => {
                console.log(err123);
            });
    }
    else{
        console.log(usernames.RollNumber+"No HackerRank account ?")
    }
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

app.get("/update_all", (req, res) => {
    turso.execute(`
        SELECT 
            sd.RollNumber,
            sd.Name,
            lc.Username AS leetcode,
            cc.Username AS codechef,
            hr.Username AS hackerrank,
            gfg.Username AS gfg
        FROM 
            Student_Data sd
        LEFT JOIN 
            LeetCode lc ON sd.RollNumber = lc.RollNumber
        LEFT JOIN 
            CodeChef cc ON sd.RollNumber = cc.RollNumber
        LEFT JOIN 
            HackerRank hr ON sd.RollNumber = hr.RollNumber
        LEFT JOIN 
            GeekForGeeks gfg ON sd.RollNumber = gfg.RollNumber
        GROUP BY 
            sd.RollNumber, sd.Name, lc.Username, cc.Username, hr.Username, gfg.Username;
    `)
    .then((queryResult) => {
        // console.log(queryResult.rows)
        queryResult.rows.map((ele, idx) => {
            // console.log(`Processing entry ${idx + 1}/${queryResult.rows.length} - RollNumber: ${ele.RollNumber}, LeetCode: ${ele.leetcode}, CodeChef: ${ele.codechef}, HackerRank: ${ele.hackerrank}, GeekForGeeks: ${ele.gfg}`);
            scrap_function(ele,idx+1);
        });
        res.status(200).send("Scraping and update started. Check the console for progress.");
    })
    .catch((err) => {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Failed to execute query");
    });
});


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




app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
