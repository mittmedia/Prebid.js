import { expect } from 'chai';
import { spec } from 'modules/livewrappedBidAdapter';
import { newBidder } from 'src/adapters/bidderFactory';
import bidmanager from 'src/bidmanager';

const ENDPOINT = '//lwad';

const PARAMSNOADUNIT = {
  'userId': 'user id',
  'url': 'http://publisher.com/page.html',
  'referrer': 'http://search.com/search.html'
};

const PARAMSADUNITID = {
  'userId': 'user id',
  'adUnitId': 'BA61A167-3D6C-46EB-A232-4D43B038F375',
  'url': 'http://publisher.com/page.html',
  'referrer': 'http://search.com/search.html'
};

const PARAMSSEATS = {
  'userId': 'user id',
  'adUnitId': 'BA61A167-3D6C-46EB-A232-4D43B038F375',
  'url': 'http://publisher.com/page.html',
  'referrer': 'http://search.com/search.html',
  'seats': {'DSP': ['seat 1', 'seat2']}
};

const PARAMSADUNITNAME = {
  'userId': 'user id',
  'publisherId': 'publisher id',
  'adUnitName': 'adunit name 1',
  'url': 'http://publisher.com/page.html',
  'referrer': 'http://search.com/search.html'
};

const PARAMSPREBIDID = {
  'userId': 'user id',
  'publisherId': 'publisher id',
  'url': 'http://publisher.com/page.html',
  'referrer': 'http://search.com/search.html'
};

const USERMATCHINGS = [
  {
    type: 'redirect',
    url: 'http://usermatch1'
  },
  {
    type: 'iframe',
    url: 'http://usermatch2'
  }
];

const SINGLEPLACEMENTREQUEST = {
  'bidderCode': 'livewrapped',
  'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
  'bidderRequestId': '7101db09af0db2',
  'bids': [
    {
      'bidder': 'livewrapped',
      'params': PARAMSADUNITID,
      'adUnitCode': '/19968336/header-bid-tag1',
      'sizes': [
        [728, 90],
        [970, 90]
      ],
      'bidId': '84ab500420319d',
      'bidderRequestId': '7101db09af0db2',
      'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
      'transactionId': '123',
      'auctionId': 1234
    }
  ],
  'start': 1469479810130
};

const MULTIPLEPLACEMENTREQUEST = {
  'bidderCode': 'livewrapped',
  'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
  'bidderRequestId': '7101db09af0db2',
  'bids': [
    {
      'bidder': 'livewrapped',
      'params': PARAMSADUNITID,
      'adUnitCode': '/19968336/header-bid-tag1',
      'sizes': [
        [728, 90],
        [970, 90]
      ],
      'bidId': '74ab500420319d',
      'bidderRequestId': '7101db09af0db2',
      'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
      'transactionId': '123',
      'auctionId': 1234
    },
    {
      'bidder': 'livewrapped',
      'params': PARAMSADUNITNAME,
      'adUnitCode': '/19968336/header-bid-tag2',
      'sizes': [
        [728, 90],
        [970, 90]
      ],
      'bidId': '84ab500420319d',
      'bidderRequestId': '7101db09af0db2',
      'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
      'transactionId': '456',
      'auctionId': 5678
    },
    {
      'bidder': 'livewrapped',
      'params': PARAMSPREBIDID,
      'adUnitCode': '/19968336/header-bid-tag3',
      'sizes': [
        [300, 250],
        [300, 200]
      ],
      'bidId': '94ab500420319d',
      'bidderRequestId': '7101db09af0db2',
      'requestId': 'd3e07445-ab06-44c8-a9dd-5ef9af06d2a6',
      'transactionId': '789',
      'auctionId': 9012
    }
  ],
  'start': 1469479810130
};

const SINGLEPLACEMENTRESPONSE = {
  'ads': [
    {
      'id': 'BA61A167-3D6C-46EB-A232-4D43B038F375',
      'callerId': '/19968336/header-bid-tag1',
      'tag': '<div>adtag 1</div>',
      'width': 728,
      'height': 90,
      'cpmBid': 0.6,
      'auctionId': 1234,
      'bidId': '84ab500420319d',
      'transactionId': '123',
      'creativeId': '789',
      'ttl': 120
    }
  ],
  'pixels': USERMATCHINGS,
  'currency': 'USD'
};

const MULTIPLEPLACEMENTRESPONSE = {
  'ads': [
    {
      'id': 'BA61A167-3D6C-46EB-A232-4D43B038F375',
      'callerId': '/19968336/header-bid-tag1',
      'tag': '<div>adtag 1</div>',
      'width': 728,
      'height': 90,
      'cpmBid': 0.6,
      'auctionId': 1234,
      'bidId': '84ab500420319d',
      'transactionId': '123',
      'creativeId': '789',
      'ttl': 120
    },
    {
      'id': 'adunit id 2',
      'callerId': '/19968336/header-bid-tag2',
      'tag': '<div>adtag 2</div>',
      'width': 728,
      'height': 90,
      'cpmBid': 0.7,
      'auctionId': 5678,
      'bidId': '94ab500420319d',
      'transactionId': '456',
      'creativeId': '012',
      'ttl': 120
    },
    {
      'id': 'adunit id 2',
      'callerId': '/19968336/header-bid-tag3',
      'tag': '<div>adtag 3</div>',
      'width': 300,
      'height': 250,
      'cpmBid': 0.8,
      'auctionId': 9012,
      'bidId': '94ab500420319d',
      'transactionId': '789',
      'creativeId': '345',
      'ttl': 120
    }
  ],
  'pixels': USERMATCHINGS,
  'currency': 'USD'
};

