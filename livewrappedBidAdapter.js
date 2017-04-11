import * as utils from 'src/utils';
import {config} from 'src/config';
import {registerBidder} from 'src/adapters/bidderFactory';
const BIDDER_CODE = 'livewrapped';
const URL = "http://localhost:49980/ad"
export const spec = {
    code: BIDDER_CODE,
    /**
     * Determines whether or not the given bid request is valid.
     * 
     * Parameters should be
     * 
     * adUnitId:    LiveWrapped's id of the ad unit.    Optional (Prebid's ad unit code will be used otherwise.)
     * publisherId: Publisher id.                       Optional if adUnitId is set, otherwise required.
     * userId:      A persistent user id  is available. Optional
     * url:         Page url                            Optional. Use if page url cannot be determined due to use of iframes.
     * referrer:    Referrer url                        Optional
     * bidUrl:      Bidding endpoint                    Optional.
     *
     * @param {BidRequest} bid The bid params to validate.
     * @return boolean True if this is a valid bid, and false otherwise.
     */
    isBidRequestValid: function(bid) {
        return bid.Params.adUnitId || (!bid.params.adUnitId && bid.params.publisherId);
    },
    /**
     * Make a server request from the list of BidRequests.
     *
     * @param {validBidRequests[]} - an array of bids
     * @return ServerRequest Info describing the request to the server.
     */
    buildRequests: function(validBidRequests) {
        const userId = bidRequests.find(hasUserInfo);
        const publisherId = bidRequest.find(hasPublisherId);
        let bidUrl = bidRequest.find(hasBidUrl);
        let url = bidRequest.find(hasUrl);
        const referrer = bidRequest.find(hasReferrer);
        const auctionId = bidRequest.find(hasAuctioId);
        bidUrl = bidUrl ? bidUrl : URL;
        url = url ? url : utils.getTopWindowUrl();
        var adRequests = bidRequests.map(bidToAdRequest);

        const payload = {
            auctionId: auctionId,
            publisherId: publisherId,
            userId: userId,
            url: url,
            referrer: referrer,
            adRequests: [...adRequests],
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
    interpretResponse: function(serverResponse, bidRequest) {
        const bidResponses = [];
        // loop through serverResponses {
        const bidResponse = {
/*            requestId: bidRequest.bidId,
            bidderCode: spec.code,
            cpm: CPM,
            width: WIDTH,
            height: HEIGHT,
            creativeId: CREATIVE_ID,
            dealId: DEAL_ID,
            currency: CURRENCY,
            netRevenue: true,
            ttl: TIME_TO_LIVE,
            referrer: REFERER,
            ad: CREATIVE_BODY*/
        };
        bidResponses.push(bidResponse);
        return bidResponses;
    },
    getUserSyncs: function(syncOptions) {
        if (syncOptions.pixelEnabled) {
            return [{
                type: 'pixel',
                url: 'ADAPTER_SYNC_URL'
            }];
        }
    }
}

function hasUserInfo(bid) {
    return !!bid.params.userId;
}

function hasUserPublisherId(bid) {
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
  
function bidToAdRequest(bid) {
    return {
        adUnitId: bid.params.adUnitId,
        callerAdUnitId: bid.adUnitCode,
        bidId: bid.bidId,
        transactionId: bid.transactionId,
        formats: bid.sizes.map(sizeToFormat)
    };
}

function sizeToFormat(size){
    return {
        width: size[0],
        height: size[1]
    }
}
    
registerBidder(spec);