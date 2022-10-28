# <p align = "center"> Valex </p>

<p align="center">
   <img src="https://cdn.dribbble.com/users/2367860/screenshots/16859451/media/0aa548e308861ab92c95aabc7bcf1802.png?compress=1&resize=1000x750&vertical=top" width=600/>
</p>

<p align = "center">
   <img src="https://img.shields.io/badge/author-Bárbara_Rech-4dae71?style=flat-square" />
   <img src="https://img.shields.io/github/languages/count/barbararech/valex?color=4dae71&style=flat-square" />
</p>


##  :clipboard: Description

An API to manage company benefit cards. You can create, activate, block and unblock cards, view transactions
and also simulate payments and recharges!

## :computer: Technologies
  - Node.js
  - Typescript
  - Joi
  - PostgreSQL

## API Reference

### Create new card

```http
POST /newcards/${employeeid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `type` | `string` | Valid types: `[groceries, restaurant, transport, education, health]` |  

Authenticated route. The following headers are mandatory:

 | Headers | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `x-api-key` | string | Company key | 

**Response:**
```json
  {
      "cardData": {
        "employeeId": 1,
        "number": "8085170788660391",
        "cardholderName": "Fulano R Silva",
        "securityCode": "899",
        "expirationDate": "09/2027",
        "password": null,
        "isVirtual": false,
        "originalCardId": null,
        "isBlocked": false,
        "type": "health"
      }
    }
```

---
### Activate card

```http
PUT /activatecards/${cardid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `password` | `string` | Length: 4. It only accepts numbers. |  
| `securityCode` | `string` | Length: 3. It only accepts numbers |  

**Response:**
```json
  "Cartão ativado com sucesso!"
```

---
### View card

```http
GET /viewcards/${cardid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `password` | `string` | - |  

**Response:**
```json
 {
  "card": [
    {
      "number": "1197473638451605",
      "cardholderName": "Ciclana M Madeira",
      "expirationDate": "09/2027",
      "securityCode": "119",
      "type": "transport"
    }
  ]
}
```

---
### Block card

```http
PUT /blockcards/${cardid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `password` | `string` | - |  

**Response:**
```json
 "Cartão bloqueado com sucesso!"
```

---
### Unblock card

```http
PUT /unblockcards/${cardid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `password` | `string` | - |  

**Response:**
```json
 "Cartão desbloqueado com sucesso!"
```

---
### View transactions

```http
GET /viewtransactions/${cardid}
```

**Response:**
```json
 {
  "balance": 5340,
  "payments": [
    {
      "id": 2,
      "cardId": 2,
      "businessId": 1,
      "timestamp": "2022-09-01T19:14:34.000Z",
      "amount": 7000,
      "businessName": "Responde Aí"
    }
  ],
  "recharges": [
    {
      "id": 6,
      "cardId": 2,
      "timestamp": "2022-09-02T13:32:18.000Z",
      "amount": 12340
    }
  ]
}
```
---
### Recharge card

```http
POST /rechargecards/${cardid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `amount` | `number` | It only accept integer and positive numbers |  

Authenticated route. The following headers are mandatory:

 | Headers | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `x-api-key` | string | Company key. | 

**Response:**
```json
  "Recarga efetuada com sucesso!"
```

---
### Add card payment

```http
POST /paymentcards/${businessid}
```
 
 **Request:**
 | Body | Type   | Description                                                                  |  
|------|--------|------------------------------------------------------------------------------|
| `cardId` | `number` | - |  
| `cardPassword` | `string` | - | 
| `amount` | `number` | It only accept integer and positive numbers |  


**Response:**
```json
  "Pagamento efetuado com sucesso!"
```