describe('LivewrappedAdapter', () => {
  const adapter = newBidder(spec);

  describe('request function', () => {
    let xhr;
    let requests;

    beforeEach(() => {
      xhr = sinon.useFakeXMLHttpRequest();
      requests = [];
      xhr.onCreate = request => requests.push(request);
    });

    afterEach(() => xhr.restore());

    it('exists and is a function', () => {
      expect(adapter.callBids).to.exist.and.to.be.a('function');
    });

    it('requires parameters to make request', () => {
      adapter.callBids({});
      expect(requests).to.be.empty;
    });

    it('requires adUnitId if no publisher id set', () => {
      SINGLEPLACEMENTREQUEST.bids[0].params = PARAMSNOADUNIT;
      adapter.callBids(SINGLEPLACEMENTREQUEST);
      expect(requests).to.be.empty;
    });

    it('should create valid single ad request', () => {
      SINGLEPLACEMENTREQUEST.bids[0].params = PARAMSADUNITID;
      adapter.callBids(SINGLEPLACEMENTREQUEST);

      const request = JSON.parse(requests[0].requestBody);
      expect(request).to.not.be.empty;
      expect(request).to.deep.equal({
        auctionId: 1234,
        userId: 'user id',
        url: 'http://publisher.com/page.html',
        referrer: 'http://search.com/search.html',
        adRequests: [
          {
            adUnitId: 'BA61A167-3D6C-46EB-A232-4D43B038F375',
            callerAdUnitId: '/19968336/header-bid-tag1',
            formats: [
              {
                width: 728,
                height: 90
              },
              {
                width: 970,
                height: 90
              }
            ],
            bidId: '84ab500420319d',
            transactionId: '123'
          }
        ],
        version: '1.0'
      });
    });

    it('should create valid single ad request with seats', () => {
      SINGLEPLACEMENTREQUEST.bids[0].params = PARAMSSEATS;
      adapter.callBids(SINGLEPLACEMENTREQUEST);

      const request = JSON.parse(requests[0].requestBody);
      expect(request).to.not.be.empty;
      expect(request).to.deep.equal({
        auctionId: 1234,
        userId: 'user id',
        url: 'http://publisher.com/page.html',
        referrer: 'http://search.com/search.html',
        seats: {'DSP': ['seat 1', 'seat2']},
        adRequests: [
          {
            adUnitId: 'BA61A167-3D6C-46EB-A232-4D43B038F375',
            callerAdUnitId: '/19968336/header-bid-tag1',
            formats: [
              {
                width: 728,
                height: 90
              },
              {
                width: 970,
                height: 90
              }
            ],
            bidId: '84ab500420319d',
            transactionId: '123'
          }
        ],
        version: '1.0'
      });
    });

    it('should create valid multiple ad request', () => {
      adapter.callBids(MULTIPLEPLACEMENTREQUEST);

      const request = JSON.parse(requests[0].requestBody);
      expect(request).to.not.be.empty;
      expect(request).to.deep.equal({
        auctionId: 1234,
        userId: 'user id',
        url: 'http://publisher.com/page.html',
        referrer: 'http://search.com/search.html',
        publisherId: 'publisher id',
        version: '1.0',
        adRequests: [
          {
            adUnitId: 'BA61A167-3D6C-46EB-A232-4D43B038F375',
            callerAdUnitId: '/19968336/header-bid-tag1',
            formats: [
              {
                width: 728,
                height: 90
              },
              {
                width: 970,
                height: 90
              }
            ],
            bidId: '74ab500420319d',
            transactionId: '123'
          },
          {
            callerAdUnitId: 'adunit name 1',
            formats: [
              {
                width: 728,
                height: 90
              },
              {
                width: 970,
                height: 90
              }
            ],
            bidId: '84ab500420319d',
            transactionId: '456',
          },
          {
            callerAdUnitId: '/19968336/header-bid-tag3',
            formats: [
              {
                width: 300,
                height: 250
              },
              {
                width: 300,
                height: 200
              }
            ],
            bidId: '94ab500420319d',
            transactionId: '789',
          }
        ]
      });
    });
  });

  describe('response handler', () => {
    let server;

    beforeEach(() => {
      server = sinon.fakeServer.create();
      sinon.stub(bidmanager, 'addBidResponse');
    });

    afterEach(() => {
      server.restore()
      bidmanager.addBidResponse.restore();
    });

    it('registers single placement bids', () => {
      server.respondWith(JSON.stringify(SINGLEPLACEMENTRESPONSE));

      adapter.callBids(SINGLEPLACEMENTREQUEST);
      server.respond();
      sinon.assert.calledOnce(bidmanager.addBidResponse);

      const response = bidmanager.addBidResponse.firstCall.args[1];
      expect(response).to.have.property('statusMessage', 'Bid available');
      expect(response).to.have.property('cpm', 0.6);
    });

    it('registers multiple placement bids', () => {
      server.respondWith(JSON.stringify(MULTIPLEPLACEMENTRESPONSE));

      adapter.callBids(MULTIPLEPLACEMENTREQUEST);
      server.respond();
      sinon.assert.calledThrice(bidmanager.addBidResponse);

      let response = bidmanager.addBidResponse.firstCall.args[1];
      expect(response).to.have.property('statusMessage', 'Bid available');
      expect(response).to.have.property('cpm', 0.6);

      response = bidmanager.addBidResponse.secondCall.args[1];
      expect(response).to.have.property('statusMessage', 'Bid available');
      expect(response).to.have.property('cpm', 0.7);

      response = bidmanager.addBidResponse.thirdCall.args[1];
      expect(response).to.have.property('statusMessage', 'Bid available');
      expect(response).to.have.property('cpm', 0.8);
    });
  });
});
