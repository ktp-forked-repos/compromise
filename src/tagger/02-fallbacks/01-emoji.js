const emojiReg = require('./emoji/regex');
const emoticon = require('./emoji/list');
//for us, there's three types -
// * ;) - emoticons
// * 🌵 - unicode emoji
// * :smiling_face: - asci-represented emoji

//test for forms like ':woman_tone2:‍:ear_of_rice:'
//https://github.com/Kikobeats/emojis-keywords/blob/master/index.js
const isCommaEmoji = (t) => {
  if (t.text.charAt(0) === ':') {
    //end comma can be last or second-last ':haircut_tone3:‍♀️'
    if (t.text.match(/:.?$/) === null) {
      return false;
    }
    //ensure no spaces
    if (t.text.match(' ')) {
      return false;
    }
    //reasonably sized
    if (t.text.length > 35) {
      return false;
    }
    return true;
  }
  return false;
};

//check against emoticon whitelist
const isEmoticon = (t) => {
  let str = t.text.replace(/^[:;]/, ':'); //normalize the 'eyes'
  return emoticon.hasOwnProperty(str);
};

//
const emojiStep = (terms, world) => {
  for (let i = 0; i < terms.length; i++) {
    let t = terms[i];
    //test for :keyword: emojis
    if (isCommaEmoji(t)) {
      t.tag('Emoji', world, 'comma-emoji');
    }
    //test for unicode emojis
    if (t.text.match(emojiReg)) {
      t.tag('Emoji', world, 'unicode-emoji');
    }
    //test for emoticon ':)' emojis
    if (isEmoticon(t)) {
      t.tag('Emoji', world, 'emoticon-emoji');
    }
  }
};
module.exports = emojiStep;