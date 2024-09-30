const express = require('express');
const cors = require('cors')
const helmet = require('helmet');
require('dotenv').config()
const turso = require("./db/config.js");
const app = express();
const PORT = process.env.PORT || 1000 ;
const morgan = require('morgan')


app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

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
    const CompanyName = req.body.companyName;
    const Batch = req.body.Batch;
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
            res.status(500).json({error:err.message});
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
        res.status(200).json({data:outPut});
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(500).json({error:err.message});
    })

})

app.post("/get-companyNames",(req,res)=>{
    const Cname = req.body['Cname'];
    turso.execute({
        sql: "SELECT DISTINCT CompanyName FROM PlacementsTable WHERE CompanyName LIKE :Cname",
        args: { Cname: `%${Cname}%` } 
    })
    .then((data)=>{
        res.status(200).json({data:data.rows});
    })
    .catch((err)=>{
        console.log(err.message);
        res.status(400).json({data:"Error Occured"});
    })

})



app.post("/update-details", (req, res) => {
    const { companyName, rollNo, name, packageAmount } = req.body;

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
        console.log(err.message);
        res.status(500).json({ error: "An error occurred while updating details" });
    });

});

app.post("/insert-placements",(req,res)=>{
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
        console.log(rollNumber+" Deleted")
        res.status(200).json({ data: "DELETED" });
    })
    .catch((err) => {
        console.error(rollNumber,"Error deleting record:", err);
        res.status(400).json({ data: "Failed to delete record", error: err.message });
    });
});

const getDepartment = (rollNo) =>{
    const sub = String(rollNo).substring(6,8);
    switch (sub) {
        case "05":
          return "Computer Science and Engineering";
        case "04":
          return "Electronics and Communication Engineering";
        case "03":
          return "Mechanical Engineering";
        case "12":
          return "Information Technology";
        case "21":
          return "Aeronautical Engineering";
        case "67":
          return "CSE (Data Science)";
        case "66":
          return "CSE (AI & ML)";
        case "62":
          return "CSE (Cyber Security)";
        case "33":
            return "Computer Science and Information Technology"
        default:
          return "";
      }
}

const  getWeekday = () => {
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const today = new Date();
    return daysOfWeek[today.getDay()];
  }
  
  

app.post("/get-class", (req, res) => {
    const { rollNo } = req.body; 
    const day = getWeekday();
    if(day==='Sunday'){
        res.sendStatus(500);
    }
    else{
        const dept = getDepartment(rollNo);
        if (!rollNo) {
            return res.status(400).json({ data: "Roll number is required." });
        }
        turso.execute({
            sql: "SELECT * FROM StudentDetails WHERE RollNumber = :rollNo;",
            args: { rollNo: String(rollNo).toUpperCase() }
        })
        .then((data) => {
            if(data.rows.length>0){
                turso.execute({
                    sql : "SELECT * FROM Class_Schedule WHERE Department = :branch AND Semester = :sem AND Section = :section AND Week_Day = :day; ",
                    args : {branch:dept,sem:data.rows[0]['CurrentSem'],section:data.rows[0]['CurrentSection'],day:day}
                })
                    .then((res1)=>{
                        const info = {
                            Sname : data.rows[0]['SName'],
                            data0 : res1.rows 
                        }
                        console.log(res1.rows);
                        // console.log(info);
                        res.status(200).json({ data: info });
                    })
                    .catch((err)=>{
                        console.log(err)
                        res.status(500).json({ data: "Error occurred while fetching class details. INNER" });
                    })
            }
            else{
                res.status(200).json({ data: data.rows });
            }
        })
        .catch((err) => {
            console.error(err.message); 
            res.status(500).json({ data: "Error occurred while fetching class details." });
        });
    }
});


app.post("/get-class-schedule", (req, res) => {
    const { department, semester, section } = req.body;

    turso.execute({
        sql: "SELECT * FROM Class_Schedule WHERE Department = :branch AND Semester = :sem AND Section = :sec ORDER BY dayNumber",
        args: { branch: department, sem: semester, sec: section }
    })
    .then((result) => {
        res.status(200).json(result.rows);
    })
    .catch((error) => {
        console.error("Error occurred while fetching class details:", error);
        res.status(500).json({ message: "Error occurred while fetching class details." });
    });
});


app.post("/update-time-table",(req,res)=>{
    const { 
        department,
         semester,
          section,
        day,period1,
        period2,
        period3,
        period4,
        period5,
        period6 } = req.body;

    turso.execute({
        sql :`
        UPDATE Class_Schedule 
        SET Period1 = :period1, 
            Period2 = :period2, 
            Period3 = :period3, 
            Period4 = :period4, 
            Period5 = :period5, 
            Period6 = :period6 
        WHERE Department = :department 
          AND Semester = :semester 
          AND Section = :section 
          AND Week_Day = :day; `,
        args : { department:department ,
            semester : semester , 
            section : section , 
            day:day ,
            period1:period1,
            period2:period2,
            period3:period3,
            period4:period4,
            period5:period5,
            period6:period6,
        } 
    })
    .then((trqpp)=>{
        console.log("Updated");
        res.status(200).json({message:"Updated"});
    })
    .catch((err)=>{
        console.log("Failed :",err);
        res.status(400).json({message:"Failed to update"});
    })

})

app.get("/get-all-branches",(req,res)=>{
    turso.execute("SELECT DISTINCT Department FROM Class_Schedule ;")
    .then((resp)=>{
        res.status(200).json(resp.rows);
    })
    .catch((err)=>{
        console.log(err);
        res.status(400).json(err);
    })
})


app.post("/insert-time-table",(req,res)=>{
    const { 
        department,
         semester,
          section,
        day,period1,
        period2,
        period3,
        period4,
        period5,
        period6 } = req.body;
    
    const dayNumber = day === 'Monday' ? 1 : 
    day === 'Tuesday'? 2 :
    day === 'Wednesday'?3:
    day === 'Thursday'?4 :
    day === 'Friday' ? 5 :
    day === 'Saturday'?6 : 0 ;

    console.log(dayNumber);

    turso.execute({
        sql :`
        INSERT INTO Class_Schedule (Period1,Period2,Period3,Period4,Period5,Period6,
                                    Department,Semester,Section,Week_Day,dayNumber)
                            VALUES (:period1,
                                    :period2, 
                                    :period3, 
                                    :period4, 
                                    :period5, 
                                    :period6,
                                    :department, 
                                    :semester, 
                                    :section, 
                                    :day,
                                    :dayNumber ; `,
        args : { department:department ,
            semester : semester , 
            section : section , 
            day:day ,
            period1:period1,
            period2:period2,
            period3:period3,
            period4:period4,
            period5:period5,
            period6:period6,
            dayNumber:dayNumber
        } 
    })
    .then((trqpp)=>{
        console.log("Updated");
        res.status(200).json({message:"Updated"});
    })
    .catch((err)=>{
        console.log("Failed :",err);
        res.status(400).json({message:"Failed to update"});
    })

})




app.listen(PORT,()=>{
    console.log(`Server running on PORT ${PORT}..`)
})
