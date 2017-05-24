var config = {
  blinktrade: {
    prod: 'https://depositsapi.blinktrade.com/_webhook/deposit_receipt',
    testnet: 'https://api.testnet.blinktrade.com/_webhook/deposit_receipt',
  },
  store_url: 'https://storage.googleapis.com/%s/%s'
};

module.exports = config;
