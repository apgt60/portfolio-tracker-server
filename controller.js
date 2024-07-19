require('dotenv').config()
const {CONNECTION_STRING} = process.env
const {FINNHUB_API_KEY} = process.env
const {JWT_SECRET_KEY} = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING)
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken')
api_key.apiKey = FINNHUB_API_KEY
const finnhubClient = new finnhub.DefaultApi
const bcrypt = require('bcrypt');
const saltRounds = 10;

const FORBIDDEN_RESPONSE = {message: "authentication failed for request"} 
const SERVER_ERROR_RESPONSE = {message: "Server Error", success: false}

const calculateGainLoss = (quote, cost) => {
    var unroundedVal = 0
    if(cost === 0 || quote === 0){
        unroundedVal = 0.0
    } else if(quote > cost){
        unroundedVal = quote / cost * 100 - 100
    } else {
        unroundedVal = (1 - quote / cost) * -100
    }
    return Math.round(unroundedVal * 10) / 10
}

const getUserFromRequest = (req) => {
    const token = req.headers['authtoken']
    console.log("token in:", token)
    try {
        return jwt.verify(token, JWT_SECRET_KEY, (err, authData) => {
            if(err) {
                console.log("err:", err)
                return new Promise((resolve) => resolve(null))
            } else {
                const userGuid = authData.userGuid
                console.log("userGuid:", userGuid)
    
                return new Promise((resolve) => {
                    try {
                        sequelize.query(`select guid, id, username, firstname, lastname, created from appuser where guid='${userGuid}';`)
                            .then(dbRes => {
                                resolve(dbRes[0][0])
                            })        
                    } catch(err) {
                        console.log("Got a sequelize error")
                        console.log(err)
                        resolve(null)         
                    }
                })
            }
        })
    } catch (error) {
        console.log("error:", error)
        return new Promise(resolve => {
            resolve(null)
        })
    }
    
}

