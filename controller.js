require('dotenv').config()
const {CONNECTION_STRING} = process.env
const {FINNHUB_API_KEY} = process.env
const Sequelize = require('sequelize')
const sequelize = new Sequelize(CONNECTION_STRING)
const finnhub = require('finnhub');
const api_key = finnhub.ApiClient.instance.authentications['api_key'];
api_key.apiKey = FINNHUB_API_KEY
const finnhubClient = new finnhub.DefaultApi

const calculateGainLoss = (quote, cost) => {
    var unroundedVal = 0
    if(cost === 0 || quote === 0){
        unroundedVal = 0.0
    } else if(quote > cost){
        unroundedVal = quote / cost * 100
    } else {
        unroundedVal = (1 - quote / cost) * -100
    }
    return Math.round(unroundedVal * 10) / 10
}

module.exports = {
    
    ping: (req, res) => {
        const desc = req.query.desc ? req.query.desc : "none_provided"
        sequelize.query(`insert into ping (description, time) values ('${desc}', now());`)
            .then(dbRes => res.status(200).send({success: true}))
            .catch(err => console.log(err))
    },
    quote: (req, res) => {
        const ticker = req.query.ticker
        finnhubClient.quote(ticker, (error, data, response) => {
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
    profile: (req, res) => {
        const ticker = req.query.ticker
        console.log({ticker: ticker})
        // console.log({client: finnhubClient})
        finnhubClient.companyProfile2({symbol: ticker}, (error, data, response) => {
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
        const {username, password, firstname, lastname} = req.body
        
        sequelize.query(`insert into appuser (username, passhash, firstname, lastname, created) 
        values ('${username}', '${username}', '${firstname}', '${lastname}', now());`)
            .then(dbRes2 => {
                res.status(200).send({username: username, success: true})
            })        
            .catch(err => console.log(err))
    },
    login: (req, res) => {
        const {username, password} = req.body
        try{
            sequelize.query(`select id, username, firstname, lastname, created from appuser where username='${username}';`)
                .then(dbRes => {
                    res.status(200).send(dbRes[0][0])
                })        
        } catch(err) {
            console.log("Got a sequelze error")
            console.log(err)
            res.status(400).send({ error: err })
        }
    },
    addstockwatch:(req, res) => {
        const {appuser_id, ticker, count, cost} = req.body
        //check for valid ticker symbol
        finnhubClient.companyProfile2({symbol: ticker}, (error, data, response) => {
            if(!data.ticker){
                res.status(400).send({ticker: ticker, error: "invalid ticker symbol", success: false})
                return
            } 

            sequelize.query(`insert into stockwatch (ticker, appuser_id, count, cost, created) 
            values ('${ticker}', ${appuser_id}, ${count}, ${cost}, now());`)
                .then(dbRes2 => {
                    res.status(200).send({ticker: ticker, cost: cost, success: true})
                })        
                .catch(err => console.log(err))
        })
    },
    stockwatches: (req, res) => {
        const {appuser_id} = req.body
        //let tickers = ['aapl', 'meta']

        sequelize.query(`select * from stockwatch where appuser_id=${appuser_id};`)
            .then(dbRes => {
                const dbResults = dbRes[0]
                let watches = [dbResults.length]
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
                        finnhubClient.companyProfile2({symbol: dbResult.ticker}, async (error, data, response) => {
                            //console.log(data)
                            watches[i] = {
                                ticker: data.ticker,
                                logo: data.logo,
                                name: data.name,
                                count: dbResult.count,
                                cost: dbResult.cost,
                                id: dbResult.id,
                                quote: null,
                                gainLoss: null
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
                            finnhubClient.quote(curr.ticker, async (error, data, response) => {
                                //console.log(data)
                                curr.quote = data.c
                                curr.gainLoss = calculateGainLoss(curr.quote, curr.cost)
                                curr.logo = `https://eodhd.com/img/logos/US/${curr.ticker.toLowerCase()}.png`
                                resolve()
                            })
                        }))
                    })

                    Promise.all(promises2).then(() => res.status(200).send({success: true, watches: watches}))
                    
                })
                // console.log({promises : promises.length})
            })        
            .catch(err => console.log(err))

            
    },
    







    getFileList: (req, res) => {
        sequelize.query(`select name, description, link, id from file where archived is null;`)
            .then(dbRes => res.status(200).send(dbRes[0]))
            .catch(err => console.log(err))
    },
    addFile: (req, res) => {
        const {name, description, link} = req.body
        
        sequelize.query(`insert into file (name, description, link) values
        ('${name}','${description}','${link}') returning *;`)
            .then(dbRes => {
                const fileId = dbRes[0][0].id
                console.log(dbRes)
                console.log("new file id:", fileId)

                //Add file version 1 in the history table
                sequelize.query(`insert into history (version, file_id, comment, date_created, link) 
                values (1,${fileId},'Initial Version', now(), '${link}');`)
                    .then(dbRes2 => {
                        res.status(200).send({success: true})
                    })
                })                
            .catch(err => console.log(err))

        //res.status(200).send({success: true})
    },
    addVersion: (req, res) => {
        const {fileId, comment, link} = req.body
        
        sequelize.query(`select count(*) from history where file_id=${fileId};`)
            .then(dbRes => {
                let version = Number(dbRes[0][0].count) + 1
                sequelize.query(`insert into history (version, file_id, comment, date_created, link) 
                values (${version},${fileId},'${comment}', now(), '${link}');`)
                    .then(dbRes2 => {
                        //Update file.link to the link of this latest version
                        sequelize.query(`update file set link='${link}' where id=${fileId};`)
                        .then(dbRes3 => {
                            res.status(200).send({success: true})
                        })
                    })
                })
            .catch(err => console.log(err))
    },
    getVersionList: (req, res) => {
        const fileId = req.params.fileId
        sequelize.query(`select version, file_id, comment, 
        date_created, 
        link from history where file_id=${fileId} order by date_created desc;`)
            .then(dbRes => {
                sequelize.query(`select id, name, description, link from 
                file where id=${fileId};`).then(dbRes2 => {
                const resbody = {file: dbRes2[0][0], versions: dbRes[0]}
                res.status(200).send(resbody)})
                })   
            .catch(err => console.log(err))
    },
    deleteFile: (req, res) => {
        const fileId = req.params.fileId
        sequelize.query(`update file set archived=now() where id=${fileId};`)
            .then(dbRes => {
                res.status(200).send({success: true})})
            .catch(err => console.log(err))
    }
}
