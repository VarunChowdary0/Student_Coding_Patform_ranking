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
            res.status(200).json(studentData);
        })
        .catch((error) => {
            console.error("Error fetching data:", error);
            res.status(500).send("An error occurred while fetching data.");
        });
});

app.get("/update_all", (req, res) => {
    const startTime = Date.now(); 
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
        const promises = queryResult.rows.map((ele, idx) => {
            return scrap_function(ele, idx + 1);  
        });
        return Promise.all(promises);
    })
    .then(() => {
        const endTime = Date.now(); 
        const timeTaken = (endTime - startTime) / 1000; 
        turso.execute("SELECT COUNT(*) as count FROM Student_Data ;")
        .then((resppp)=>{
            // console.log(resppp.rows)
            res.status(200).send(`Scraping and update completed in ${timeTaken} seconds. Records Updates : ${resppp.rows[0]['count']}`);
        })
    })
    .catch((err) => {
        console.error("Error executing SQL query:", err);
        res.status(500).send("Failed to execute query");
    });
});


app.get('/get-all-data',(req,res)=>{
    turso.execute(
        `
           SELECT 
    sd.RollNumber AS RollUMN,
    sd.Name,
    sd.department,
    lc.Username AS lc_username,
    COALESCE(lc.EasyProblemSolved, 0) AS lc_easy,
    COALESCE(lc.MediumProblemSolved, 0) AS lc_medium,
    COALESCE(lc.HardProblemSolved, 0) AS lc_hard,
    cc.Contests AS cc_contests,
    COALESCE(cc.ProblemSolved, 0) AS cc_problemsolved,
    cc.Username AS cc_username,
    hr.Username AS hrc_username,
    COALESCE(hr.oneStarBadge, 0) AS hrc_oneStarBadge,
    COALESCE(hr.twoStarBadge, 0) AS hrc_twoStarBadge,
    COALESCE(hr.threeStarBadge, 0) AS hrc_threeStarBadge,
    COALESCE(hr.fourStarBadge, 0) AS hrc_fourStarBadge,
    COALESCE(hr.fiveStarBadge, 0) AS hrc_fiveStarBadge,
    COALESCE(hr.AdvancedCertifications, 0) AS hrc_AdvancedCertifications,
    COALESCE(hr.IntermediateCertifications, 0) AS hrc_IntermediateCertifications,
    COALESCE(hr.BasicCertifications, 0) AS hrc_BasicCertifications,
    gfg.Username AS gfg_username,
    COALESCE(gfg.Rank_, 0) AS gfg_rank,
    COALESCE(gfg.ProblemSolved, 0) AS gfg_problemSolved,
    COALESCE(gfg.ContestRating, 0) AS gfg_contestRating,
    COALESCE(gfg.Score, 0) AS gfg_score,
    ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) ) AS LC_S,
    ((COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0))) AS CC_S,
    ( (COALESCE(gfg.Score, 0)) +
            (COALESCE(gfg.ContestRating, 0) * 2) ) AS GFG_S,
    
    (
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
    ) AS HRC_S,
    (
       ( (COALESCE(lc.EasyProblemSolved, 0) * 1) +
        (COALESCE(lc.MediumProblemSolved, 0) * 3) +
        (COALESCE(lc.HardProblemSolved, 0) * 5) )+

        ((COALESCE(cc.Contests, 0) * 5) +
        (COALESCE(cc.ProblemSolved, 0)) )+
       ( (COALESCE(gfg.Score, 0)) +
        (COALESCE(gfg.ContestRating, 0) * 2)) +
       ( (COALESCE(hr.oneStarBadge, 0) * 1) +
        (COALESCE(hr.twoStarBadge, 0) * 2) +
        (COALESCE(hr.threeStarBadge, 0) * 3) +
        (COALESCE(hr.fourStarBadge, 0) * 4) +
        (COALESCE(hr.fiveStarBadge, 0) * 5) +
        (COALESCE(hr.AdvancedCertifications, 0) * 7) +
        (COALESCE(hr.IntermediateCertifications, 0) * 5) +
        (COALESCE(hr.BasicCertifications, 0) * 3))
    ) AS OverallScore,
    RANK() OVER (ORDER BY 
        (
            (COALESCE(lc.EasyProblemSolved, 0) * 1) +
            (COALESCE(lc.MediumProblemSolved, 0) * 3) +
            (COALESCE(lc.HardProblemSolved, 0) * 5) +
            (COALESCE(cc.Contests, 0) * 5) +
            (COALESCE(cc.ProblemSolved, 0)) +
            (COALESCE(gfg.Score, 0)) +
            (COALESCE(gfg.ContestRating, 0) * 2) +
            (COALESCE(hr.oneStarBadge, 0) * 1) +
            (COALESCE(hr.twoStarBadge, 0) * 2) +
            (COALESCE(hr.threeStarBadge, 0) * 3) +
            (COALESCE(hr.fourStarBadge, 0) * 4) +
            (COALESCE(hr.fiveStarBadge, 0) * 5) +
            (COALESCE(hr.AdvancedCertifications, 0) * 7) +
            (COALESCE(hr.IntermediateCertifications, 0) * 5) +
            (COALESCE(hr.BasicCertifications, 0) * 3)
        ) DESC
    ) AS rank
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
        ORDER BY 
            OverallScore DESC;
        `
    )
    .then((eess)=>{
        console.log(eess.rows)
        res.status(200).json(eess.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(500).json(err);
    })
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


const student_data = [
    {
        "RollNumber": "23955A6701",
        "Name": "Sadhu Akshaya",
        "Department": "CSD",
        "leetcode": "Akshaya_Sadhu",
        "GFG": "sadhuakst7wy",
        "HackerRank": "sadhuakshaya076",
        "CodeChef": "sadhuakshaya76"
    },
    {
        "RollNumber": "23955A6703",
        "Name": "Ramagani Bhavani",
        "Department": "CSD",
        "leetcode": "bhavani__08",
        "GFG": "bhavanirj5ku",
        "HackerRank": "bhavani_ramagani",
        "CodeChef": "suave_pixel_11"
    },
    {
        "RollNumber": "22951A0487",
        "Name": "Penkey Mahitha",
        "Department": "ECE",
        "leetcode": "PenkeyMahitha",
        "GFG": "mahithac445",
        "HackerRank": "@mahithapenkey",
        "CodeChef": "mahitha_penkey"
    },
    {
        "RollNumber": "23955a6614",
        "Name": "K sai Ganesh",
        "Department": "CSM",
        "leetcode": "Sai_ganesh23",
        "GFG": "K.saiganesh_23",
        "HackerRank": "Saiganesh_23",
        "CodeChef": "Saiganesh_23"
    },
    {
        "RollNumber": "22951A0562",
        "Name": "Kanchan Thapa ",
        "Department": "CSE",
        "leetcode": "kanchan62",
        "GFG": "kanchanthk20j3",
        "HackerRank": "kanchanthapa446",
        "CodeChef": "kanchan62"
    },
    {
        "RollNumber": "22951A6651",
        "Name": "KEERTHI KRISHNA SAH",
        "Department": "CSM",
        "leetcode": "KeerthiKrishna_2911",
        "GFG": "krishnaxcpn",
        "HackerRank": "krishna855592",
        "CodeChef": "krishna855592"
    },
    {
        "RollNumber": "23955a0513",
        "Name": "E Mitheel",
        "Department": "CSE",
        "leetcode": "Mitheeledke",
        "GFG": "mitheelo2zy",
        "HackerRank": "@mitheeledke5",
        "CodeChef": "mitheeledke"
    },
    {
        "RollNumber": "22951A33A9",
        "Name": "SWATHI SAHANI ",
        "Department": "CSIT",
        "leetcode": "pihu_6281",
        "GFG": "swathipio78d",
        "HackerRank": "@swathipihu4454",
        "CodeChef": "pihu_6281"
    },
    {
        "RollNumber": "22951A0544",
        "Name": "Kasara Geetika Reddy ",
        "Department": "CSE",
        "leetcode": "Geetika_544",
        "GFG": "22951a7neq",
        "HackerRank": "Geetika_544",
        "CodeChef": "geetika_544"
    },
    {
        "RollNumber": "22961a05r6",
        "Name": "Adepu Vishnuvardhan",
        "Department": "CSE",
        "leetcode": "vishnu123_4",
        "GFG": "visvard757s",
        "HackerRank": "@visvardhan143",
        "CodeChef": "visvardhan143"
    },
    {
        "RollNumber": "22951A6604",
        "Name": "G.Abhiram",
        "Department": "CSM",
        "leetcode": "abhiram4957",
        "GFG": "abhirao9h0",
        "HackerRank": "abhiram4957",
        "CodeChef": "abhiram11"
    },
    {
        "RollNumber": "22951A05K0",
        "Name": "Annaldas Shivani",
        "Department": "CSE",
        "leetcode": "shivaniannaldas",
        "GFG": "shivaniannaldas20",
        "HackerRank": "shivaniannaldas",
        "CodeChef": "shivania"
    },
    {
        "RollNumber": "22951A05G6",
        "Name": "Sai Teja",
        "Department": "CSE",
        "leetcode": "saiteja5281",
        "GFG": "saiteja5281",
        "HackerRank": "saiteja5281",
        "CodeChef": "saiteja5281"
    },
    {
        "RollNumber": "22951A05G7",
        "Name": "Sai Vamsi Sirikonda",
        "Department": "CSE",
        "leetcode": "SaiVamsi22",
        "GFG": "saivamsi228698f",
        "HackerRank": "SaiVamsi22",
        "CodeChef": "saivamsi22"
    },
    {
        "RollNumber": "22951A05E1",
        "Name": "Vookanti Prachethan Reddy ",
        "Department": "CSE",
        "leetcode": "prachethanvookanti",
        "GFG": "prachethanc4ne",
        "HackerRank": "prachethanvooka1",
        "CodeChef": " ample_salt_70"
    },
    {
        "RollNumber": "22951A05F0",
        "Name": "EEGALAPATI RISHI YOGITHA",
        "Department": "CSE",
        "leetcode": " egalapatirishiyogitha@gmail.com ",
        "GFG": "22951a05f0@iare.ac.in",
        "HackerRank": "egalapatirishiyogitha@gmail.com",
        "CodeChef": "rishiyogitha"
    },
    {
        "RollNumber": "22951a6753",
        "Name": "Naregudem Kartik Teja",
        "Department": "CSD",
        "leetcode": "kartikteja343",
        "GFG": "kartiktdg6y",
        "HackerRank": "kartikteja343",
        "CodeChef": "kartikteja"
    },
    {
        "RollNumber": "22951A04J2 ",
        "Name": "Golla shivani",
        "Department": "ECE",
        "leetcode": "Gollashivanii",
        "GFG": "shivanigprja",
        "HackerRank": "Golla shivani",
        "CodeChef": "Shivani0012"
    },
    {
        "RollNumber": "22951A05J2",
        "Name": "M Sharath Chandra",
        "Department": "CSE",
        "leetcode": "Sharathchandra2005",
        "GFG": "sharathchandra07",
        "HackerRank": "msharathchandra3",
        "CodeChef": "chandra732005"
    },
    {
        "RollNumber": "22951A0478",
        "Name": "Lingam Lakshmi Vagdevi ",
        "Department": "ECE",
        "leetcode": "22951A0478",
        "GFG": "22951awx16",
        "HackerRank": "lsuresh45@gmail.com",
        "CodeChef": "a0478"
    },
    {
        "RollNumber": "22951a62c3",
        "Name": "Lakshmi Shivani P",
        "Department": "CSC",
        "leetcode": "lakshmi_shivani",
        "GFG": "shiavni08",
        "HackerRank": "shivani_485",
        "CodeChef": "shivani_845"
    },
    {
        "RollNumber": "22951A0580",
        "Name": "BATTULA KIRAN SREE",
        "Department": "CSE",
        "leetcode": "bkiransree",
        "GFG": "22951ahd6y",
        "HackerRank": "bkiransree2005",
        "CodeChef": "kiransree"
    },
    {
        "RollNumber": "22951a1237",
        "Name": "N.KRUPESH",
        "Department": "IT",
        "leetcode": "Krupesh_27",
        "GFG": "Krupesh_27",
        "HackerRank": "Krupesh_27",
        "CodeChef": "Krupesh_27"
    },
    {
        "RollNumber": "22951A33C3",
        "Name": "Gorrepati Anoop Chand",
        "Department": "CSIT",
        "leetcode": "user0362nx",
        "GFG": "anoopgorgox1",
        "HackerRank": "@anoop_gorrepati",
        "CodeChef": "class_dive_48"
    },
    {
        "RollNumber": "22951A1249",
        "Name": "Pavuluri Meghana",
        "Department": "IT",
        "leetcode": "meghanapavuluri",
        "GFG": "meghana731",
        "HackerRank": "meghana431",
        "CodeChef": "meghana3112"
    },
    {
        "RollNumber": "23955A6717",
        "Name": "SOWJANYA KODAM",
        "Department": "CSD",
        "leetcode": "sowjanyakodam",
        "GFG": "sowjanyakn8as",
        "HackerRank": "@sowjanyakodam201",
        "CodeChef": "sowjanyakodam"
    },
    {
        "RollNumber": "22951A67B5",
        "Name": "PANDIRI SAI SRUJAN",
        "Department": "CSD",
        "leetcode": "SaiSrujan04",
        "GFG": "pandirisayx2t",
        "HackerRank": "Dillu Pandirivenkat",
        "CodeChef": "srujan4705"
    },
    {
        "RollNumber": "22951A6772",
        "Name": "Gopalapuram Nanda kishor",
        "Department": "CSD",
        "leetcode": "Nanda_72",
        "GFG": "nanda_72",
        "HackerRank": "nandakishor6772",
        "CodeChef": "nanda_72"
    },
    {
        "RollNumber": "22951A04G8",
        "Name": "GUNDU SATHWIKA",
        "Department": "ECE",
        "leetcode": "Sathwika_Gundu",
        "GFG": "sathwikag8zbx",
        "HackerRank": "sathwikagundu923",
        "CodeChef": "sathwika_gundu"
    },
    {
        "RollNumber": "22951a05r8",
        "Name": "Gangishetty vishwateja ",
        "Department": "CSE",
        "leetcode": "vishwateja2345",
        "GFG": "vishwateja2345",
        "HackerRank": "vishwateja2345",
        "CodeChef": "vishwateja2345"
    },
    {
        "RollNumber": "22951a6786",
        "Name": "Grandhi Praveen",
        "Department": "CSD",
        "leetcode": "grandhi_praveen",
        "GFG": "praveen04",
        "HackerRank": "praveenprince643",
        "CodeChef": "fave_hint_32"
    },
    {
        "RollNumber": "22951A62C2",
        "Name": "Yuva Kiran",
        "Department": "CSC",
        "leetcode": "Yuva Kiran",
        "GFG": "22951alqt2",
        "HackerRank": "KANAMARLAPUDI YUVA KIRAN",
        "CodeChef": "yuvakiran"
    },
    {
        "RollNumber": "22951A1230 ",
        "Name": "Kathyayani Ellenki ",
        "Department": "IT",
        "leetcode": "Kathyayani14",
        "GFG": "kathyayani15",
        "HackerRank": "Kathyayani ",
        "CodeChef": "kathyayani14"
    },
    {
        "RollNumber": "22951A6676",
        "Name": "N.Neha",
        "Department": "CSM",
        "leetcode": "nehareddy05",
        "GFG": "nehareddy05",
        "HackerRank": "NINGAMPALLY NEHA ",
        "CodeChef": "nehareddy05"
    },
    {
        "RollNumber": "22951A6717",
        "Name": "Bhanu Tej Pailla",
        "Department": "CSD",
        "leetcode": " KXzrHYYOw2",
        "GFG": "22951akyln",
        "HackerRank": "22951a6717",
        "CodeChef": "bhanutej13"
    },
    {
        "RollNumber": "22951A05H7",
        "Name": "Shaik Haleema Anjum",
        "Department": "CSE",
        "leetcode": "haleemaanjum21",
        "GFG": "22951aq301",
        "HackerRank": "anjum212005",
        "CodeChef": "anjum_212005"
    },
    {
        "RollNumber": "23955a6609",
        "Name": "Bootla Manasa",
        "Department": "CSM",
        "leetcode": "ManasaBootla",
        "GFG": "bootlamlvkz",
        "HackerRank": "BOOTLA MANASA",
        "CodeChef": "bmanasa08"
    },
    {
        "RollNumber": "22951A0514",
        "Name": "Rachuri Akhila",
        "Department": "CSE",
        "leetcode": "Akhila_Rachuri_05",
        "GFG": "22951a7u7p",
        "HackerRank": "@22951a0514",
        "CodeChef": "akhila2005"
    },
    {
        "RollNumber": "22951a1293",
        "Name": "NEERADI SRAVAN KUMAR",
        "Department": "IT",
        "leetcode": "sravansenpai",
        "GFG": "sravan_senpai",
        "HackerRank": "sravansenpai",
        "CodeChef": "sravansenpai"
    },
    {
        "RollNumber": "22951A1231",
        "Name": "KEERTHANA KETHAVATH",
        "Department": "IT",
        "leetcode": "Keerthana_2704",
        "GFG": "22951aylxb",
        "HackerRank": "22951a1231",
        "CodeChef": "keerthana_2703"
    },
    {
        "RollNumber": "22951A6673",
        "Name": "Dharmarajula Naga Panindra",
        "Department": "CSM",
        "leetcode": "nagapanindra562",
        "GFG": "nagapanindra562",
        "HackerRank": "nagapanindra562",
        "CodeChef": "naga2609"
    },
    {
        "RollNumber": "22951A6663",
        "Name": "MANI GANESHWARI DONGA",
        "Department": "CSM",
        "leetcode": "Maniganeshwari_1306",
        "GFG": "maniganeshwari",
        "HackerRank": "maniganeshwari13",
        "CodeChef": "mani_1306"
    },
    {
        "RollNumber": "23955A3301 ",
        "Name": "Adithya Mittapally ",
        "Department": "CSIT",
        "leetcode": "adithyaglobal",
        "GFG": "adithyaglobal",
        "HackerRank": "adithyaglobal",
        "CodeChef": "adithyaglobal "
    },
    {
        "RollNumber": "22951A3362",
        "Name": "Vemireddy Narmada ",
        "Department": "CSIT",
        "leetcode": "narmada_0310",
        "GFG": "Vemireddyn5i11",
        "HackerRank": "@vemireddynarmad1",
        "CodeChef": "happy_cheetah"
    },
    {
        "RollNumber": "22951A66J6",
        "Name": "YUVARAJ VASAM",
        "Department": "CSM",
        "leetcode": "yuvarajvasam",
        "GFG": "yuvarajvasam",
        "HackerRank": "yuvarajvasam",
        "CodeChef": "yuvarajvasam"
    },
    {
        "RollNumber": "22951A3335",
        "Name": "Jahnavi Varaganti",
        "Department": "CSIT",
        "leetcode": "jahnavi3045",
        "GFG": "jahnavi_3045",
        "HackerRank": "jahnavi3045",
        "CodeChef": "--"
    },
    {
        "RollNumber": "22951a6286",
        "Name": "Manasa Shetiya",
        "Department": "CSC",
        "leetcode": "manasashetiya",
        "GFG": "22951a5f4d",
        "HackerRank": "MANASA SHETIYA",
        "CodeChef": "a6286"
    },
    {
        "RollNumber": "22951a1222",
        "Name": "Marka Harini",
        "Department": "IT",
        "leetcode": "harini_marka",
        "GFG": "markaharini1203",
        "HackerRank": "hariniyadav1203",
        "CodeChef": "markaharini"
    },
    {
        "RollNumber": "22951a6771",
        "Name": "Akambaram Nagaraju ",
        "Department": "CSD",
        "leetcode": "svnagaraju4457",
        "GFG": "nagaraju008",
        "HackerRank": "22951a6771",
        "CodeChef": "nagaraju816"
    },
    {
        "RollNumber": "22951A62B4",
        "Name": "Banda Vigneshwar",
        "Department": "CSC",
        "leetcode": "vigneshwar_banda",
        "GFG": "vigneshwacxou",
        "HackerRank": "prudvikolreia",
        "CodeChef": "vigneshwar04"
    },
    {
        "RollNumber": "22951A05P3",
        "Name": "PARIPELLY VAISHNAVI",
        "Department": "CSE",
        "leetcode": "paripelly_vaishnavi",
        "GFG": "PARIPELLY VAISHNAVI",
        "HackerRank": "PARIPELLY VAISHNAVI",
        "CodeChef": "PARIPELLY VAISHNAVI"
    },
    {
        "RollNumber": "22951A66A7",
        "Name": "Sai Samrat Dudgundi",
        "Department": "CSM",
        "leetcode": "samrat4002",
        "GFG": "samrat4002",
        "HackerRank": "samrat4002",
        "CodeChef": "samrat_d"
    },
    {
        "RollNumber": "22951A05C2",
        "Name": "Chitturi Niharika",
        "Department": "CSE",
        "leetcode": "niharika_1312",
        "GFG": "niharikachv9d3",
        "HackerRank": "@niharikachittur1",
        "CodeChef": "niharika_1312"
    },
    {
        "RollNumber": "22951A67B6",
        "Name": "Nirmal Sai Swaroop Janapaneedi ",
        "Department": "CSD",
        "leetcode": "nirmal7463",
        "GFG": "nirmals0vs",
        "HackerRank": "nirmal7463",
        "CodeChef": "nirmal7463"
    },
    {
        "RollNumber": "22951A66B1",
        "Name": "Munigeti Sai Varshith ",
        "Department": "CSM",
        "leetcode": "SaiVarshith25 ",
        "GFG": "munigetisai2314",
        "HackerRank": "munigetisaivars1",
        "CodeChef": "saivarshith555"
    },
    {
        "RollNumber": "22951A0504",
        "Name": "Kaveti Abhinaya",
        "Department": "CSE",
        "leetcode": "K_ABHINAYA7",
        "GFG": "kabhinaya7",
        "HackerRank": "KAVETI ABHINAYA",
        "CodeChef": "abhinaya1037"
    },
    {
        "RollNumber": "22951A1243",
        "Name": "Likhita",
        "Department": "IT",
        "leetcode": "likhitakaipu",
        "GFG": "likhitaqlc1",
        "HackerRank": "Likhita Kaipu",
        "CodeChef": "likhita_r2004"
    },
    {
        "RollNumber": "22951A04C5",
        "Name": "Swamulapallypranithchary@gmail.com",
        "Department": "ECE",
        "leetcode": "22951A04C5",
        "GFG": "swamulapallypctro",
        "HackerRank": "@swamulapallypra1",
        "CodeChef": "vivas_stone_05"
    },
    {
        "RollNumber": "22951A0541",
        "Name": "Malepu.Digvija",
        "Department": "CSE",
        "leetcode": "malepu_digvija_19",
        "GFG": "22951A0541@iare.ac.in",
        "HackerRank": "22951A0541@iare.ac.in",
        "CodeChef": "22951A0541@iare.ac.in"
    },
    {
        "RollNumber": "22951A04N3",
        "Name": "Rangu Vedagna",
        "Department": "ECE",
        "leetcode": "Vedagna_Rangu",
        "GFG": "vedagna1211",
        "HackerRank": "Vedagna_Rangu",
        "CodeChef": "vedagna_12"
    },
    {
        "RollNumber": "22951A3310",
        "Name": "Gadepaka Bhanu priya",
        "Department": "CSIT",
        "leetcode": "Bhanu Priya Gadepaka",
        "GFG": "bhanugapl98",
        "HackerRank": "Bhanu Priya",
        "CodeChef": "bhanugadepaka"
    },
    {
        "RollNumber": "22951A68A1",
        "Name": "Renuka  Pani",
        "Department": "CSD",
        "leetcode": "Renuka_pani",
        "GFG": "paniren5g8g",
        "HackerRank": "panirenuka514",
        "CodeChef": "renuka_pani"
    },
    {
        "RollNumber": "22951A33A3",
        "Name": "INALA SRUTHI",
        "Department": "CSIT",
        "leetcode": "sruthi_inala",
        "GFG": "22951ale0o",
        "HackerRank": "@22951a33a3",
        "CodeChef": "zeal_farm_64"
    },
    {
        "RollNumber": "23955A6718",
        "Name": "EERLA VENKATESH",
        "Department": "CSD",
        "leetcode": "venkatesh_799",
        "GFG": "venkatesh6pjh",
        "HackerRank": "23955a6718",
        "CodeChef": "venkatesheerla"
    },
    {
        "RollNumber": "22951A6774",
        "Name": "NIKIL BANALA",
        "Department": "CSD",
        "leetcode": "nikhil_banala",
        "GFG": "nikhil_banala",
        "HackerRank": "nikhilb123k",
        "CodeChef": "nikhil_banala"
    },
    {
        "RollNumber": "22951A0546",
        "Name": "BITLA HARIKA",
        "Department": "CSE",
        "leetcode": "bitlaharika",
        "GFG": "bitlaharika_45",
        "HackerRank": "@22951a0546",
        "CodeChef": "bitlaharika"
    },
    {
        "RollNumber": "22951A05M9",
        "Name": "Poonam Suthar",
        "Department": "CSE",
        "leetcode": "Ue5svp7HvB",
        "GFG": "22951azgp8",
        "HackerRank": "poonamsuthar2704",
        "CodeChef": "poonam_2704"
    },
    {
        "RollNumber": "22951a6793",
        "Name": "KANCHAPOGU RAJESH",
        "Department": "CSD",
        "leetcode": "Rajeshrrln",
        "GFG": "rajeshkan37yg",
        "HackerRank": "rajeshkanchapog1",
        "CodeChef": "rajeshrr"
    },
    {
        "RollNumber": "22951A67B2 ",
        "Name": "P Sai Moneeth ",
        "Department": "CSD",
        "leetcode": "Moneeth25",
        "GFG": "Moneeth25",
        "HackerRank": "Sai Moneeth",
        "CodeChef": "moneeth"
    },
    {
        "RollNumber": "23955A6714",
        "Name": "Rithvik Teja Gandla",
        "Department": "CSD",
        "leetcode": "mr_rithvik_",
        "GFG": "rithviktexkus",
        "HackerRank": "rithviktejagand1",
        "CodeChef": "rithvikteja24"
    },
    {
        "RollNumber": "22951A67B8",
        "Name": "P Sai Vishal",
        "Department": "CSD",
        "leetcode": "Sai Vishal",
        "GFG": "psv99kd3l",
        "HackerRank": "Sai Vishal",
        "CodeChef": "vishal_6s9"
    },
    {
        "RollNumber": "22951A05H1",
        "Name": "Chokkam Saketh Varma",
        "Department": "CSE",
        "leetcode": "Sakethvarma9182",
        "GFG": "22951abiw7",
        "HackerRank": "saketh0926",
        "CodeChef": "saketh0926"
    },
    {
        "RollNumber": "22951A67B1",
        "Name": "N Sai Kishore",
        "Department": "CSD",
        "leetcode": "saikishore_30",
        "GFG": "saikishore_30",
        "HackerRank": "saikishore_30",
        "CodeChef": "saikishore_30"
    },
    {
        "RollNumber": "23955A0511",
        "Name": "PODETI HARSHAVARDHAN",
        "Department": "CSE",
        "leetcode": "Harshavardhan_05",
        "GFG": "podetiharsw9ki",
        "HackerRank": "podetiharshavar1",
        "CodeChef": "harsha23955"
    },
    {
        "RollNumber": "22951A05H4",
        "Name": "POLAREDDY SANJANA",
        "Department": "CSE",
        "leetcode": "sanju_2382",
        "GFG": "22951at8ud",
        "HackerRank": "22951A05H4",
        "CodeChef": "sanju_236"
    },
    {
        "RollNumber": "22951a67f8",
        "Name": "Mettu Vaishnavi",
        "Department": "CSD",
        "leetcode": "mettuvaishnavi",
        "GFG": "mettuvaisbatf",
        "HackerRank": "mettuvaishnavi37",
        "CodeChef": "mettuvaishnavi"
    },
    {
        "RollNumber": "22951A0466",
        "Name": "Podakanti Hema Sri ",
        "Department": "ECE",
        "leetcode": "22951A0466@iare.ac.in",
        "GFG": "22951A0466@iare.ac.in",
        "HackerRank": "22951A0466@iare.ac.in",
        "CodeChef": "22951A0466@iare.ac.in"
    },
    {
        "RollNumber": "22951A6285",
        "Name": "Shaik Umar",
        "Department": "CSC",
        "leetcode": "Shaik Umar",
        "GFG": "22951ai239",
        "HackerRank": "22951A6285",
        "CodeChef": "shaikumar"
    },
    {
        "RollNumber": "22951A6668",
        "Name": "M.V.S.S.MEGHANA",
        "Department": "CSM",
        "leetcode": "Meghana__97",
        "GFG": "meghanazcsr",
        "HackerRank": "meghana mvss",
        "CodeChef": "meghana_mvss"
    },
    {
        "RollNumber": "22951A67C4",
        "Name": "N.Sathwik",
        "Department": "CSD",
        "leetcode": "Sathwik_N",
        "GFG": "noomurisaermf",
        "HackerRank": "N.Sathwik",
        "CodeChef": "sathwik130"
    },
    {
        "RollNumber": "22951A0482",
        "Name": "HATKAR LITHIK RAJ",
        "Department": "ECE",
        "leetcode": "22951A0482",
        "GFG": "Lithik",
        "HackerRank": "22951a0482",
        "CodeChef": "Lithik"
    },
    {
        "RollNumber": "22951A0574",
        "Name": "Pasula Kavya",
        "Department": "CSE",
        "leetcode": "kavya_pasula",
        "GFG": "kavyapat3jn",
        "HackerRank": "Kavya Pasula",
        "CodeChef": "kavya1854"
    },
    {
        "RollNumber": "22951A05D1",
        "Name": "Sahasra Pentela",
        "Department": "CSE",
        "leetcode": "Sahasra_1735",
        "GFG": "22951agtz3",
        "HackerRank": "PENTELA OM SRI SAI SAHASRA",
        "CodeChef": "valid_ducks_38"
    },
    {
        "RollNumber": "22951a6234",
        "Name": "MYLAVARAPU KRISHNA BASWANTH SUHDINDRA",
        "Department": "CSC",
        "leetcode": "sudhindra0265",
        "GFG": "sudhindra0265",
        "HackerRank": "sudhindra0265",
        "CodeChef": "sudhindra0265"
    },
    {
        "RollNumber": "22951A05G4",
        "Name": "Sai prasanna ",
        "Department": "CSE",
        "leetcode": "saiprasanna_19",
        "GFG": "22951A05G4@iare.ac.in",
        "HackerRank": "saiprasanna_19",
        "CodeChef": "saiprasanna_19"
    },
    {
        "RollNumber": "22951A6245",
        "Name": "Ganji Neelakanta",
        "Department": "CSC",
        "leetcode": "neelakanta4",
        "GFG": "neelakanta30",
        "HackerRank": "neelakanta30",
        "CodeChef": "neelakanta04"
    },
    {
        "RollNumber": "22951A6213",
        "Name": "TULASE BHAVAN ARYA",
        "Department": "CSC",
        "leetcode": "code-arya",
        "GFG": "code_arya",
        "HackerRank": "bhavanaryatulase",
        "CodeChef": "code_arya"
    },
    {
        "RollNumber": "22951a6719",
        "Name": "Gajula Bharath Kumar",
        "Department": "CSD",
        "leetcode": "gajulabharath",
        "GFG": "gajulabhkvlh",
        "HackerRank": "gajulabharath2",
        "CodeChef": "wisdom_ravens"
    },
    {
        "RollNumber": "22951A0533",
        "Name": "P.CHANDRA SAI AKHIL",
        "Department": "CSE",
        "leetcode": "akhilchandra4735",
        "GFG": "akhilchanoyx3",
        "HackerRank": "akhilchandra4735",
        "CodeChef": "akhilchandra47"
    },
    {
        "RollNumber": "22951a67g2",
        "Name": "vennam varshini",
        "Department": "CSD",
        "leetcode": "vennamvarshini2005",
        "GFG": "vennamvars94z1",
        "HackerRank": "vennamvarshini21",
        "CodeChef": "vennamvarshini"
    },
    {
        "RollNumber": "22951A0465",
        "Name": "Edupuganti Harshitha ",
        "Department": "ECE",
        "leetcode": "22951A0465",
        "GFG": "harshitha_e",
        "HackerRank": "e_harshitha",
        "CodeChef": "harshitha_e"
    },
    {
        "RollNumber": "22951A04L1",
        "Name": "Sujan Reddy",
        "Department": "ECE",
        "leetcode": "sujanreddy13",
        "GFG": "sujanreq7vj",
        "HackerRank": "@sujanreddy610",
        "CodeChef": "sujanreddy610"
    },
    {
        "RollNumber": "22951A04A9",
        "Name": "Kolapalli Nirosh Kumar",
        "Department": "ECE",
        "leetcode": "22951A04A9",
        "GFG": "nirosh_11",
        "HackerRank": "nirosh_11",
        "CodeChef": "nirosh_11"
    },
    {
        "RollNumber": "22951A6219",
        "Name": "E. Deepak",
        "Department": "CSC",
        "leetcode": "Deepak_E",
        "GFG": "22951agn5s",
        "HackerRank": "@22951a6219",
        "CodeChef": "deepak_e"
    },
    {
        "RollNumber": "22951A33A4",
        "Name": "Sudarshan Rao",
        "Department": "CSIT",
        "leetcode": "Zudron",
        "GFG": "sudrafhz2",
        "HackerRank": "sudrao21",
        "CodeChef": "zudron"
    },
    {
        "RollNumber": "22951a62a0",
        "Name": "Dasari Suresh ",
        "Department": "CSC",
        "leetcode": "suresh960",
        "GFG": "22951a3s8i",
        "HackerRank": "22951a62a0",
        "CodeChef": "suresh_130"
    },
    {
        "RollNumber": "22951A62C0",
        "Name": "Begari yashwanth",
        "Department": "CSC",
        "leetcode": "yash84151(id: 1E4gg0I7hZ)",
        "GFG": "22951apocy",
        "HackerRank": "BEGARI YASHWANTH(@22951A62C0)",
        "CodeChef": "blaze_deed_22"
    },
    {
        "RollNumber": "22951a04b8",
        "Name": "CH. PAVANI",
        "Department": "ECE",
        "leetcode": "pavanireddy",
        "GFG": "pavanireddy9598@gmail.com",
        "HackerRank": "pavanireddy9598@gmail.com",
        "CodeChef": "pavanireddy9598@gmail.com"
    },
    {
        "RollNumber": "22951A6792",
        "Name": "Rahul bandi",
        "Department": "CSD",
        "leetcode": "its_rahul_bandi",
        "GFG": "mrrahulb5k1b",
        "HackerRank": "no",
        "CodeChef": "rahulbandi54"
    },
    {
        "RollNumber": "22951a6788",
        "Name": "prudvik",
        "Department": "CSD",
        "leetcode": "prudvi134",
        "GFG": "prudvikolreia",
        "HackerRank": "no",
        "CodeChef": "prudvikolipaka"
    },
    {
        "RollNumber": "22951A05G8",
        "Name": "P Sai Varun",
        "Department": "CSE",
        "leetcode": "Varun_chowdary99",
        "GFG": "saivarunchowdary",
        "HackerRank": "saivarunchowdar2",
        "CodeChef": "saivarunchowdarypoludasu"
    },
    {
        "RollNumber": "22951A1206",
        "Name": "Anusha Nama",
        "Department": "IT",
        "leetcode": "anusha_191",
        "GFG": "anushaa4bvn",
        "HackerRank": "@anushaammu191",
        "CodeChef": "colony_idea_69"
    },
    {
        "RollNumber": "22951A62C1",
        "Name": "HEMANTH YERRA",
        "Department": "CSC",
        "leetcode": "hemanth2918",
        "GFG": "hemanth8k10",
        "HackerRank": "@hemanthyerra9",
        "CodeChef": "hemanth2918"
    },
    {
        "RollNumber": "22951A05E3",
        "Name": "Geedipally Pujitha Reddy",
        "Department": "CSE",
        "leetcode": "__pujithareddy",
        "GFG": "22951ameyz",
        "HackerRank": "pujithareddy1920",
        "CodeChef": "pujitha_9"
    },
    {
        "RollNumber": "23955A6715",
        "Name": "KAMMARI SADGURU SAI",
        "Department": "CSD",
        "leetcode": "ksadgurusai",
        "GFG": "sadguru03",
        "HackerRank": "kammarisadgurus1",
        "CodeChef": "ksadgurusai"
    },
    {
        "RollNumber": "22951A12A3",
        "Name": "k sumanth",
        "Department": "IT",
        "leetcode": "kamutalasumanth1",
        "GFG": "22951a97h7",
        "HackerRank": "22951A12A3",
        "CodeChef": "sumanth84"
    },
    {
        "RollNumber": "22951A1289",
        "Name": "Kusuma Siddhartha ",
        "Department": "IT",
        "leetcode": "siddhartha44",
        "GFG": "22951A1289",
        "HackerRank": "22951A12891",
        "CodeChef": "ksiddhartha14"
    },
    {
        "RollNumber": "22951A0433",
        "Name": "C Bharath Kumar ",
        "Department": "ECE",
        "leetcode": "cbharath29 ",
        "GFG": "cbharath29 ",
        "HackerRank": "22951a0433",
        "CodeChef": "cbharath29 "
    },
    {
        "RollNumber": "22951A04J1",
        "Name": "Kurra Shivamani ",
        "Department": "ECE",
        "leetcode": "Kurra-shivamani19",
        "GFG": "kurrashiruco",
        "HackerRank": "KURRA SHIVAMANI @22951a04j1",
        "CodeChef": "shivamani19"
    },
    {
        "RollNumber": "22951a0418",
        "Name": "J Anudeep Sai",
        "Department": "ECE",
        "leetcode": "Anudeep_70",
        "GFG": "anudeep_70",
        "HackerRank": "@anudeep54549",
        "CodeChef": "anudeep_70"
    },
    {
        "RollNumber": "22951A0416 ",
        "Name": "ChokkallaAnkith ",
        "Department": "ECE",
        "leetcode": "22951a0416@iare.ac.in",
        "GFG": "22951af6we",
        "HackerRank": "22951A0416@iare.ac.in",
        "CodeChef": "ankith_16"
    },
    {
        "RollNumber": "22951a0464",
        "Name": "MADDURI HARISH ",
        "Department": "ECE",
        "leetcode": "22951A0464",
        "GFG": "22951a0464",
        "HackerRank": "22951a0464@iare.ac.in",
        "CodeChef": "harish_464"
    },
    {
        "RollNumber": "22951a0432",
        "Name": "Nerella Bharath Ganesh",
        "Department": "ECE",
        "leetcode": "bharathganeshn",
        "GFG": "nerellaganesh55",
        "HackerRank": "nerellaganesh55",
        "CodeChef": "ganesh_54123"
    },
    {
        "RollNumber": "22951A6777",
        "Name": "ILAPURAM PAVAN",
        "Department": "CSD",
        "leetcode": "Pavan1729",
        "GFG": "ilapuramp8x7p",
        "HackerRank": "@Ilapuram_pavan",
        "CodeChef": "ilapurampavan1"
    }
];

app.get('/qwertyuiop', async (req, res) => {
    try {
        // Use Promise.all to wait for all requests to complete
        const results = await Promise.all(student_data.map(async (data) => {
            try {
                await axios.post(url + "/addStudent", data);
                console.log("✅ Student added successfully,", data.RollNumber);
                return { rollNumber: data.RollNumber, status: "success" };
            } catch (err) {
                console.log("❌ Failed to add student, please try again later,", data.RollNumber);
                return { rollNumber: data.RollNumber, status: "failure", error: err.message };
            }
        }));

        res.status(200).json({
            message: "Processing completed",
            results
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred" });
    }
});


// const addStudents_all = (student_data,res) =>{
//     const { RollNumber,Name,Department,leetcode,CodeChef,HackerRank,GfG } = student_data;
//     console.log(RollNumber);
//     turso.execute({
//         sql:`INSERT INTO Student_Data(RollNumber,Name,Department)
// 	            VALUES (:rollNo,:name,:dept) ;`,
//                 args:{rollNo:RollNumber,name:Name,dept:Department}
//     })
//         .then((respp)=>{
//             console.log("student Added");
//             turso.execute({
//                 sql:"INSERT INTO LeetCode(RollNumber,Username) VALUES(:roll,:leetcode);",
//                 args:{roll:RollNumber,leetcode:leetcode.length===0?null:leetcode.replace(/@/g, "")}
//             })
//             .then((res0)=>{
//                 console.log("Leetcode Username added");
//                 turso.execute({
//                     sql:"INSERT INTO GeekForGeeks(RollNumber,Username) VALUES(:roll,:GfG);",
//                     args:{roll:RollNumber,GfG:GfG.length===0?null:GfG.replace(/@/g, "")}
//                 })
//                 .then((res1)=>{
//                     console.log("CodeChef Username added");
//                     turso.execute({
//                         sql:"INSERT INTO CodeChef(RollNumber,Username) VALUES(:roll,:CodeChef);",
//                         args:{roll:RollNumber,CodeChef:CodeChef.length===0?null:CodeChef.replace(/@/g, "")}
//                     })
//                     .then((res2)=>{
//                         console.log("HackerRank Username added");
//                         turso.execute({
//                             sql:"INSERT INTO HackerRank(RollNumber,Username) VALUES(:roll,:HackerRank);",
//                             args:{roll:RollNumber,HackerRank:HackerRank.length===0?null:HackerRank.replace(/@/g, "")}
//                         })
//                         .then((res3)=>{
//                             console.log("Leetcode Username added");
//                             res.status(200).json(JSON.stringify(res3.rows));
//                         })
//                         .catch((er3)=>{
//                             console.log(er3);
//                             res.status(400).json(er3);
//                         })                    })
//                     .catch((er2)=>{
//                         console.log(er2);
//                         res.status(400).json(er2);
//                     })                
//                 })
//                 .catch((er1)=>{
//                     console.log(er1);
//                     res.status(400).json(er0);
//                 })
//             })
//             .catch((er0)=>{
//                 console.log(er0);
//                 res.status(400).json(er0);
//             })
//         })
//         .catch((er)=>{
//             console.log(er);
//             res.status(400).json(er);
//         })
// }

app.listen(4300, () => {
    console.log("Server running on port", 4300);
});
