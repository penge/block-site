/* global chrome */

var textarea = document.getElementById('textarea');

chrome.storage.sync.get(['blocked'], function (result) {
  var blocked = result.blocked;
  var value = blocked.join('\r\n');
  textarea.value = value;
});

document.getElementById('save').addEventListener('click', function () {
  var blocked = textarea.value.split('\n').filter(string => string.length);
  chrome.storage.sync.set({ 'blocked': blocked }, undefined);
});
