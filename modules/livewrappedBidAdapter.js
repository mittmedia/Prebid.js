import * as utils from 'src/utils';
import { registerBidder } from 'src/adapters/bidderFactory';

const BIDDER_CODE = 'livewrapped';
const URL = '//lwadm.com/ad';
const VERSION = '1.0';

export const spec = {
  code: BIDDER_CODE,

  /**
   * Determines whether or not the given bid request is valid.
   *
   * Parameters should be
   *
   * adUnitId:    LiveWrapped's id of the ad unit.    Optional. A guid identifying the ad unit.
   * adUnitName:  LiveWrapped's name of the ad unit   Optional. (Prebid's ad unit code will be used otherwise.)
   * publisherId: Publisher id.                       Required if adUnitName is used or both adUnitName and adUnitId is omitted, otherwise optional.
   * userId:      A persistent user id if available.  Optional.
   * url:         Page url                            Optional. Use if page url cannot be determined due to use of iframes.
   * referrer:    Referrer url                        Optional.
   * bidUrl:      Bidding endpoint                    Optional.
   * seats:       List of bidders and  seats          Optional. {"bidder name": ["seat 1", "seat 2"], ...}
   * deviceId:    Device id if available              Optional.
   * ifa:         Advertising ID                      Optional.
   *
   * @param {BidRequest} bid The bid params to validate.
   * @return boolean True if this is a valid bid, and false otherwise.
   */
  isBidRequestValid: function(bid) {
    return bid.params.adUnitId || (!bid.params.adUnitId && bid.params.publisherId);
  },

  /**
   * Make a server request from the list of BidRequests.
   *
   * @param {BidRequest[]} bidRequests A non-empty list of bid requests which should be sent to the Server.
   * @return ServerRequest Info describing the request to the server.
   */
  buildRequests: function(bidRequests) {
    const userId = bidRequests.find(hasUserId);
    const publisherId = bidRequests.find(hasPublisherId);
    const referrer = bidRequests.find(hasReferrer);
    const auctionId = bidRequests.find(hasAuctionId);
    let bidUrl = bidRequests.find(hasBidUrl);
    let url = bidRequests.find(hasUrl);
    let test = bidRequests.find(hasTestParam);
    let seats = bidRequests.find(hasSeatsParam);
    let deviceId = bidRequests.find(hasDeviceIdParam);
    let ifa = bidRequests.find(hasIfaParam);
    bidUrl = bidUrl ? bidUrl.params.bidUrl : URL;
    url = url ? url.params.url : utils.getTopWindowUrl();
    test = test ? test.params.test : undefined;
    var adRequests = bidRequests.map(bidToAdRequest);

    const payload = {
      auctionId: auctionId ? auctionId.auctionId : undefined,
      publisherId: publisherId ? publisherId.params.publisherId : undefined,
      userId: userId ? userId.params.userId : undefined,
      url: url,
      referrer: referrer ? referrer.params.referrer : undefined,
      test: test,
      seats: seats ? seats.params.seats : undefined,
      deviceId: deviceId ? deviceId.params.deviceId : undefined,
      ifa: ifa ? deviceId.params.ifa : undefined,
      version: VERSION,
      adRequests: [...adRequests]
    };
    const payloadString = JSON.stringify(payload);
    return {
      method: 'POST',
      url: bidUrl,
      data: payloadString,
    };
  },

  /**
   * Unpack the response from the server into a list of bids.
   *
   * @param {*} serverResponse A successful response from the server.
   * @return {Bid[]} An array of bids which were nested inside the server.
   */
  interpretResponse: function(serverResponse) {
    const bidResponses = [];

    serverResponse.body.ads.forEach(function(ad) {
      let bidResponse = {
        requestId: ad.bidId,
        bidderCode: BIDDER_CODE,
        cpm: ad.cpmBid,
        width: ad.width,
        height: ad.height,
        ad: ad.tag,
        ttl: ad.ttl,
        creativeId: ad.creativeId,
        netRevenue: true,
        currency: serverResponse.body.currency
      };

      bidResponses.push(bidResponse);
    });

    return bidResponses;
  },

  getUserSyncs: function(syncOptions, serverResponses) {
    if (serverResponses.length == 0) return [];

    let syncList = [];
    let userSync = serverResponses[0].body.pixels || [];

    userSync.forEach(function(sync) {
      if (syncOptions.pixelEnabled && sync.type == 'Redirect') {
        syncList.push({type: 'image', url: sync.url});
      }

      if (syncOptions.iframeEnabled && sync.type == 'Iframe') {
        syncList.push({type: 'iframe', url: sync.url});
      }
    });

    return syncList;
  }
}

function hasUserId(bid) {
  return !!bid.params.userId;
}

function hasPublisherId(bid) {
  return !!bid.params.publisherId;
}

function hasReferrer(bid) {
  return !!bid.params.referrer;
}

function hasUrl(bid) {
  return !!bid.params.url;
}

function hasBidUrl(bid) {
  return !!bid.params.bidUrl;
}

function hasAuctionId(bid) {
  return !!bid.auctionId;
}

function hasTestParam(bid) {
  return !!bid.params.test;
}

function hasSeatsParam(bid) {
  return !!bid.params.seats;
}

function hasDeviceIdParam(bid) {
  return !!bid.params.deviceId;
}

function hasIfaParam(bid) {
  return !!bid.params.ifa;
}

function bidToAdRequest(bid) {
  return {
    adUnitId: bid.params.adUnitId,
    callerAdUnitId: bid.params.adUnitName || bid.adUnitCode || bid.placementCode,
    bidId: bid.bidId,
    transactionId: bid.transactionId,
    formats: bid.sizes.map(sizeToFormat)
  };
}

function sizeToFormat(size) {
  return {
    width: size[0],
    height: size[1]
  }
}

registerBidder(spec);
