const axios = require('axios')



// This is the interface/object for communicating with GA4MP
export function GA4MPClient(apiSecret, measurementId, clientId) {

  // Vars for GA4 connection
  this.API_SECRET = apiSecret; // GA > Admin > Data Streams > choose your stream > Measurement Protocol > Create
  this.MEASUREMENT_ID = measurementId; // GA Admin > Data Streams > choose your stream > Measurement ID
  this.CLIENT_ID = clientId; // https://developers.google.com/identity/one-tap/web/guides/get-google-api-clientid
  this.GA_ENDPOINT = `https://www.google-analytics.com/mp/collect?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`
  this.DEBUG_ENDPOINT = `https://www.google-analytics.com/debug/mp/collect?measurement_id=${this.MEASUREMENT_ID}&api_secret=${this.API_SECRET}`

  // Outputs the connection details to console
  this.readClientInfo = function(){
    console.log(`
    *** Connection details for GA4 Connection ***
    API_SECRET: ${this.API_SECRET}
    MEASUREMENT_ID: ${this.MEASUREMENT_ID}
    CLIENT_ID: ${this.CLIENT_ID}
    GA_ENDPOINT: ${this.GA_ENDPOINT}
    DEBUG_ENDPOINT: ${this.DEBUG_ENDPOINT}
    `)
  }

  // For preserving paramaters that will be attached to all events
  this.constantParams = {};

  //Sets a constant parameter for each hit sent to GA (pagepath, custom dimension)
  this.setConstantParam = function(key, value) {
    this.constantParams[key] = value;
  }

  //Removes a constant parameter listed in this.constantParams
  this.unsetConstantParam = function(key) {
    delete this.constantParams[key];
  }

  // Adds key/value pairs from this.constantParams to each event
  this.addConstantParamsToEvents = function(events) {
    for(var i = 0; i < events.length; i++){
      for(var param in this.constantParams){
        events[i].params[param] = this.constantParams[param];
      }
    }
  }

  // For async send of hits
  this.hitBuffer = [];

  // Send data to Google analytics
  // Allows for postponing hits send for later
  this.send = function(events,postpone=false){

    var eventMax = events.length > 25;
    this.checkPredefinedEventParams(events);
    this.addConstantParamsToEvents(events);
    this.nullParamCheck(events);

    if(postpone){
      events.forEach(event => this.hitBuffer.push(event))
    } else {
      if(eventMax){
        this.sendLargeEventCount(events);
      } else {
        axios.post(this.GA_ENDPOINT, {
          client_id: this.CLIENT_ID,
          events: events
        }).then( res => {
          // console.log(res)
        }).catch( error => {
          console.log(error)
        })
      }
    }
  }

  // Sends all postponed hits held in this.hitBuffer
  this.flushBuffer = function(){
    this.sendLargeEventCount(this.hitBuffer);
  }

  // Sends out more than 25 hits at a time
  this.sendLargeEventCount = function(events){
    var eventBlock;
    while(events.length > 0){
      eventBlock = events.splice(25)
      this.send(events)
      events = eventBlock;
    }
  }

  // Checks that if a user sends a predefined event, has required params
  // https://support.google.com/analytics/answer/9322688?hl=en&ref_topic=9756175
  this.checkPredefinedEventParams = function(events) {

    // All pre-defined events/params
    var eventList = {
      'ad_click' : ['ad_event_id'],
      'ad_exposure' : ['firebase_screen', 'firebase_screen_id', 'firebase_screen_class', 'exposure_time'],
      'ad_impression' : ['ad_event_id'],
      'ad_query' : ['ad_event_id'],
      'ad_reward' : ['ad_unit_id', 'reward_type', 'reward_value'],
      'add_payment_info' : ['coupon', 'currency', 'items', 'payment_type', 'value'],
      'add_shipping_info' : ['coupon', 'currency', 'items', 'shipping_tier', 'value'],
      'add_to_cart' : ['currency', 'items', 'value'],
      'add_to_wishlist' : ['currency', 'items', 'value'],
      'adunit_exposure' : ['firebase_screen', 'firebase_screen_id', 'firebase_screen_class', 'exposure_time'],
      'app_clear_data' : [],
      'app_exception' : ['fatal', 'timestamp', 'engagement_time_msec'],
      'app_remove' : [],
      'app_store_refund' : ['product_id', 'value', 'currency', 'quantity'],
      'app_store_subscription_cancel' : ['product_id', 'price', 'value', 'currency', 'cancellation_reason'],
      'app_store_subscription_convert' : ['product_id', 'price', 'value', 'currency', 'quantity'],
      'app_store_subscription_renew' : ['product_id', 'price', 'value', 'currency', 'quantity', 'renewal_count'],
      'app_update' : ['previous_app_version'],
      'begin_checkout' : ['coupon', 'currency', 'items', 'value'],
      'click' : [],
      'dynamic_link_app_open' : ['source', 'medium', 'campaign', 'link_id', 'accept_time'],
      'dynamic_link_app_update' : ['source', 'medium', 'campaign', 'link_id', 'accept_time'],
      'dynamic_link_first_open' : ['source', 'medium', 'campaign', 'link_id', 'accept_time'],
      'earn_virtual_currency' : ['virtual_currency_name', 'value'],
      'error' : ['firebase_error', 'firebase_error_value'],
      'file_download' : ['file_extension', 'file_name', 'link_classes', 'link_domain', 'link_id', 'link_text', 'link_url'],
      'firebase_campaign' : ['source', 'medium', 'campaign', 'term', 'content', 'gclid', 'aclid', 'cp1', 'anid', 'click_timestamp', 'campaign_info_source'],
      'firebase_in_app_message_action' : ['message_name', 'message_device_time', 'message_id'],
      'firebase_in_app_message_dismiss' : ['message_name', 'message_device_time', 'message_id'],
      'firebase_in_app_message_impression' : ['message_name', 'message_device_time', 'message_id'],
      'first_open' : ['previous_gmp_app_id', 'updated_with_analytics', 'previous_first_open_count', 'system_app', 'system_app_update', 'deferred_analytics_collection', 'reset_analytics_cause', 'engagement_time_msec'],
      'first_visit' : [],
      'generate_lead' : ['value', 'currency'],
      'in_app_purchase' : ['product_id', 'price', 'value', 'currency', 'quantity', 'subscription', 'free_trial', 'introductory_price'],
      'join_group' : ['group_id'],
      'level_end' : ['level_name', 'success'],
      'level_start' : ['level_name'],
      'level_up' : ['character', 'level'],
      'login' : ['method'],
      'notification_dismiss' : ['message_name', 'message_time', 'message_device_time', 'message_id', 'topic', 'label', 'message_channel'],
      'notification_foreground' : ['message_name', 'message_time', 'message_device_time', 'message_id', 'topic', 'label', 'message_channel', 'message_type'],
      'notification_open' : ['message_name', 'message_time', 'message_device_time', 'message_id', 'topic', 'label', 'message_channel'],
      'notification_receive' : ['message_name', 'message_time', 'message_device_time', 'message_id', 'topic', 'label', 'message_channel', 'message_type'],
      'notification_send' : ['message_name', 'message_time', 'message_device_time', 'message_id', 'topic', 'label', 'message_channel'],
      'os_update' : ['previous_os_version'],
      'page_view' : ['page_location', 'page_referrer'],
      'post_score' : ['level', 'character', 'score'],
      'purchase' : ['affiliation', 'coupon', 'currency', 'items', 'transaction_id', 'shipping', 'tax', 'value'],
      'refund' : ['transaction_id', 'value', 'currency', 'tax', 'shipping', 'items'],
      'remove_from_cart' : ['currency', 'items', 'value'],
      'screen_view' : ['firebase_screen', 'firebase_screen_class', 'firebase_screen_id', 'firebase_previous_screen', 'firebase_previous_class', 'firebase_previous_id', 'engagement_time_msec'],
      'scroll' : [],
      'search' : ['search_term'],
      'select_content' : ['content_type', 'item_id'],
      'select_item' : ['items', 'item_list_name', 'item_list_id'],
      'select_promotion' : ['items', 'promotion_id', 'promotion_name', 'creative_name', 'creative_slot', 'location_id'],
      'session_start' : [],
      'share' : ['content_type', 'item_id'],
      'sign_up' : ['method'],
      'view_search_results' : ['search_term'],
      'spend_virtual_currency' : ['item_name', 'virtual_currency_name', 'value'],
      'tutorial_begin' : [],
      'tutorial_complete' : [],
      'unlock_achievement' : ['achievement_id'],
      'user_engagement' : ['engagement_time_msec'],
      'video_start' : ['video_current_time', 'video_duration', 'video_percent', 'video_provider', 'video_title', 'video_url', 'visible' ],
      'video_progress' : ['video_current_time', 'video_duration', 'video_percent', 'video_provider', 'video_title', 'video_url', 'visible' ],
      'video_complete' : ['video_current_time', 'video_duration', 'video_percent', 'video_provider', 'video_title', 'video_url', 'visible' ],
      'view_cart' : ['currency', 'items', 'value'],
      'view_item' : ['currency', 'items', 'value'],
      'view_item_list' : ['items', 'item_list_name', 'item_list_id'],
      'view_promotion' : ['items', 'promotion_id', 'promotion_name', 'creative_name', 'creative_slot', 'location_id'],
    }

    for (var i = 0; i < events.length; i++) {
      if(eventList[events[i].name] !== undefined){
        for(var eventParam in eventList[events[i].name]){
          if(events[i].params[eventList[events[i].name][eventParam]] === undefined){
            console.log(`Missing a recommened parameter "${eventList[events[i].name][eventParam]}" for "${events[i].name}"`)
          }
        }
      }
    }

  }

  // Removes keys === null as ga4 won't accept the hit
  this.nullParamCheck = function(events){
    for(var i = 0; i < events.length; i++){
        for(var param in events[i].params){
          if(events[i].params[param] === null) {
            console.log(`Removed null param for '${param}' in '${events[i].name}'`)
            delete events[i].params[param];
          }
        }
    }
  }

}




export function createClient(apiSecret, measurementId, clientId){

  let newConnection = new GA4MPClient(apiSecret,measurementId,clientId);

  return newConnection;
}
