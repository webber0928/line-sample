const https = require("https")
const express = require("express")
const app = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

const PORT = process.env.PORT || 3000
const TOKEN = process.env.LINE_ACCESS_TOKEN

