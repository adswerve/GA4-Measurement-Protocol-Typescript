# Google Analytics GA4 Measurement Protocol Library
This library provides an interface for sending data to Google Analytics 4 properties using Measurement Protocol.

**NOTE** Google Analytics 4 is in Alpha as of the latest update

## Use

BSD 3-Clause license can be found in ./LICENSE

## Contact

analytics-help@adswerve.com

## Compatible with

- Node.js version 8+
- es2015

## Installation

```sh
npm install -s @adswerve/ga4mp
```

## Setup

```js
ga4mp = require('@adswerve/ga4mp');
let ga4conn = ga4mp.createClient(apiSecret, measurementId, clientId);
```

## Send Hits to GA4 Account

You can send events to GA4 as they happen or batch them to be sent at another time of your choosing.

### Send immediately

```js
ga4conn.send(<events>);
```

### Send later

```js
ga4conn.send(<events>, true); // Set postpone flag
ga4conn.flushBuffer();  // Send all postponed events
```

### Events passed to send()

```js
var events = [
  {
    name : 'add_to_cart',
    params : {
      currency : 'USD',
       items : ['Pokémon cards'],
       value : "4.99"
    }
  },
  {
    name : 'app_update',
    params : {
      previous_app_version : '4.6'
    }
  }
]
```

Events are expected to be passed to the send() function within an array and matching the object schema found in the [Google Analytics 4 documentation](https://developers.google.com/analytics/devguides/collection/protocol/ga4/sending-events?client_type=gtag#send_an_event).

## Additional Features

### Set and unset a constant parameter

```js
ga4conn.setConstantParam(key, value);  // Set a constant
ga4conn.unsetConstantParam(key); // Remove a constant
```

Set custom dimensions/metrics, country codes, etc. for all outgoing events.  You can unset them too.

### Output connection details

```js
ga4conn.readClientInfo();
```
