om-checkout.js
=======
Reconstruction of the part of payment with card

## Features

- Change in product share
- Discount application
- Some liberty for customization of payment with card

## Used technology

- XHS
- JQUERY

# Requisitions used

## GetProfile
=======
- http://{{accountName}}.vtexcommercestable.com.br/api/checkout/pub/profiles?email={{email}}
=======
Get profile of user


## Place Order
=======
- http://{{accountName}}.vtexcommercestable.com.br/api/checkout/pub/orders
=======
To get the address Is used the method GetProfile (Using the requisition GetProfile). Using the requisition "Place Order" if the user exists.

### Headers
=======
- Content-Type - application/json
- Accept - application/json
- x-vtex-api-appKey - {{X-VTEX-API-AppKey}}
-x-vtex-api-appToken - {{X-VTEX-API-AppToken}}


## Place Order Existing User
=======
- http://{{accountName}}.vtexcommercestable.com.br/api/checkout/pub/orders
=======
To get the address Is used the method GetProfile (Using the requisition GetProfile). Using the requisition "Place Order" if the user exists.

### Headers
=======
- Content-Type - application/json
- Accept - application/json

# Example using body (Select the option "raw"). Example das requisitions "Place Order Existing User" and "Place Order"

    {
      "items": [{
        "id": "{{id product}}",
        "quantity": 1,
        "seller": "1",
        "price": {{price product}},
        "bundleItems": [],
        "attachments": [],
        "measurementUnit": null,
        "unitMultiplier": 0.0,
        "isGift": false
      }],
      "clientProfileData": {
        "email": "{{Email user}}"
      },
      "shippingData": {
        "id": "shippingData",
          "address": {
          "addressId": "{{ID user}}"
        },
        "logisticsInfo": [{
          "itemIndex": 0,
          "selectedSla": "Normal",
          "lockTTL": null,
          "shippingEstimate": "6bd",
          "price": 650,
          "deliveryWindow": {
              "startDateUtc": "",
              "endDateUtc": "",
              "price": 0,
              "lisPrice": 0,
              "tax": 0
            }
        }]
      },
      "openTextField": {
        "value": null,
        "expectedOrderFormSections": []
      },
      "marketingData": null,
      "paymentData": {
        "id": "paymentData",
        "id": "paymentData",
        "payments": [{
          "paymentSystem": "6",
          "referenceValue": 15650,
          "value": 15650,
          "installments": 1
        }],
        "gift-cards": []
      }
    }



## Send Payment
=======
- https://{{accountName}}.vtexpayments.com.br/api/pub/transactions/{{transactionId}}/payments
=======
Send payment.

### Headers
=======
- Content-Type - application/json

    [
      {
        "paymentSystem":6,
        "paymentSystemName":"Boleto Bancário",
        "group":"bankInvoicePaymentGroup",
        "installments":1,
        "value":15650,
        "installmentsInterestRate":0,
        "installmentsValue":15650,
        "referenceValue":15650,
        "fields":
        {
        },
        "transaction":
        {
            "id":"{{transactionId}}",
            "merchantName": "{{accountName}}"
        }
      }
    ]

=======
Ex:. Send a GiftCard and two credit cards payment data

    [
      {
        "paymentSystem": 16,
        "paymentSystemName": "Vale",
        "group": "giftCardPaymentGroup",
        "installments": 1,
        "installmentsInterestRate": 0,
        "installmentsValue": 157,
        "value": 157,
        "referenceValue": 157,
        "fields": {
          "redemptionCode": "DADW-BBQL-VGHT-FUQY",
          "provider": "VtexGiftCard"
        },
        "transaction": {
          "id": "{{transactionId}}",
          "merchantName": "{{accountName}}"
        }
      },
      {
        "paymentSystem": 2,
        "paymentSystemName": "Visa",
        "group": "creditCardPaymentGroup",
        "installments": 1,
        "installmentsInterestRate": 0,
        "installmentsValue": 7746,
        "value": 7746,
        "referenceValue": 7746,
        "fields": {
          "holderName": "TESTE UM",
          "cardNumber": "4444 3333 2222 1111",
          "validationCode": "123",
          "dueDate": "10/20",
          "addressId": "823e181949dc40098b056af02790deb7"
        },
        "interestRate": 0,
        "installmentValue": 7746,
        "transaction": {
          "id": "{{transactionId}}",
          "merchantName": "{{accountName}}"
        },
        "currencyCode": "BRL"
      },
      {
        "paymentSystem": 2,
        "paymentSystemName": "Visa",
        "group": "creditCardPaymentGroup",
        "installments": 1,
        "installmentsInterestRate": 0,
        "installmentsValue": 7747,
        "value": 7747,
        "referenceValue": 7747,
        "fields": {
          "holderName": "TESTE DOIS",
          "cardNumber": "4929 3523 1130 0284",
          "validationCode": "321",
          "dueDate": "09/19",
          "addressId": "823e181949dc40098b056af02790deb7"
        },
        "interestRate": 0,
        "installmentValue": 7747,
        "transaction": {
          "id": "{{transactionId}}",
          "merchantName": "{{accountName}}"
        },
        "currencyCode": "BRL"
      }
    ]




## Gateway CallBack
=======
- http://{{accountName}}.vtexcommercestable.com.br/api/checkout/pub/gatewayCallback/{{orderGroup}}
=======
Get the {{orderGroup}} number from the PUT order reponse. "Header" To get the {{CheckoutAuthorization}} value, take a look at the Response Headers for the Put PlaceOrder, will be a set cookie with the name Vtex_CHKO_Auth, you will need it's value.
Ex.: RnirrhfXNUixQle4kJaNtUo2SdX5WQZwXP4T+gv+dlw=

### Headers
=======
- Content-Type - application/json
- Accept - application/json
- Set-Cookie - Vtex_CHKO_Auth=JpkQgZR+MlpgnB1PNfx8x5MBtOVAhjTJGA6BZzfy3k8=


## Function formCard().
=======
Create new HTML of payment.


## Function requestGetCard().
=======
Create select with options of payment.

    var data = JSON.stringify({
        "items": [
            {
                "id": "{{Id products}}",
                "quantity": 1,
                "seller": "1"
            }
        ],
        "postalCode": "{{CEP client}}",
        "country": "BRA",
        "marketingData": {
            "coupon": "",
            "utmSource": ""
        }
    });


## Function validateUser().
=======
Validation of user (If exist or not). If there is anger pick up the user and purchase data

    //profile
    var idItem = "";
    var priceItem = "";
    var emailClient = searchClient.userProfile.email;
    var addressClient = searchClient.availableAddresses[0].addressId;

    //shippingData address
    var addressType = "";
    var receiverName = "";
    var postalCode = "";
    var city = "";
    var state = "";
    var country = "";
    var street = "";
    var number = "";
    var neighborhood = "";
    var complement = "";
    var value = "";

    //logisticsInfo
    var selectedSla = "";
    var slas = "";
    var shippingEstimate = "";
    var price = "";

    var typeCardUser = "";
    var paymentSystem = "";
    var paymentSystemName = "";


## Postman demo
[Demo](https://www.getpostman.com/collections/badda955c9b5ba49571b)