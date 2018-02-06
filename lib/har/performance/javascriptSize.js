'use strict';

let util = require('../util');

module.exports = {
  id: 'javascriptSize',
  title: "Total JavaScript size shouldn't be too big",
  description:
    'A lot of JavaScript often means you are downloading more than you need. How complex is the page and what can the user do on the page? Do you use multiple JavaScript frameworks?',
  weight: 5,
  tags: ['performance', 'javascript'],

  processPage: function(page, domAdvice, options) {
    let jsAssets = page.assets.filter(asset => asset.type === 'javascript');
    let transferSize = 0;
    let contentSize = 0;
    let transferLimit = options.coach.js_transfer_limit || 120000;
    let contentLimit = options.coach.js_content_limit || 500000;
    let contentCrazy = options.coach.js_content_crazy || 1000000;
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
            (contentSize > contentCrazy
              ? 'This is totally crazy! '
              : 'This is too much. ') +
            'You need to remove as much as possible.'
          : ''
    };
  }
};
