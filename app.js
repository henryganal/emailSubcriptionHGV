const express = require('express')
const app = express()
const port = process.env.PORT
const request = require("request")
const https = require("https")
const client = require("@mailchimp/mailchimp_marketing");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

app.get('/', (req, res) => {
  res.sendFile(__dirname + "/signup.html")
})

app.post('/success.html', (req, res) => {
  const FName = req.body.inputFname
  const LName = req.body.inputLname
  const eMail = req.body.inputEmail
  // res.send('Got a POST request with data First name: '+FName+' Lastname : ' +LName+' With Email : ' + eMail)

  const data = {
    members: [{
      email_address: eMail,
      status: "subscribed",
      merge_fields: {
        FNAME: FName,
        LNAME: LName
      }
    }]
  }

  const jsonData = JSON.stringify(data)

  const url = "https://us14.api.mailchimp.com/3.0/lists/5e73434190"
  const options = { 
    method: "POST",
    auth: "henryG1:f178f0893478808b92c273b647b67324-us14"
  }

  const request = https.request(url, options, (response) => {
    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html")
    }else{
      res.sendFile(__dirname + "/failure.html")
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data))
    })
  })

  request.write(jsonData)
  request.end()

  // -------------------------------------


// client.setConfig({
//   apiKey: "f178f0893478808b92c273b647b67324-us14",
//   server: "us14",
// });

// const run = async () => {
  
//   const response = await client.lists.addListMember("5e73434190", {
    
//       email_address: eMail,
//       status: "subscribed",
//       merge_fields: {
//         FNAME: FName,
//         LNAME: LName
//       }
         
//   });
//   console.log(response)
  
// };
// run()




// -------------------------------------

})


app.post("/failure", (req, res) => {
  res.redirect("/")
})




app.listen(port || 3000, () => {
  console.log(`mail app listening on port ${port}`)
})



// API Key f178f0893478808b92c273b647b67324-us14
// 5e73434190