'use strict';

let util = require('../util');
const argv = require('yargs').argv;
let path = require('path');
let fs = require('fs');

let default_config = {
  coach: {
    js_transfer_limit: 120000,
    js_content_limit: 500000
  }
};

let sitespeed_config =
  JSON.parse(fs.readFileSync(path.join(process.env.PWD, argv.config))) ||
  default_config;

module.exports = {
  id: 'javascriptSize',
  title: "Total JavaScript size shouldn't be too big",
  description:
    'A lot of JavaScript often means you are downloading more than you need. How complex is the page and what can the user do on the page? Do you use multiple JavaScript frameworks?',
  weight: 5,
  tags: ['performance', 'javascript'],

  processPage: function(page) {
    let jsAssets = page.assets.filter(asset => asset.type === 'javascript');
    let transferSize = 0;
    let contentSize = 0;
    let transferLimit = sitespeed_config.coach.js_transfer_limit;
    let contentLimit = sitespeed_config.coach.js_content_limit;
    let score = 100;

    jsAssets.forEach(function(asset) {
      transferSize += asset.transferSize;
      contentSize += asset.contentSize;
    });

    if (transferSize > transferLimit) {
      score -= 50;
    }

    if (contentSize > contentLimit) {
      score -= 50;
    }

    return {
      score: score,
      offending: [],
      advice:
        score < 100
          ? 'The total JavaScript transfer size is ' +
            util.formatBytes(transferSize) +
            (contentSize > transferSize
              ? ' and the uncompressed size is ' + util.formatBytes(contentSize)
              : '') +
            '. ' +
            (contentSize > 1000000
              ? 'This is totally crazy! '
              : 'This is too much. ') +
            'You need to remove as much as possible.'
          : ''
    };
  }
};
