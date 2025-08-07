// Balances (/:id/balances)
// {
//   "balances": [
//     {
//       "balanceAmount": {
//         "amount": "657.49",
//         "currency": "string"
//       },
//       "balanceType": "string",
//       "referenceDate": "2021-11-22"
//     },
//     {
//       "balanceAmount": {
//         "amount": "185.67",
//         "currency": "string"
//       },
//       "balanceType": "string",
//       "referenceDate": "2021-11-19"
//     }
//   ]
// }

// Transactions (/:id/transactions)
// {
//   "transactions": {
//     "booked": [
//       {
//         "transactionId": "string",
//         "debtorName": "string",
//         "debtorAccount": {
//           "iban": "string"
//         },
//         "transactionAmount": {
//           "currency": "string",
//           "amount": "328.18"
//         },
//         "bankTransactionCode": "string",
//         "bookingDate": "date",
//         "valueDate": "date",
//         "remittanceInformationUnstructured": "string"
//       },
//       {
//         "transactionId": "string",
//         "transactionAmount": {
//           "currency": "string",
//           "amount": "947.26"
//         },
//         "bankTransactionCode": "string",
//         "bookingDate": "date",
//         "valueDate": "date",
//         "remittanceInformationUnstructured": "string"
//       }
//     ],
//     "pending": [
//       {
//         "transactionAmount": {
//           "currency": "string",
//           "amount": "99.20"
//         },
//         "valueDate": "date",
//         "remittanceInformationUnstructured": "string"
//       }
//     ]
//   },
//   "last_updated": "ISO 8601 timestamp"
// }
