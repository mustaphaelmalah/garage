// ==UserScript==
// @name         safari-video-keyboard-nav
// @namespace    https://mustaphaelmalah.github.io
// @version      0.1
// @description  Adds keyboard navigation for HTML videos, mainly for safari. Derived from: https://japnaa.github.io/Userscripts/userscripts/fileVideoKeyboardControlForFiles.user.js
// @author       Musapha Elmalah
// @match        *://*/*
// @grant        none
// @downloadURL  https://github.com/mustaphaelmalah/garage/blob/master/userscripts/safari-video-keyboard-nav.user.js
// @updateURL    https://github.com/mustaphaelmalah/garage/blob/master/userscripts/safari-video-keyboard-nav.user.js
// ==/UserScript==

(() => {
    const vid = document.querySelector("video");
    if(!vid) {
        return;
    }

    // Remove existing keyboard listeners
    if(typeof getEventListeners !== 'undefined') {
        let listeners = getEventListeners(vid)["keydown"];
        Object.keys(handler => {
            vid.removeEventListener("keydown", handler);
        });
    }

    addEventListener("keydown", function (e) {
        let time = 5;
        if (e.shiftKey) { time /= 2.5; }
        if (e.altKey) { time *= 6; }
        if (e.ctrlKey) { time = 1 / 60; }

        let capture = true;
        switch (e.keyCode) {
            case 37:
                vid.currentTime -= time;
                break;
            case 39:
                vid.currentTime += time;
                break;
            case 32:
                if(vid.paused || vid.currentTime === 0) {
                    vid.play();
                } else {
                    vid.pause();
                }
                break;
            default:
                capture = false;
        }

        if (capture) {
            e.preventDefault();
        }
    });
})();