module.exports = {
    ping: (req, res) => {
        const desc = req.query.desc ? req.query.desc : "none_provided"
        const newRandomUuid = uuid()
        console.log(newRandomUuid, newRandomUuid.length)
        sequelize.query(`insert into ping (description, time) values ('${desc}', now());`)
            .then( () => res.status(200).send({success: true, description: desc, 
                note: "db connection is active"}))
            .catch(err => console.log(err))
    },
    pingnodb: (req, res) => {
        const desc = req.query.desc ? req.query.desc : "none_provided"
        res.status(200).send({success: true, description: desc, note: "no db test performed"})
    },
    quote: async(req, res) => {
        const ticker = req.query.ticker
        const user = await getUserFromRequest(req)
        if(!user){
            res.status(403).json(FORBIDDEN_RESPONSE)
            return
        }
        finnhubClient.quote(ticker, (error, data) => {
            console.log(data)
            /* Quote {
                o: 185.01,
                h: 185.04,
                l: 182.23,
                c: 182.52,
                pc: 184.37,
                d: -1.85,
                dp: -1.0034
                }
            */
            res.status(200).send({ticker: ticker, quote: data.c})
        })
    },
    profile: async(req, res) => {
        const ticker = req.query.ticker
        console.log({ticker: ticker})

        const user = await getUserFromRequest(req)
        if(!user){
            res.status(403).json(FORBIDDEN_RESPONSE)
            return
        }

        // console.log({client: finnhubClient})
        finnhubClient.companyProfile2({symbol: ticker}, (error, data) => {
            console.log(data)
            /* 
            CompanyProfile2 {
                country: 'US',
                currency: 'USD',
                exchange: 'NASDAQ NMS - GLOBAL MARKET',
                name: 'Meta Platforms Inc',
                ticker: 'META',
                ipo: 2012-05-18T00:00:00.000Z,
                marketCapitalization: 1228150.4922825235,
                shareOutstanding: 2549.41,
                logo: 'https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.svg',
                phone: '16505434800',
                weburl: 'https://www.meta.com/',
                finnhubIndustry: 'Media'
            }
            */
            res.status(200).send({ticker: data.ticker, name: data.name, logo: data.logo})
        })
    },
    register: (req, res) => {
        const {username, password, firstname, lastname, email} = req.body

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(password, salt, function(err, hash){
                sequelize.query(`insert into appuser (username, passhash, firstname, lastname, created, guid, email) 
                values ('${username}', '${hash}', '${firstname}', '${lastname}', now(), '${uuid()}', '${email}');`)
                .then((dbRes) => {
                    if(dbRes[1] == 1){
                        res.status(200).send({username: username, success: true})
                    } else {
                        console.log("dbRes-login-err", dbRes)
                        res.status(500).send(SERVER_ERROR_RESPONSE)
                    }
                    
                })        
                .catch(err => {
                    const dberr = err.errors[0]
                    if(dberr.path === "username" && dberr.validatorKey === "not_unique"){
                        res.status(400).send({username: username, message: "User Name already in use", success: false})
                        return
                    }
                    if(dberr.path === "email" && dberr.validatorKey === "not_unique"){
                        res.status(400).send({username: username, message: "Email already in use", success: false})
                        return
                    }
                    console.log(err)
                    res.status(500).send(SERVER_ERROR_RESPONSE)
                })
            })
        })
    },
    addstockwatch:async(req, res) => {
        const {ticker, count, cost} = req.body
        const user = await getUserFromRequest(req)
        if(!user){
            res.status(403).json(FORBIDDEN_RESPONSE)
            return
        }
        //check for valid ticker symbol
        finnhubClient.companyProfile2({symbol: ticker}, (error, data) => {
            if(!data.ticker){
                res.status(400).send({ticker: ticker, error: "invalid ticker symbol", success: false})
                return
            } 

            const appuser_id = user.id

            sequelize.query(`insert into stockwatch (ticker, appuser_id, count, cost, created, guid) 
            values ('${ticker}', ${appuser_id}, ${count}, ${cost}, now(), '${uuid()}');`)
                .then(() => {
                    res.status(200).send({ticker: ticker, count: count, cost: cost, success: true})
                })        
                .catch(err => console.log(err))
            })            
    },
    stockwatches: async (req, res) => {
        const user = await getUserFromRequest(req)
        console.log("user-00", user)
        
        if(!user){
            res.status(403).json(FORBIDDEN_RESPONSE)
            return
        }

        sequelize.query(`select * from appuser where guid='${user.guid}';`)
            .then(dbUserRes => {
                const dbUserResults = dbUserRes[0]
                const appuser = dbUserResults[0]
                const appuser_id = appuser.id

                sequelize.query(`select * from stockwatch where appuser_id=${appuser_id} order by id;`)
                    .then(dbRes => {
                        const dbResults = dbRes[0]
                        let watches = dbResults.length > 0 ? [dbResults.length] : []
                        let promises = []
                        
                        /*
                        dbRes: [
                            {
                            id: 1,
                            ticker: 'meta',
                            appuser_id: 6,
                            count: 124,
                            cost: 444.77,
                            created: 2024-02-27T20:55:21.285Z
                            }
                        ]
                        */
                        for(let i=0; i < dbResults.length; i++){
                            const dbResult = dbResults[i]
                            promises.push(new Promise((resolve) => {
                                finnhubClient.companyProfile2({symbol: dbResult.ticker}, async (error, data) => {
                                    //console.log(data)
                                    watches[i] = {
                                        ticker: data.ticker,
                                        logo: data.logo,
                                        name: data.name,
                                        count: dbResult.count,
                                        cost: dbResult.cost,
                                        id: dbResult.id,
                                        guid: dbResult.guid,
                                        quote: null,
                                        gainLoss: null,
                                        altLogo: null,
                                        totalAmount: null,
                                        totalCost: null,
                                        totalGainLoss: null
                                    }
                                    resolve(`${i} : ${data.ticker}`)
                                })
                            })
                            )
                        }

                        Promise.all(promises).then(() => {
                            let promises2 = []
                            watches.forEach((curr) => {
                                promises2.push(new Promise((resolve) => {
                                    finnhubClient.quote(curr.ticker, async (error, data) => {
                                        //console.log(data)
                                        curr.quote = data.c
                                        curr.gainLoss = calculateGainLoss(curr.quote, curr.cost)
                                        curr.logo = `https://eodhd.com/img/logos/US/${curr.ticker.toLowerCase()}.png`
                                        curr.altLogo = `https://eodhd.com/img/logos/US/${curr.ticker.toUpperCase()}.png`
                                        curr.totalAmount = curr.quote * curr.count
                                        curr.totalCost = curr.cost * curr.count
                                        curr.totalGainLoss = Math.round((curr.totalAmount - curr.totalCost) * 100) / 100
                                        resolve()
                                    })
                                }))
                            })

                            Promise.all(promises2).then(() => res.status(200).send({success: true, watches: watches}))
                            
                        })
                    })        
                    .catch(err => console.log(err))
            })
    },
    removewatch:async(req, res) => {
        const user = await getUserFromRequest(req)
        if(!user){
            res.status(403).json(FORBIDDEN_RESPONSE)
            return
        }
        const watchGuid = req.params.watchId
        sequelize.query(`delete from stockwatch where guid='${watchGuid}' and appuser_id=${user.id};`)
            .then(() => {
                res.status(200).send({success: true})})
            .catch(err => console.log(err))
    },
    login:(req, res) => {
        const {username, password} = req.body
        try{
            sequelize.query(`select guid, passhash, username, firstname, lastname, created from appuser where username='${username}';`)
                .then(dbRes => {
                    //user not found
                    if(dbRes[1].rowCount == 0){
                        res.status(401).send({message: "invalid credentials"})
                        return
                    }
                    const userRow = dbRes[0][0]
                    const userGuid = userRow.guid
                    const passhash = userRow.passhash
                    bcrypt.compare(password, passhash, function(err, result) {
                        //password is good
                        if(result == true){
                            //create a jwt token user secretkey and send it to client
                            jwt.sign({userGuid : userGuid}, JWT_SECRET_KEY, (err, token) => {
                                if(!token){
                                    console.log("jwtErr:", err)
                                }
                                //remove the passhash from the user and send the rest down with the response
                                var user = {...userRow}
                                delete user.passhash
                                res.status(200).send({token: token, user: user})
                            })
                        } else {
                            res.status(401).send({message: "invalid credentials"})
                        }
                        
                    });
                    
                })        
        } catch(err) {
            console.log("Got a sequelze error")
            console.log(err)
            res.status(400).send({ error: err })
        }
    }
}
