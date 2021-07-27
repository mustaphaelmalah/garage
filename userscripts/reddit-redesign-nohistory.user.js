// ==UserScript==
// @name         Reddit Redesign No History
// @namespace    https://mustaphaelmalah.github.io
// @version      0.1
// @description  Disable history pollution from new reddit redesign with post popup
// @author       Mustapha Elmalah
// @match        https://www.reddit.com/*
// @include      https://www.reddit.com/*
// @grant        none
// @downloadURL  https://github.com/mustaphaelmalah/garage/blob/master/userscripts/reddit-redesign-nohistory.user.js
// @updateURL    https://github.com/mustaphaelmalah/garage/blob/master/userscripts/reddit-redesign-nohistory.user.js
// ==/UserScript==

history.pushState = function() {}
history.replaceState = function() {}
