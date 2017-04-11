# Overview

```
Module Name:  Livewrapped Bid Adapter
Module Type:  Bidder Adapter
Maintainer: info@livewrapped.org
```

# Description

Connects to Livewrapped Header Bidding wrapper for bids.

Livewrapped supports banner.

The below test parameters

# Test Parameters

Parameters below is documentation and will not return an actual ad. To be updated.

```
var adUnits = [
   {
       code: 'banner-div',
       sizes: [[300, 250], [300,600]],
       bids: [{
         bidder: 'livewrapped',
         params: {
           adUnitId: '[guid]',     // Optional. LiveWrapped's id of the ad unit. A guid identifying the ad unit.
           adUnitName: '[string]', // Optional. Name of the ad unit. Requires publisherId. Can be used instead of adUnitId.
                                   // If neither of adUnitId or adUnitName is used, prebid's "code" is used above. 
                                   // This requires PublisherId to be set.
           publisherId: '[guid]',  // Optional. Required if adUnitName or prebid "code" is used.
           userId: '[string]',     // Optional. A persistent user id if available.
           url: '[url]',           // Optional. The page url.
           referrer: '[url]',      // Optional. The page referrer url.
           seats: '[json]'         // Optional. A list of seats to send to a bidder: {"bidder name": ["seat 1", "seat 2"], ...}
         }
       }]
   }
];
```
