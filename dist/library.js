"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testSendHit = exports.sendHit = exports.readClient = exports.setClient = void 0;
const axios = require('axios');
var API_SECRET; // GA > Admin > Data Streams > choose your stream > Measurement Protocol > Create
var MEASUREMENT_ID; // GA Admin > Data Streams > choose your stream > Measurement ID
var CLIENT_ID; // https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid
var GA_ENDPOINT;
var DEBUG_ENDPOINT;
function setClient(apiSecret, measurementId, clientId) {
    API_SECRET = apiSecret;
    MEASUREMENT_ID = measurementId;
    CLIENT_ID = clientId;
    GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
    DEBUG_ENDPOINT = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`;
}
exports.setClient = setClient;
function readClient() {
    console.log("API_SECRET: " + API_SECRET);
    console.log("MEASUREMENT_ID: " + MEASUREMENT_ID);
    console.log("CLIENT_ID: " + CLIENT_ID);
    console.log("GA_ENDPOINT: " + GA_ENDPOINT);
    console.log("DEBUG_ENDPOINT: " + DEBUG_ENDPOINT);
}
exports.readClient = readClient;
/*
 SendHit:  events must match the array format:
// [{
      name: <event_name>,
      params: {},
    },{
          name: <event_name>,
          params: {},
        }]

  Can send up to 25 events at once
  Verify event and params here:
  https://developers.google.com/analytics/devguides/collection/ga4/events
*/
function sendHit(events) {
    axios.post(GA_ENDPOINT, {
        client_id: CLIENT_ID,
        events: events
    }).then(res => {
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
}
exports.sendHit = sendHit;
function testSendHit(events) {
    axios.post(DEBUG_ENDPOINT, {
        client_id: CLIENT_ID,
        events: events
    }).then(res => {
        console.log(`statusCode: ${res.statusCode}`);
        console.log(res);
    }).catch(error => {
        console.log(error);
    });
}
exports.testSendHit = testSendHit;
