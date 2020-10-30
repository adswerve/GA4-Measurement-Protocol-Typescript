# Google Analytics GA4 Measurement Protocol Library

## Compatible with
- Node.js version 8+
- es2015

## To use

### Setup
ga4mp = require('ga4-mp')
ga4mp.setClient(apiSecret, measurementId, clientId);

### Send Hits to GA4 Account
ga4mp.sendHit(<events>)

### Test Hits on GA4 MP debug endpoint
ga4mp.testSendHit(<events>)
