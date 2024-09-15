const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
require('dotenv').config()
const turso = require("./db/config.js");
const app = express();
const PORT = process.env.PORT || 1000 ;

app.use(cors());
app.use(helmet());
app.use(express.json());


const createTableStatement = `CREATE TABLE IF NOT EXISTS
                                PlacementsTable (
                                    RollNumber VARCHAR(10),
                                    StudentName VARCHAR(255) NOT NULL,
                                    CompanyName VARCHAR(255) NOT NULL,
                                    Package INT,
                                    Pass_Out_Batch YEAR CHECK (Pass_Out_Batch >= 2001),
                                    PRIMARY KEY (RollNumber, CompanyName)
                            );`

const insertINTOTable = `
INSERT INTO
  PlacementsTable (
    RollNumber,
    StudentName,
    CompanyName,
    Package,
    Pass_Out_Batch
  )
VALUES
();
`;
app.get("/",(req,res)=>{
    turso.execute(`SELECT * FROM PlacementsTable`)
        .then((data)=>{
            console.log(data.rows);
        })
        .catch((error)=>{
            console.log(error);
        })
    res.send("Hello");
});

app.post("/get-placement-info",(req,res)=>{
    console.log("-------------------------------------------------")
    const CompanyName = req.body.companyName;
    const Batch = req.body.Batch;
    console.log(CompanyName,Batch)
    turso.execute({
        sql:"SELECT RollNumber AS rollNo,StudentName AS name,CompanyName AS companyName,Package AS package FROM PlacementsTable WHERE CompanyName = (:CompanyName) AND Pass_Out_Batch = (:Batch) ;",
        args:{CompanyName:CompanyName,Batch:Batch}
    })
    // turso.execute("SELECT RollNumber,StudentName,CompanyName,Package FROM PlacementsTable WHERE CompanyName='TCS' AND Pass_Out_Batch = 2024 ;")
        .then((data)=>{
            const outPut = (data.rows);
            res.status(200).json({data:outPut});
        })
        .catch((err)=>{
            console.log(err);
            res.status(500);
        })
})

app.post("/get-details",(req,res)=>{
    console.log("--------------------------------------------");
    const CompanyName = req.body.companyName;
    const rollNumber  = req.body.rollNo;

    console.log(CompanyName,rollNumber)
    turso.execute({
        sql:"SELECT RollNumber AS rollNo,StudentName AS name,CompanyName AS companyName,Package AS package FROM PlacementsTable WHERE RollNumber = (:rollNo) AND  CompanyName = (:CompanyName) ;",
        args:{rollNo:rollNumber,CompanyName:CompanyName}
    })
    .then((data)=>{
        const outPut = (data.rows);
        console.log(outPut)
        res.status(200).json({data:outPut});
    })
    .catch((err)=>{
        console.log(err);
        res.status(500);
    })

    console.log("------------------------------------------")
})

app.post("/update-details", (req, res) => {
    console.log("--------------------------------------------");
    const { companyName, rollNo, name, packageAmount } = req.body;

    console.log(companyName, rollNo, name, packageAmount);

    turso.execute({
        sql: `
            UPDATE PlacementsTable
            SET StudentName = (:name), Package = (:packageAmount)
            WHERE RollNumber = (:rollNo) AND CompanyName = (:companyName);
        `,
        args: {
            name: name,
            packageAmount: packageAmount,
            rollNo: rollNo,
            companyName: companyName
        }
    })
    .then(() => {
        console.log("Updated");
        res.status(200).json({ message: "Details updated successfully" });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({ error: "An error occurred while updating details" });
    });

    console.log("------------------------------------------");
});


app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}..`)
})
