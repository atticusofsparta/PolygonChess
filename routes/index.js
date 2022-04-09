const express = require('express')
const router = express.Router()

//casper sdk
const { RuntimeArgs, Contracts, CasperClient,CLPublicKey, CasperServiceByJsonRPC } = require('casper-js-sdk');
const apiUrl = 'http://95.216.67.162:7777/rpc';
const client = new CasperClient(apiUrl);
const casperService = new CasperServiceByJsonRPC(apiUrl);
const contract = new Contracts.Contract(client);


router.get('/', (req, res) => {
    req.casperService
    res.json(casperService)
} )



module.exports = router