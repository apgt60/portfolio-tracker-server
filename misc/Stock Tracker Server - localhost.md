# Project: Stock Tracker Server - localhost

## End-point: Register New User
### Method: POST
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/register
>```
### Body (**raw**)

```json
{
    "password":"password",
    "firstname":"firstname",
    "lastname":"lastname",
    "email":"email005@email.abc"
}
```

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "email": "email005@email.abc",
    "name": "firstname lastname",
    "success": true
}
```

### Response Body (**raw**)
#### HTTP Status 400 - Bad Request
```json
{
    "email": "email005@email.abc",
    "message": "Email already in use",
    "success": false
}
```



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Login
### Method: POST
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/login
>```
### Body (**raw**)

```json
{
    "email":"welcome@school.edu",
    "password":"password"
}
```

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
     "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyR3VpZCI6IjZhYWY1NTAxLTZmZDgtNDk2MC1hOTc3LTU5NDMzOTFiZWY2YiIsImlhdCI6MTcyMzA2ODUyNH0.oqcJwJQjRTExVdNTSpY4DD3SOVAXRrFMTRJ8-05YpNQ",
    "user": {
        "guid": "6aaf5501-6fd8-4960-a977-5943391bef6b",
        "email": "welcome@welk.edu",
        "firstname": "testa",
        "lastname": "tests",
        "created": "2024-08-07T05:40:23.330Z"
    }
}
```

### Response Body (**raw**)
#### HTTP Status 401 - Unauthorized
```json
{
    "message": "invalid credentials"
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Stock Watches
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/stockwatches
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|


### Body (**raw**) - None

### Response Body (**raw**)
#### HTTP Status 200 - OK

```json
### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "success": true,
    "watches": [
        {
            "ticker": "HD",
            "logo": "https://eodhd.com/img/logos/US/hd.png",
            "name": "Home Depot Inc",
            "count": 100,
            "cost": 150,
            "id": 55,
            "guid": "ee6682f1-e46b-403e-9caa-0f49561100bf",
            "quote": 342.4,
            "gainLoss": 128.3,
            "altLogo": "https://eodhd.com/img/logos/US/HD.png",
            "totalAmount": 34240,
            "totalCost": 15000,
            "totalGainLoss": 19240
        },
        {
            "ticker": "TSLA",
            "logo": "https://eodhd.com/img/logos/US/tsla.png",
            "name": "Tesla Inc",
            "count": 100,
            "cost": 180,
            "id": 58,
            "guid": "a7bc1548-acc3-4f8f-87de-e1561b3573c1",
            "quote": 191.76,
            "gainLoss": 6.5,
            "altLogo": "https://eodhd.com/img/logos/US/TSLA.png",
            "totalAmount": 19176,
            "totalCost": 18000,
            "totalGainLoss": 1176
        }
    ]
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Add Stock Watch
### Method: PUT
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/addstockwatch
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|


### Body (**raw**)

```json
{
    "ticker":"AAPL",
    "count": 10,
    "cost":212
}
```

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "ticker": "AAPL",
    "count": 10,
    "cost": 212,
    "success": true
}
```


⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Get Stock Details
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/profile?ticker=<ticker>
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|


### Query Params

|Param|value|
|---|---|
|ticker|{{ticker symbol}}|

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "ticker": "META",
    "name": "Meta Platforms Inc",
    "logo": "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.png"
}
```




⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Search by (parial) stock ticker
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/searchbyticker?text=<searchString>
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|


### Query Params

|Param|value|
|---|---|
|searchString|{{partial or full ticker symbol}}|

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "results": [
        {
            "id": 6402,
            "ticker": "MET",
            "name": "MetLife, Inc."
        },
        {
            "id": 6403,
            "ticker": "MET-A",
            "name": "Metlife, Inc. Floating Rate Non Cuml Series A"
        }
    ]
}
```





⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Stock Price Quote
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/quote?ticker=tsla
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|


### Query Params

|Param|value|
|---|---|
|ticker|{{ticker symbol}}|

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "ticker": "tsla",
    "quote": 232.1
}
```



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Remove Stock Watch
### Method: DELETE
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/removewatch/<stock_watch_guid>
>```
### Headers

|Content-Type|Value|
|---|---|
|authtoken|{{USER_TOKEN}}|

### Path Params

|Param|value|
|---|---|
|stock_watch_guid|{{stock watch guid}}|



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Ping - With Db Connect
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/ping?desc=some desc
>```
### Query Params

|Param|value|
|---|---|
|desc|a description string to log to the database|

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "success": true,
    "description": "some desc",
    "note": "db connection is active"
}
```



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃

## End-point: Ping - No Db Connect
### Method: GET
>```
>{{PROTO}}://{{HOST}}:{{PORT}}/api/pingnodb?desc=some desc
>```
### Query Params

|Param|value|
|---|---|
|desc|some desc|

### Response Body (**raw**)
#### HTTP Status 200 - OK
```json
{
    "success": true,
    "description": "some desc",
    "note": "no db test performed"
}
```



⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃ ⁃
_________________________________________________
Powered By: [postman-to-markdown](https://github.com/bautistaj/postman-to-markdown/)
