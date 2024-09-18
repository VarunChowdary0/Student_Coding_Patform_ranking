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
    console.log("Rout: '/'")
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
    console.log("Rout: '/get-placement-info'")
    console.log("-------------------------------------------------")
    const CompanyName = req.body.companyName;
    const Batch = req.body.Batch;
    console.log(CompanyName,Batch)
    const st1 = "SELECT RollNumber AS rollNo,StudentName AS name,CompanyName AS companyName,Package AS package FROM PlacementsTable WHERE CompanyName = (:CompanyName) AND Pass_Out_Batch = (:Batch) ;";
    const st2 = "SELECT RollNumber AS rollNo,StudentName AS name,CompanyName AS companyName,Package AS package FROM PlacementsTable WHERE Pass_Out_Batch = (:Batch) ;"

    const args1 ={CompanyName:CompanyName,Batch:Batch}    ;
    const args2 = {Batch:Batch}    ;
    turso.execute({
        sql: "ALLCOMPANIES"===String(CompanyName).toUpperCase()?st2:st1,
        args:"ALLCOMPANIES"===String(CompanyName).toUpperCase()?args2:args1
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
    console.log("Rout: '/get-details'")
    const CompanyName = req.body.companyName;
    const rollNumber  = req.body.rollNo;
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

app.post("/get-companyNames",(req,res)=>{
    const Cname = req.body['Cname'];
    // console.log(Cname)
    console.log("Rout: '/get-companyNames'")
    turso.execute({
        sql: "SELECT DISTINCT CompanyName FROM PlacementsTable WHERE CompanyName LIKE :Cname",
        args: { Cname: `%${Cname}%` } 
    })
    .then((data)=>{
        console.log(data.rows);
        res.status(200).json({data:data.rows});
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json({data:"Error Occured"});
    })

})



app.post("/update-details", (req, res) => {
    console.log("Rout: '/update-details'")
    const { companyName, rollNo, name, packageAmount } = req.body;

    // console.log(companyName, rollNo, name, packageAmount);

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

});

app.post("/insert-placements",(req,res)=>{
    console.log("Rout: '/insert-placements'")
    const rollNo = req.body['rollNumber']
    const Sname = req.body['StudentName']
    const Cname = req.body['CompanyName']
    const package =req.body['Package']
    const Batch = req.body['Batch']
    console.log(rollNo,Sname,Cname,package,Batch);

    turso.execute({
        sql: "INSERT INTO PlacementsTable (RollNumber, StudentName, CompanyName, Package, Pass_Out_Batch) VALUES (:rollNo, :Sname, :Cname, :package, :Batch);",
        args: { rollNo: rollNo, Sname: Sname, Cname: Cname, package: package, Batch: Batch }
    })
        .then((data) => {
            console.log(data);
            res.status(200).json({ data: "Placement Successfully Added" });
        })
        .catch((err) => {
            console.log(err);
            res.status(400).json({ data: err });
        });
    

})

app.post("/delete-record", (req, res) => {
    console.log("Route: '/delete-record'");
    
    const { companyName: CompanyName, rollNo: rollNumber } = req.body;

    if (!CompanyName || !rollNumber) {
        return res.status(400).json({ data: "Company Name and Roll Number are required." });
    }

    console.log(CompanyName, rollNumber);
    
    turso.execute({
        sql: "DELETE FROM PlacementsTable WHERE RollNumber = (:rollNo) AND CompanyName = (:CompanyName);",
        args: { rollNo: rollNumber, CompanyName: CompanyName }
    })
    .then(() => {
        res.status(200).json({ data: "DELETED" });
    })
    .catch((err) => {
        console.error("Error deleting record:", err);
        res.status(400).json({ data: "Failed to delete record", error: err.message });
    });
});



app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}..`)
})
