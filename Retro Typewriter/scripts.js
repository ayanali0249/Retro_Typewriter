'use strict';

const sidebarWidth = 340;
const lettersScale = 6;

let sounds = [];

let curSlide;

let currentColor = 1;
let temporaryCorrectingRibbon = true;

let cmdHeld = false;
let saveStateTimer = -1;

let mouseDragStartX = false;
let mouseDragStartY = false;
let mouseDragLastX = false;
let mouseDragLastY = false;
let mouseDragModeRotation = false;

let outputScale;

let sidebarPage = 'main';

let cheatMyLayout = false;
let cheatArrowKeys = false;
let cheatCapsLock = false;
let cheatIgnoreMargins = false;
let cheatComputerBackspace = false;
let cheatMulticolor = false;

let moreOptionsVisible = false;

let zoomedOut = false;

let marginLeft = 0;
let marginRight = 70;

let marginReleaseActive = false;

let bellFiredOnThisLine = false;

let toSaveBoundingBox;

// -------------------- Device Detection --------------------

const isIOS = () => {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  } else {
    return navigator.maxTouchPoints &&
      navigator.maxTouchPoints > 2 &&
      /MacIntel/.test(navigator.platform);
  }
};

const isIpadOS = () => {
  return navigator.maxTouchPoints &&
    navigator.maxTouchPoints > 2 &&
    /MacIntel/.test(navigator.platform);
};

const isAndroid = () => {
  return navigator.userAgent.indexOf('Android') !== -1;
};

// -------------------- Responsive Width --------------------

const RESPONSIVE_WIDTH_NORMAL = 0;
const RESPONSIVE_WIDTH_1279 = 1;
const RESPONSIVE_WIDTH_1023 = 2;

function getResponsiveWidthType() {
  if (window.innerWidth <= 1023) {
    return RESPONSIVE_WIDTH_1023;
  } else if (window.innerWidth <= 1279) {
    return RESPONSIVE_WIDTH_1279;
  } else {
    return RESPONSIVE_WIDTH_NORMAL;
  }
}

// -------------------- Typewriter Mystery --------------------

let typewriterPlaybackData = [];

typewriterPlaybackData['correcting-1'] = `
1. M 1, y 1, sp 1, n 1, a 1, m 1, e 1, sp 1, i 1, s 1, sp 1, A 1, u 1, d 1, r 1, e 1, y 1, bs 6, x 6, M 1, a 1, r 1, c 1, i 1, n 1, . 1
`;

typewriterPlaybackData['correcting-2'] = `
M 1, y 1, sp 1, n 1, a 1, m 1, e 1, sp 1, i 1, s 1, sp 1, M 1, a 1, r 1, i 1, n 1, sp 1, W 1, i 1, c 1, bs 9, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, wite 1, bs 5, hs 1, M 1, a 1, r 1, c 1, i 1, n 1, hs 1, sp 3, h 1, a 1, r 1, y 1, dot 1
`;

typewriterPlaybackData['correcting-3'] = `
1. M 1, y 1, sp 1, n 1, a 1, m 1, e 1, sp 1, i 1, s 1, sp 1, A 1, u 1, d 1, r 1, e 1, y 1, bs 6, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, wite 1, sp 1, bs 6, M 1, a 1, r 1, c 1, i 1, n 1, . 1
`;

typewriterPlaybackData['valeria'] = `
1. sp 4, ) 3, bs 1, ( 1.
2. sp 3, ( 3, ) 2, bs 2, . 2, bs 1, ul 1.
3. sp 3, / 1, bs 1, ul 1, / 1, sp 2, / 1.
4. sp 3, / 1, ( 1, ul 1, ribbon, O 1, ribbon.
5. sp 1, ul 1, / 1, bs 1, ( 1, ul 1, / 1, bs 1, ul 2.
6. / 1, sp 5, ) 1.
`;
typewriterPlaybackData['sweater-boy'] = `
1. sp 5, ( 1, ul 1, bs 1, ( 1.
2. sp 3, ( 3, sp 1, ' 1, o 1, bs 1, . 1, ul 1.
3. sp 4, ) 1, ul 1, bs 1, ) 1, ' 1, o 1, bs 1, . 1, sp 1, o 1, ul 1, bs 1, ) 1.
4. sp 4, ( 1, ul 1, bs 1, -1, sp 3, / 1, ( 1.
5. sp 5, / 1, bs 1, ul 5, / 1.
6. sp 2, ul 2, / 1, bs 1, ( 4, bs 3, ) 3, ul 4.
7. sp 1, / 1, bs 1, ( 11, bs 10, ) 10.
8. / 1, bs 1, ( 12, bs 11, ) 11.  
`;

typewriterPlaybackData['lawrence'] = `
1. sp 13, ) 3.
2. sp 12, / 1, bs 1, - 1, bs 1, . 1, sp 2, ) 2.
3. sp 11, / 2, bs 1, ul 1, sp 1, - 1, bs 1, . 1, ( 1, ul 1, bs 1, ( 1.
4. sp 10, / 1, bs 1, ( 1, ul 2, sp 2, ul 1, bs 1, - 1, / 1.
5. sp 9, ( 1, ul 2, sp 2, / 1, bs 1, ul 1.
6. sp 9, ul 2, / 1, bs 1, ( 1, ul 1, / 2, bs 1, ( 1, ul 2.
7. sp 8, / 1, sp 1, ( 2, / 2, sp 3, ) 1.
8. sp 7, / 1, sp 1, / 1, sp 1, ) 1, bs 1, / 1, sp 4, / 1.
9. sp 6, / 1, sp 1, / 1, ) 1, / 1, bs 1, . 1, sp 2, / 1, sp 1, / 1.
10. sp 5, / 1, sp 1, / 3, bs 1, . 1, sp 2, / 1, sp 1, / 1.
11. sp 4, / 1, sp 1, / 3, sp 2, / 1, sp 1, / 1.
12. sp 3, / 1, bs 1, ul 2, / 3, bs 2, ul 4, / 1, bs 1, ul 2, / 1.
13. sp 3, ( 1, ul 1, bs 1, ( 1, sp 1, ( 1, sp 1, / 1, sp 1, ( 1, ul 1, bs 1, ( 1.
14. sp 6, ) 1, / 1, sp 2, / 1.
15. sp 6, / 1, sp 2, / 1.
16. sp 5, / 1, sp 2, / 1, ) 1.
17. sp 4, / 1, sp 2, / 1, sp 1, ( 1.
18. sp 3, / 1, sp 2, / 1, ) 1, sp 1, / 1, bs 1, ( 1.
19. sp 1, ul 1, / 1, sp 2, / 1, ul 1, ( 1, / 2.
20. ( 2, ) 1, bs 1, ul 2, / 1, ( 1, ul 1, bs 1, ( 1, / 1, bs 1, ul 1, / 1.
21. sp 1, ) 1, bs 1, ul 2, bs 1, - 1, / 1.
`;

let mysteryArray;
let mysteryArrayPos;
let mysteryCurrentlyTyping = false;
let mysteryCurrentlyTypingId;
let mysteryPingTimer;

function cancelPlayback() {
  clearTimeout(mysteryPingTimer);
  document.querySelector(`aside .example[data-playback-id="${mysteryCurrentlyTypingId}"]`).classList.remove('playing');
  mysteryCurrentlyTyping = false;
}

function startPlayback(id) {
  if (mysteryCurrentlyTyping) {
    cancelPlayback();
    return;
  }

  mysteryCurrentlyTyping = true;
  mysteryCurrentlyTypingId = id;
  const slideEl = curSlide;

  document.querySelector(`aside .example[data-playback-id="${id}"]`).classList.add('playing');

  mysteryArray = [];

  const originalData = typewriterPlaybackData[id];

  if (originalData.includes('2.')) {
    mysteryArray.push('nl');
    mysteryArray.push('nl');
  }

  const lines = originalData.split(/\n/);
  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    line = line.substring(line.indexOf('.') + 1);
    const characters = line.split(',');

    for (let character of characters) {
      character = character.trim();
      if (!character) continue;

      if (character.endsWith('.')) {
        character = character.slice(0, -1);
      }

      if (character === 'ribbon') {
        character = 'ribbon 1';
      }

      let repeatCount = 1;
      const match = character.match(/\d+/);
      if (match) {
        repeatCount = parseInt(match[0], 10);
      }

      const count = parseInt(character.slice(-match[0].length));
      const letter = character.slice(0, character.length - match[0].length).trim();

      for (let i = 0; i < count; i++) {
        mysteryArray.push(letter);
      }
    }
    mysteryArray.push('nl');
  }

  mysteryArray.pop();
  mysteryArrayPos = 0;
  mysteryPing(true);
}

let mysteryPingDelay = 500
function mysteryPing(automatic) {
  let key = mysteryArray[mysteryArrayPos];
  let code;
  let shiftKey = false;

  switch (key) {
    case 'sp':
      key = ' ';
      code = 'Space';
      break;
    case 'bs':
      key = 'Backspace';
      code = 'Backspace';
      break;
    case 'nl':
      key = 'Enter';
      code = 'Enter';
      break;
    case 'ribbon':
      break;
    case 'ul':
      key = '_';
      code = 'Digit6';
      shiftKey = true;
      break;
    case 'up':
      key = 'PageUp';
      code = 'PageUp';
      break;
    case 'dn':
      key = 'PageDown';
      code = 'PageDown';
      break;
    case '(':
      code = 'Digit9';
      shiftKey = true;
      break;
    case ')':
      code = 'Digit0';
      shiftKey = true;
      break;
    case '/':
      code = 'Slash';
      break;
    case 'a': code = 'KeyA'; break;
    case 'b': code = 'KeyB'; break;
    case 'c': code = 'KeyC'; break;
    case 'd': code = 'KeyD'; break;
    case 'e': code = 'KeyE'; break;
    case 'f': code = 'KeyF'; break;
    case 'g': code = 'KeyG'; break;
    case 'h': code = 'KeyH'; break;
    case 'i': code = 'KeyI'; break;
    case 'j': code = 'KeyJ'; break;
    case 'k': code = 'KeyK'; break;
    case 'l': code = 'KeyL'; break;
    case 'm': code = 'KeyM'; break;
    case 'n': code = 'KeyN'; break;
    case 'o': code = 'KeyO'; break;
    case 'p': code = 'KeyP'; break;
    case 'q': code = 'KeyQ'; break;
    case 'r': code = 'KeyR'; break;
    case 's': code = 'KeyS'; break;
    case 't': code = 'KeyT'; break;
    case 'u': code = 'KeyU'; break;
    case 'v': code = 'KeyV'; break;
    case 'w': code = 'KeyW'; break;
    case 'x': code = 'KeyX'; break;
    case 'y': code = 'KeyY'; break;
    case 'z': code = 'KeyZ'; break;
    case 'A': code = 'KeyA'; shiftKey = true; break;
    case 'B': code = 'KeyB'; shiftKey = true; break;
    case 'C': code = 'KeyC'; shiftKey = true; break;
    case 'D': code = 'KeyD'; shiftKey = true; break;
    case 'E': code = 'KeyE'; shiftKey = true; break;
    case 'F': code = 'KeyF'; shiftKey = true; break;
    case 'G': code = 'KeyG'; shiftKey = true; break;
    case 'H': code = 'KeyH'; shiftKey = true; break;
    case 'I': code = 'KeyI'; shiftKey = true; break;
    case 'J': code = 'KeyJ'; shiftKey = true; break;
    case 'K': code = 'KeyK'; shiftKey = true; break;
    case 'L': code = 'KeyL'; shiftKey = true; break;
    case 'M': code = 'KeyM'; shiftKey = true; break;
    case 'N': code = 'KeyN'; shiftKey = true; break;
    case 'O': code = 'KeyO'; shiftKey = true; break;
    case 'P': code = 'KeyP'; shiftKey = true; break;
    case 'Q': code = 'KeyQ'; shiftKey = true; break;
    case 'R': code = 'KeyR'; shiftKey = true; break;
    case 'S': code = 'KeyS'; shiftKey = true; break;
    case 'T': code = 'KeyT'; shiftKey = true; break;
    case 'U': code = 'KeyU'; shiftKey = true; break;
    case 'V': code = 'KeyV'; shiftKey = true; break;
    case 'W': code = 'KeyW'; shiftKey = true; break;
    case 'X': code = 'KeyX'; shiftKey = true; break;
    case 'Y': code = 'KeyY'; shiftKey = true; break;
    case 'Z': code = 'KeyZ'; shiftKey = true; break;
    case '.':
      code = 'Period';
      break;
    case '-':
      key = '0';
      code = 'Digit0';
      break;
    case `'`:
      key = '*';
      code = 'Digit8';
      shiftKey = true;
      break;
    case 'wite':
      key = 'Delete';
      code = 'Delete';
      break;
    case 'dot':
      key = '.';
      code = 'Period';
      break;
    case 'hs':
      key = '`';
      code = 'Backquote';
      break;
  }

  if (key === 'ribbon') {
    changeRibbon({ shiftKey: typewriterTexts[typewriterTexts.length - 1].color == 2 });
  } else {
    typeIntoTypewriter({ key, code, shiftKey });
    window.setTimeout(() => {
      typeIntoTypewriterUp({ key, code, shiftKey });
    }, 35);
  }

  mysteryArrayPos++;

  if (automatic) {
    if (mysteryArrayPos < mysteryArray.length) {
      mysteryPingTimer = window.setTimeout(() => {
        mysteryPing(true);
      }, mysteryPingDelay);
    } else {
      cancelPlayback();
    }

    mysteryPingDelay -= 50;
    const max = mysteryArray.length > 100 ? 50 : 250;
    if (mysteryPingDelay < max) {
      mysteryPingDelay = max;
    }
  }
}


// Specific slide logic
// --------------------------------------------------------------------------

const ALLOWED_TYPEWRITER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890`~!@#$%^&*()-=_+;\':",./<>?'

const UNDERWOOD_LETTERS = {
  'Backquote': { key: 'HS', shiftedKey: 'HS', smallLegend: true, newRow: true, rowLeftAlign: 0  },
  'Digit2': { key: '2', shiftedKey: '"', capsLock: true },
  'Digit3': { key: '3', shiftedKey: '#', capsLock: true },
  'Digit4': { key: '4', shiftedKey: '$', capsLock: true },
  'Digit5': { key: '5', shiftedKey: '%', capsLock: true },
  'Digit6': { key: '6', shiftedKey: '_', capsLock: true },
  'Digit7': { key: '7', shiftedKey: '&', capsLock: true },
  'Digit8': { key: '8', shiftedKey: "'", capsLock: true },
  'Digit9': { key: '9', shiftedKey: '(', capsLock: true },
  'Digit0': { key: '-', shiftedKey: ')', capsLock: true },
  'Minus': { key: '´', shiftedKey: '¸', capsLock: true },
  'Equal': { key: '`', shiftedKey: '¨', capsLock: true },
  'temp-margin-release': { key: 'MR', shiftedKey: 'MR', smallLegend: true},

  'KeyQ': { key: 'q', shiftedKey: 'Q', newRow: true, rowLeftAlign: .5 },
  'KeyW': { key: 'w', shiftedKey: 'W', },
  'KeyE': { key: 'e', shiftedKey: 'E', },
  'KeyR': { key: 'r', shiftedKey: 'R', },
  'KeyT': { key: 't', shiftedKey: 'T', },
  'KeyY': { key: 'y', shiftedKey: 'Y', },
  'KeyU': { key: 'u', shiftedKey: 'U', },
  'KeyI': { key: 'i', shiftedKey: 'I', },
  'KeyO': { key: 'o', shiftedKey: 'O', },
  'KeyP': { key: 'p', shiftedKey: 'P', },
  'BracketLeft': { key: '½', shiftedKey: '¼', capsLock: true },
  'Backspace': { key: 'BK', shiftedKey: 'BK', smallLegend: true },

  'KeyA': { key: 'a', shiftedKey: 'A', newRow: true, rowLeftAlign: .75 },
  'KeyS': { key: 's', shiftedKey: 'S', },
  'KeyD': { key: 'd', shiftedKey: 'D', },
  'KeyF': { key: 'f', shiftedKey: 'F', },
  'KeyG': { key: 'g', shiftedKey: 'G', },
  'KeyH': { key: 'h', shiftedKey: 'H', },
  'KeyJ': { key: 'j', shiftedKey: 'J', },
  'KeyK': { key: 'k', shiftedKey: 'K', },
  'KeyL': { key: 'l', shiftedKey: 'L', },
  'Semicolon': { key: ';', shiftedKey: ':', },
  'Quote': { key: '¢', shiftedKey: '@', capsLock: true },

  'KeyZ': { key: 'z', shiftedKey: 'Z', newRow: true, rowLeftAlign: 1.25 },
  'KeyX': { key: 'x', shiftedKey: 'X', },
  'KeyC': { key: 'c', shiftedKey: 'C', },
  'KeyV': { key: 'v', shiftedKey: 'V', },
  'KeyB': { key: 'b', shiftedKey: 'B', },
  'KeyN': { key: 'n', shiftedKey: 'N', },
  'KeyM': { key: 'm', shiftedKey: 'M', },
  'Comma': { key: ',', shiftedKey: ',', capsLock: true },
  'Period': { key: '.', shiftedKey: '.', capsLock: true },
  'Slash': { key: '/', shiftedKey: '?', cpasLock: true },
  'Backslash': { key: '⌫', shiftedKey: '⌫', smallLegend: true },
}


const TYPEWRITER_LETTER_WIDTH = 16 * .75
const TYPEWRITER_LETTER_HEIGHT = 24 * .75
const TYPEWRITER_LINE_HEIGHT = 21 * .75

let typewriterKeysPressed = []
let typewriterLastKeyPressed
let typewriterX
let typewriterY
let typewriterCursorX 
let typewriterPaperY 

let typewriterPaperAngle = 0

let typewriterTexts = []
let typewriterTextsPrev = []

let sidebarVisible = true


// let xTypewriterRepeatId
// let typewriterInRepeat = false


const tasksContents = [
  {
    title: 'Moving around and typing',
    id: 'moving-around',
    separated: true,
    contents: `
      <h1>Testing your new typewriter</h1>
      <p>
        Type one of the common phrases!
      </p>
      <div class='example'>
        Now is the time for all good men to come to the aid of the party.
        <br><br>
        The senator sits on his leather seat in the national interest.
        <br><br>
        The boy stood on the burning deck.
      </div>

      <h1>Moving around</h1>
      <p>
        Please note that most typewriters do not have arrow keys!
        You can use <span class='key'>Backspace</span> (or <span class='key'>Enter</span>)
        to go back or spacebar to go forward.
      </p>
      <p>
        In this simulator, <span class='key'>↑</span> and <span class='key'>↓</span>
        keys are the equivalent of moving the roller one notch up or down.
      </p>
      <p>
        (If you are annoyed, you can turn on an option that allows arrow keys to work normally.)
      <p>

      <h1>Grabbing paper</h1>
      <p>
        You can hold <span class='key'>⌘</span> or <span class='key'>Ctrl</span> and drag
        the paper freely with your mouse.
        Be careful, because it might be impossible to position the typewriter exactly where
        it was before!
      </p>
      <p>
        (On a normal typewriter, this is typically done by a lever, not a key.)
      </p>

      <h1>Available characters</h1>
      <p>
        Look above to see all the characters available on this typewriter. Many of them
        will be familiar, but some symbols might be new, and some in different places
        than what you’re used to.
      </p>
      <p>
        (If you are annoyed, you can turn on an option that will allow you to use all the symbols
        in places where they are on your keyboard.)
      <p>

      <h1>Shifting</h1>
      <p>
        Note how <span class='key'>Shift</span> and <span class='key'>Caps Lock</span> will
        shift every character, including digits and punctuation. This was known as “Shift Lock.”
        This is also why a comma and a period are the same whether you are shifting or not –
        helpful when you are typing in all uppercase.
      </p>
    `,
  },
  {
    title: 'Typing longer text',
    id: 'typing-longer-text',
    contents: `
      <h1>Typing longer paragraphs</h1>
      <p>
        Grab an article and try to retype it! 
      </p>
      <p>
        Whenever you hear a bell, it means you are five characters away from the margin. You
        should finish your word and move to the next line, or hyphenate.
      </p>
      
      <h1>Zooming out</h1>
      <p>
        Press the button below or <span class='key'>Esc</span> to zoom out and see the
        entire page!
      </p>

      <h1>Margin release</h1>

      <p>
        Hold <span class='key'>Alt</span> or <span class='key'>⌥</span> key to hold “margin
        release” which will allow you to type past the right margin or backspace through the left
        margin.
      </p>
      <p>
        You can press <span class='key'>F3</span> to set the left margin where your carriage is
        currently located, and likewise press <span class='key'>F4</span> to set the right 
        margin. In older typewriters, this was done with levers behind or in front of the typewriter.
        Later on, there were keys with labels like “Magic Margin” that allowed you to set it
        from the keyboard, like it’s done here.
      </p>
      <p>
        Note that if you set the margins to be too tight, you will have to use “margin release”
        to escape them and re-set them to be wider. Or you can always press 
        <span class='key'>F10</span> to go back to an empty page with default margins.
      </p>
    `,
  },  {
    title: 'Styling text',
    id: 'styling-text',
    contents: `
      <h1>
        Emphasis
      </h1>
      <p>
        The basic form of emphasis is uppercase. You can hold <span class='key'>Shift</span>
        or press <span class='key'>Caps Lock</span> on your keyboard to achieve it.
        Be careful because in typewriters, the latter behaves as “Shift Lock,” shifting also
        all the symbols.
      </p>
      <h1>
        Underlining
      </h1>
      <p>
        Styling options on a typewriter are rather limited!
      </p>
      <p>
        One common method was underlining. 
        To underline, you have to press <span class='key'>Backspace</span> to go back,
        and then <span class='key'>Shift</span>+<span class='key'>6</span> to underline.        
      </p>
      <div class='example'>
        My name is Audrey<div class='back-6'>______</div>. Hello.
      </div>
      <p>
        For best result, turn the roller down using <span class='key'>↓</span> before
        underlining. Try to do this:
      </p>
      <div class='example'>
        My name is Audrey<div class='lower back-6'>______</div>. Hello.
      </div>

      <h1>
        Ribbon
      </h1>
      <p>
        You can change the ribbon to red and back to black
        by pressing <span class='key'>F1</span>.
      </p>
      <div class='example'>
        My name is <div class='red'>Audrey</div>. Hello.
      </div>

      <h1>
        Half space
      </h1>
      <p>
        You can press <span class='key'>§</span> or <span class='key'>\`</span>
        key to insert “half space,” which can also be used for emphasis.
      </p>
      <div class='example'>
        My name is A<div class='hs'>u</div><div class='hs'>d</div><div class='hs'>r</div><div class='hs'>e</div><div class='hs'>y</div>. Hello.
      </div>

    `,
  },
  // {
  //   title: 'Common phrases',
  //   id: 'common-phrases',
  //   contents: `
  //     <p>
  //       (“typewriter”)
  //       “now is the time”
  //       left-handed and right-handed words
  //     </p>
  //   `,
  // },
  {
    title: 'Numbers',
    id: 'numbers',
    contents: `
      <p>
        Early typewriters did not have keys for zero or one, and neither does this one.
        To type in 0 (zero), you need to pres uppercase <span class='key'>O</span>.
        To type in 1 (one), you need to type in lowercase <span class='key'>L</span>.
        (You might notice the shapes of these lettersforms are aiming to be both 
        symbols at the same time!)
      </p>
      <p>
        Try to type in these numbers:
      </p>
      <div class='example'>
        444,555,OOO
        <br>
        l23,456,789
        <br>
        I loved typing since I was lO years old.
      </div>
      <h1>
        Right aligning
      </h1>
      <p>
        On a typewriter without a decimal tabulator, you had to right align by using
        spaces!
      </p>
      <div class='example'>
        444,555,OOO.5O
        <br>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;56,789.OO
        <br>
        &nbsp;43,32O,45O.OO
      </div>
      
      <h1>
        Fractions
      </h1>
      <p>
        Most typewriters came with fraction keys, used for prices of that era.
        Try to type:
      </p>
      <div class='example'>
        The price is 3½ dollars. The extended version is 5¼.
      </div>

      <h1>
        Military zero
      </h1>
      <p>
        To output a military zero, type O followed by<span class='key'>Backspace</span>
        and a slash! Or hold <span class='key'>Space</span>, and then press O,
        press /, and release the spacebar.
      </p>
      <h1>
        Missing symbols
      </h1>
      <p>
        This is not a mathematical typewriter, so it’s missing a few keys for algebra,
        like <span class='key'>+</span> or <span class='key'>=</span>. Learn how
        to print them anyway in the next section!
      </p>
    `,
  },
  {
    title: 'Combining characters',
    id: 'combining',
    contents: `
      <h1>
        Dead keys with accents
      </h1>
      <p>
        The keys <span class='key'>–</span> and <span class='key'>=</span>
        on your keyboard map to the <a target='_blank' href='https://en.wikipedia.org/wiki/Dead_key'>dead keys</a> 
        on this typewriter. Try to type them
        with and without <span class='key'>Shift</span>!
      </p>
      <p>
        Dead keys are meant to be pressed right before the relevant letter
      </p>
      <div class='example'>
        Mötley Crüe<br>
        vis-à-vis<br>
      </div>

      <h1>
        Overtyping
      </h1>
      <p>
        Of course, overtyping is available for any combination of characters on the typewriter
        since you can always backspace and type more. This was used often on typewriters
        that were missing certain symbols. These were the typical “recipes” on how to 
        assemble a new character using available keys:
      </p>
      <div class='example'>
         Exclamation point:<br>. + '
         <br><br>
         Semicolon:<br>: + ,
         <br><br>
         Dollar sign:<br>S + /
         <br><br>
         Cent sign:<br>c + /
         <br><br>
         Equal sign:<br>- above -
         <br><br>
         Plus sign:<br>' above ' on top of -
         <br><br>
         Division sign:<br>: + -
         <br><br>
         Infinity sign:<br>o + o with a half space
      </div>

      <h1>
        Overtyping tips and tricks
      </h1>
      <p>
        You can hold space to immobilize the carriage, and type all over!
        So instead of typing <span class='key'>.</span> and
        <span class='key'>Backspace</span> and <span class='key'>'</span>,
        you can type <span class='key'>Space</span> <span class='key'>.</span> 
        <span class='key'>'</span> – it’s lighter on your fingers!
      </p>
    `,
  },
  {
    title: 'Correcting mistakes',
    id: 'correcting-mistakes',
    contents: `
      <p>
        Typewriters remind us that <span class='key'>Backspace</span> is just a space
        that goes backwards – there is no erasing! In order to correct your mistakes,
        several techniques were available.
      </p>
      <h1>
        Overtyping with x
      </h1>
      <p>
        The cheapest – but least acceptable – form of correction is just typing over the
        mistake using the <span class='key'>x</span> key:
      </p>
      <div class='example' data-playback-id='correcting-1'>
        My name is Audrey<div class='back-6'>xxxxxx</div>Marcin.
      </div>
      <h1>
        Wite-Out
      </h1>
      <p>
        Another version would be to use Wite-Out or a similar liquid to paint over the mistake
        and then type over it again. This was very cumbersome and the results were good only
        for a photocopy.
      </p>
      <p>
        In this simulator, you can pretend to use Wite-Out by pressing <span class='key'>Del</span>
        or from the menu below. Pretend you made the mistake like above, and fix it using
        Wite-out!
      </p>
      <div class='example' data-playback-id='correcting-3'>
        My name is Marcin.
      </div>

      <h1>
        Correcting backspace
      </h1>
      <p>
        More advanced typewriters from the 1970s onwards had a separate “Correcting
        backspace” or “⌫” key. It activated a special lift-off ribbon
        that could remove the typed letters if you were fast enough. The order of operation was
        as followed:
      </p>
      <ul>
        <li>Let’s say you typed a wrong letter, e.g. <span class='type'>shit</span> where you meant 
        to type <span class='type'>shif</span>
        <li>After typing <span class='key'>T</span>, press the “correcting backspace” key
        (in this simulator, it’s <span class='key'>\\</span> or <span class='key'>#</span>)
        <li>This would backspace as usual, but also switch to the correcting ribbon just for the
        next keystroke
        <li>Then you would repeat the bad letter in order to lift it, e.g. <span class='key'>T</span>
        <li>And then you could type the correct letter, e.g. <span class='key'>F</span>
      </ul>
      <p>
        Try it out!
      </p>


      <h1>
        Crowding
      </h1>
      <p>
        If you made a mistake and typed in a word that was one character longer than it needed to be,
        after erasing it using Wite-Out or “correcting backspace,” you could always squeeze the
        new word in by using the “half space” key – in this simulator, it’s <span class="key">\`</span>
        or <span class="key">§</span>
      </p>
      <div class='example' data-playback-id='correcting-2'>
        My name is<span class='hs'>Marcin</span><span class='hs'>Wichary</span>.
      </div>

    `,
  },
  // {
  //   title: 'Centering and right aligning text',
  //   id: 'centering',
  //   contents: `
  //     <p>
  //       (give tasks to center text, or how to right align text)
  //       (also do spreadsheets stuff)
  //     </p>
  //   `,
  // },

  // {
  //   title: 'Drawing a soldier',
  //   id: 'soldier',
  //   separated: true,
  //   contents: `
    
  //   `,
  // },
  {
    title: 'Typewriter art and mysteries',
    id: 'drawing',
    contents: `
      <p>
        In a “<a target='_blank' href='https://en.wikipedia.org/wiki/Typewriter_mystery_game'>typewriter mystery</a>” 
        book, the recipes for printing like below would be away from the visuals,
        so you could be surprised as what you’re about to type.
      </p>
      <p>
        Here is “Valeria” from the book
        <a target='_blank' href='https://archive.org/details/FunWithTypewriter/'>Fun with your
        typewriter</a> by Madge Roemer.
        Key: <span class='type'>sp</span> = space, <span class='type'>ul</span> = underline,
        <span class='type'>bs</span> = backspace. The number after a key means how many
        times to repeat it.
      </p>
      <div class='example playback-autofill' data-playback-id='valeria'></div>
      <p>
        Here is “Sweater boy”:
      </p>
      <div class='example playback-autofill' data-playback-id='sweater-boy'></div>
      <p>
        And “Lawrence” from the same book.
      </p>
      <div class='example playback-autofill' data-playback-id='lawrence'></div>
      <h1>
        Books with tons of typewriter art
      </h1>
      <p>
        Here are some other books available to read on Internet Archive if you are 
        interested in taking this typewriter for a spin:
      </p>
    `,
  },
  {
    title: 'Concrete poetry',
    id: 'concrete-poetry',
    contents: `
      <p>
        While in most cases typewriter’s beauty is the precision of its escapement and ratcheting
        and the fact you can easily go back to the exact same space on paper, nothing prevents
        you from adjusting the paper ever so slightly – and a typewriter gives you a lever to do
        this freely.
      </p>
      <p>
        This was used creatively by <a target='_blank' href='https://en.wikipedia.org/wiki/Concrete_poetry'>Concrete poets</a>
        to do things like this:
      </p>
      <p>
        <img src='images/instructions/concrete.jpg'>
      </p>
      <p>
        You can hold <span class='key'>Ctrl</span> or <span class='key'>⌘</span> and drag
        the paper freely with your mouse.
      </p>
      <p>
        You can also press <span class='key'>F5</span> and <span class='key'>F6</span> to
        rotate paper. (Alternatively, hold <span class='key'>Shift</span> and drag the
        paper with your mouse!)
      </p>
      <p>
        Check out the <a target='_blank' href='https://archive.org/details/TypewriterArt-AlanRiddell/page/n19/mode/2up'>Typewriter Art</a>
        book on Internet Archive for inspiration!
      </p>        
    `,
  },
  {
    title: 'Options and cheats',
    id: 'cheats',
    contents: `
    <p class='cheats'>
      <label><input class='cheat-my-layout' type='checkbox'>Let me type using my keyboard’s layout</label>
      <label><input class='cheat-arrow-keys' type='checkbox'>Let me use arrow keys normally</label>
      <label><input class='cheat-caps-lock' type='checkbox'>Use <span class='key'>Caps Lock</span> instead of <span class='key'>Shift Lock</span></label>
      <label><input class='cheat-ignore-margins' type='checkbox'>Ignore margins (behave as if Margin Release was held the entire time)</label>
      <label><input class='cheat-computer-backspace' type='checkbox'>Computer Backspace that erases things (<span class='key'>Shift</span>+<span class='key'>Backspace</span>)</label>
      <label><input class='cheat-multi-color' type='checkbox'>Multi-color ribbon</label>
    </p>
    `,
  },
]

function playSound(id) {
  // return
  // console.log('play sound', id)

  if (id == 'key-down-new') {
    let random = Math.floor(Math.random() * 5) + 1
    id = `key-down-new-${random}`
  } else if (id == 'key-up-new') {
    let random = Math.floor(Math.random() * 5) + 1
    id = `key-up-new-${random}`
  } else if (id == 'key-down-non-printing') {
    let random = Math.floor(Math.random() * 5) + 1
    id = `key-down-non-printing-${random}`
  } else if (id == 'bell') {
    let random = Math.floor(Math.random() * 3) + 1
    id = `bell-${random}`
  }

  if (!sounds[id]) {
    return
  }
  // console.log(sounds[id].currentTime)
  sounds[id].currentTime = 0
  if (!sounds[id].paused) {
    sounds[id].pause()
  }
  window.setTimeout(() => {
    sounds[id].play()
  }, 0)

  // console.log()
}


function showVisualBell(text) {
  let el = document.createElement('div')
  el.classList.add('visual-bell')
  el.innerHTML = text

  document.querySelector('.visual-bell-outer').appendChild(el)

  window.setTimeout(() => {
    el.classList.add('visible')
  }, 10)

  window.setTimeout(() => {
    el.classList.add('invisible')
  }, 4000)

  window.setTimeout(() => {
    el.parentNode.removeChild(el)
  }, 5000)
}

function addWiteout() {
  typeIntoTypewriter({ key: 'Delete' })
  typeIntoTypewriterUp({ key: 'Delete' })
}

let suppressTransitionsTimerId 

function suppressTransitions() {
  window.clearTimeout(suppressTransitionsTimerId)

  document.body.classList.add('suppress-transitions')
}

function unsuppressTransitions() {
  window.clearTimeout(suppressTransitionsTimerId)

  suppressTransitionsTimerId = window.setTimeout(() => {
    document.body.classList.remove('suppress-transitions')
  }, 260)
}


function zoomOut() {
  zoomedOut = !zoomedOut

  if (zoomedOut) {
    zoomedOutRepositioned = false
  }

  suppressTransitions()

  repositionPresentation()
  //document.body.classList.toggle('zoomed-out')
  updateTypewriterAfterTyping(curSlide)
  
  unsuppressTransitions()
  
}

function ensureZoomedIn() {
  if (zoomedOut) {
    zoomOut()
    
  }
}

function showKeyboardLayoutKey(keyCode, pressed) {
  let els = document.querySelectorAll(`.typewriter-key[keyCode="${keyCode}"]`)
  els.forEach(el => el.classList.toggle('pressed', pressed))
}

function typeIntoTypewriter(event) {
  /*if (typewriterInRepeat && !event.fakeRepeat) {
    return
  }*/

  // console.log(typewriterX, typewriterCursorX)

  showKeyboardLayoutKey(event.code, true)

  ensureZoomedIn()

  typewriterLastKeyPressed = event.key

  /*
  if (typewriterLastKeyPressed == 'c' && typewriterKeysPressed['x']) {
    startTypewriterXRepeat()
    //typeIntoTypewriter(event)
    event.preventDefault()
    return
  }

  if (typewriterLastKeyPressed == '=' && typewriterKeysPressed['-']) {
    startTypewriterHyphenRepeat()
    //typeIntoTypewriter(event)
    event.preventDefault()
    return
  }*/

  if (typewriterKeysPressed[typewriterLastKeyPressed]) {
    return
  }
  typewriterKeysPressed[typewriterLastKeyPressed] = true

  curSlide.querySelector('.letters-inner').classList.remove('carriage-return')

  if (event.key == ' ' || event.key == '`' || event.key == '§') {
    playSound('key-down-non-printing')
  }

  if (event.key == 'ArrowRight') {
    if (cheatArrowKeys) {
      typewriterTexts[typewriterTexts.length - 1].text += ' '
    } else {
      showVisualBell('The <span class="key">→</span> key doesn’t exist on a typewriter! Use space instead.')
      return
    }
    playSound('key-down-non-printing')
  } else if (event.key == 'Delete') {
    console.log('wite-out')

    addNewTypewriterSection()
    typewriterTexts[typewriterTexts.length - 1].witeout = true
    typewriterTexts[typewriterTexts.length - 1].text = ' ' 

    addNewTypewriterSection()

  } else if (event.key == 'Backspace' || event.code == 'Backslash' || event.key == 'ArrowLeft') { // Backspace

    if (event.code == 'Backslash' && typewriterTexts[typewriterTexts.length - 1].color == -1) {
      return
    }

    if (event.key == 'ArrowLeft' && !cheatArrowKeys) {
      showVisualBell('The <span class="key">←</span> key doesn’t exist on a typewriter! Use <span class="key">Backspace</span> instead.')
      return
    } else {

      if (event.shiftKey) {
        if (!cheatComputerBackspace) {
          return
        } else {

          if (typewriterTexts[typewriterTexts.length - 1].text.length > 1) {

            let letter = typewriterTexts[typewriterTexts.length - 1].text[typewriterTexts[typewriterTexts.length - 1].text.length - 1]

            if (!isLetterNonprinting(letter)) {
              typewriterTexts[typewriterTexts.length - 1].text = typewriterTexts[typewriterTexts.length - 1].text.substr(0, typewriterTexts[typewriterTexts.length - 1].text.length - 1)

              var els = document.querySelectorAll('.letters .letter')
              els[els.length - 1].parentNode.removeChild(els[els.length - 1])
            } else {
              showVisualBell('Sorry, cannot erase further!')
            }
          }
        }
        // updateTypewriterText(curSlide, true)
      } else if (marginReleaseActive || cheatIgnoreMargins || typewriterCursorX > marginLeft * TYPEWRITER_LETTER_WIDTH) {
        typewriterTexts[typewriterTexts.length - 1].text += '¬'
      }
      // typewriterTexts[typewriterTexts.length - 1].text += '¡'

    }

    playSound('key-down-non-printing')
  } else if (event.key == '`' || event.key == '§') {
    // console.log('a')
    typewriterTexts[typewriterTexts.length - 1].text += '∑'  
  } else if (event.key == 'PageUp' || event.key == 'PageDown' || event.key == 'ArrowUp' || event.key == 'ArrowDown') {
    playSound('line-up-down')

    let fullHeight = false
    if (cheatArrowKeys && (event.key == 'ArrowUp' || event.key == 'ArrowDown')) {
      fullHeight = true
    }

    let goingDown = (event.key == 'PageDown') || (event.key == 'ArrowDown')

    if (!fullHeight) {
      typewriterPaperY += goingDown ? -(TYPEWRITER_LINE_HEIGHT / 3) : (TYPEWRITER_LINE_HEIGHT / 3)
    } else {
      typewriterPaperY += goingDown ? -(TYPEWRITER_LINE_HEIGHT) : (TYPEWRITER_LINE_HEIGHT)
    }

    if (!typewriterKeysPressed[' ']) {
      typewriterTexts[typewriterTexts.length - 1].text += ' '
    }
    if (!fullHeight) {
      typewriterTexts[typewriterTexts.length - 1].text += goingDown ? '∂' : 'å'
    } else {
      typewriterTexts[typewriterTexts.length - 1].text += goingDown ? '∂∂∂' : 'ååå'
    }

    curSlide.querySelector('.letters-inner-inner').style.transform = `translateY(${typewriterPaperY}px)`

    updateTypewriterAfterTyping(curSlide)
    return
  } else if (event.key == 'Enter') { // Enter

    if (typewriterCursorX == marginLeft * TYPEWRITER_LETTER_WIDTH) {
      playSound('key-down-non-printing')
    } else {
      playSound('carriage-return')
    }

    // console.log('move paper y', typewriterPaperY)
    typewriterPaperY -= TYPEWRITER_LINE_HEIGHT
    
    typewriterCursorX = marginLeft * TYPEWRITER_LETTER_WIDTH
    typewriterX = marginLeft * TYPEWRITER_LETTER_WIDTH
    
    typewriterTexts[typewriterTexts.length - 1].text += '˜'

    curSlide.querySelector('.letters-inner').classList.add('carriage-return')
    // curSlide.querySelector('.letters-inner').style.transform = `translateX(0)`
    // curSlide.querySelector('.letters-inner-inner').style.transform = `translate(${typewriterPaperY}px)`

    updateTypewriterAfterTyping(curSlide)
    return

  } else {
    // console.log('here')

    if (cheatMyLayout) {
      let letter = event.key

      if (ALLOWED_TYPEWRITER.indexOf(letter) == -1) {
        return
      }

      playSound('key-down-new')

      typewriterTexts[typewriterTexts.length - 1].text += letter
    } else {
      if (!UNDERWOOD_LETTERS[event.code]) {
        // console.log('missing', event.code)

        switch (event.code) {
          // case 'Backquote':
          case 'Digit1':
          case 'BracketRight':
          case 'Slash':
            showVisualBell('This key doesn’t exist on this typewriter!')
            break
        }

        return
      }

      // console.log('here2')

      playSound('key-down-new')

      let shift = event.shiftKey
      let capsLock = event.getModifierState && event.getModifierState('CapsLock')

      let shifted = false
      if (capsLock && cheatCapsLock && UNDERWOOD_LETTERS[event.code].capsLock) {
        shifted = shift
      } else {
        shifted = shift || capsLock
      }

      if (shifted) {
        typewriterTexts[typewriterTexts.length - 1].text += UNDERWOOD_LETTERS[event.code].shiftedKey
      } else {
        typewriterTexts[typewriterTexts.length - 1].text += UNDERWOOD_LETTERS[event.code].key
      }
    }

    if (typewriterKeysPressed[' ']) {
      typewriterTexts[typewriterTexts.length - 1].text += '¬'
    }

    if (!marginReleaseActive && !cheatIgnoreMargins && 
        (typewriterX >= marginRight * TYPEWRITER_LETTER_WIDTH && typewriterX < (marginRight + 1) * TYPEWRITER_LETTER_WIDTH)) {
      typewriterTexts[typewriterTexts.length - 1].text += '¬'
      // typewriterX += TYPEWRITER_LETTER_WIDTH
    } 
      
  }

  if (event.key != 'Backspace' && event.code != 'Backslash' && event.key != ' ' && 
      event.key != 'Delete' &&
      event.key != 'ArrowLeft' && event.key != '`' && event.key != '§' && event.key != 'ArrowRight') {
    curSlide.classList.add('typebar-up')
  }
  updateTypewriterText(curSlide)
}

let previousX = 0
let previousY = 0
let previousBkX = 0
let previousBkY = 0

function updateTypewriterLettersPositionsAndAngles(el, x, y, angle) {
  if (zoomedOut) {
    return
  }

  // console.log('update', x)


  el.querySelector('.letters-inner').style.transform = `translateX(${-x}px)`
  el.querySelector('.letters-inner-inner').style.transform = `translateY(${y}px)`

  document.querySelector('.paper').style.transform = `rotateZ(${angle}rad)`

  let deltaX = x - previousX
  let deltaY = y - previousY
  let deltaAngle = Math.atan2(deltaY, deltaX)
  let distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)

  let plusX = distance * Math.cos(angle + deltaAngle)
  let plusY = distance * Math.sin(angle + deltaAngle)
  let paperNX = previousBkX + plusX
  let paperNY = previousBkY + plusY

  document.querySelector('.paper').style.backgroundPosition = `${-paperNX * lettersScale}px ${paperNY * lettersScale}px`

  previousX = x
  previousY = y
  previousBkX = paperNX
  previousBkY = paperNY


  const els = el.querySelectorAll('.letters-inner-inner > *')

  els.forEach((el, i) => {
    let localAngle = parseFloat(el.getAttribute('data-angle'))
    el.style.transform = `rotateZ(${angle - localAngle}rad)`
  })

  if (!bellFiredOnThisLine && typewriterCursorX >= (marginRight - 5) * TYPEWRITER_LETTER_WIDTH) {
    bellFiredOnThisLine = true
    playSound('bell')
    // showVisualBell('Bell')
    // typewriterTexts[typewriterTexts.length - 1].text += '¬'
  } else if (bellFiredOnThisLine && typewriterCursorX < (marginRight - 5) * TYPEWRITER_LETTER_WIDTH) {
    bellFiredOnThisLine = false
    // showVisualBell('Rewound')
  }
}

function updateTypewriterAfterTyping(el) {
  if (el) {
    el.classList.remove('typebar-up')

    updateTypewriterLettersPositionsAndAngles(el, typewriterCursorX, typewriterPaperY, typewriterPaperAngle)
  }
}

function typeIntoTypewriterUp(event) {
  showKeyboardLayoutKey(event.code, false)

  let letter = event.key

  // alt space on a mac
  if (letter.charCodeAt(0) == 160) {
    letter = ' '
  }

  if (typewriterKeysPressed[letter]) {
    playSound('key-up-new')
    typewriterKeysPressed[letter] = false
  }

  if (typewriterTexts[typewriterTexts.length - 1].color == -1) {
    // reset to normal ribbon
    addNewTypewriterSection()
  }

  if (event.code == 'Backslash') {
    temporaryCorrectingRibbon = true

    addNewTypewriterSection()
    typewriterTexts[typewriterTexts.length - 1].color = -1
  }

  if (letter == ' ') {
    // console.log('yeah', marginReleaseActive)
    if (!marginReleaseActive && !cheatIgnoreMargins && 
      (typewriterX >= marginRight * TYPEWRITER_LETTER_WIDTH && typewriterX < (marginRight + 1) * TYPEWRITER_LETTER_WIDTH)) {
      //typewriterTexts[typewriterTexts.length - 1].text += '¬'
      // typewriterX += TYPEWRITER_LETTER_WIDTH
      // nothing
    } else {
      typewriterTexts[typewriterTexts.length - 1].text += ' '
    }

    updateTypewriterText(curSlide)
  }

  updateTypewriterAfterTyping(curSlide)
}



function loadState() {
  let state = JSON.parse(window.localStorage['typewriter-state'] || '{}');

  if (state.typewriterTexts !== undefined && state.paperState !== undefined) {
    typewriterTexts = state.typewriterTexts;
    typewriterTextsPrev = JSON.parse(JSON.stringify(state.typewriterTexts));
    document.querySelector('.letters-inner-inner').innerHTML = state.paperState;
  } else {
    typewriterTexts.push(getNewTypewriterTextSection());
    typewriterTextsPrev.push(getNewTypewriterTextSection());
  }

  if (state.typewriterCursorX !== undefined) {
    typewriterCursorX = state.typewriterCursorX;
  }

  if (state.typewriterPaperY !== undefined) {
    typewriterPaperY = state.typewriterPaperY;
  }

  if (state.typewriterPaperAngle !== undefined) {
    typewriterPaperAngle = state.typewriterPaperAngle;
  }

  if (state.sidebarVisible !== undefined) {
    sidebarVisible = state.sidebarVisible;
  }

  if (state.moreOptionsVisible !== undefined) {
    moreOptionsVisible = state.moreOptionsVisible;
  }

  if (state.sidebarPage !== undefined) {
    sidebarPage = state.sidebarPage;
  }

  if (state.cheatMyLayout !== undefined) {
    cheatMyLayout = state.cheatMyLayout;
  }

  if (state.cheatArrowKeys !== undefined) {
    cheatArrowKeys = state.cheatArrowKeys;
  }

  if (state.cheatCapsLock !== undefined) {
    cheatCapsLock = state.cheatCapsLock;
  }

  if (state.cheatIgnoreMargins !== undefined) {
    cheatIgnoreMargins = state.cheatIgnoreMargins;
  }

  if (state.cheatComputerBackspace !== undefined) {
    cheatComputerBackspace = state.cheatComputerBackspace;
  }

  if (state.cheatMulticolor !== undefined) {
    cheatMulticolor = state.cheatMulticolor;
  }

  if (state.marginLeft !== undefined) {
    marginLeft = state.marginLeft;
  }

  if (state.marginRight !== undefined) {
    marginRight = state.marginRight;
  }

  updateTypewriterText(curSlide, false);
  fillSidebar();
  updateUI();
  updateCheatsUI();

  window.setTimeout(() => {
    updateTypewriterAfterTyping(curSlide);
  }, 60);
}


function saveStateNow() {
  // console.log('save state')

  const state = {
    typewriterTexts,
    paperState: document.querySelector('.letters-inner-inner').innerHTML,
    typewriterCursorX,
    typewriterPaperY,
    typewriterPaperAngle,
    sidebarVisible,
    moreOptionsVisible,
    sidebarPage,
    cheatMyLayout,
    cheatArrowKeys,
    cheatCapsLock,
    cheatIgnoreMargins,
    cheatComputerBackspace,
    cheatMulticolor,
    marginLeft,
    marginRight,
  }

  window.localStorage['typewriter-state'] = JSON.stringify(state)
  // console.log(JSON.stringify(state))
}


function saveState() {
  window.clearTimeout(saveStateTimer)

  saveStateTimer = window.setTimeout(saveStateNow, 200)
}



function getLetterElement(letterObject) {
  let el = document.createElement('div')
  el.classList.add('letter')
  el.setAttribute('data-letter', letterObject.letter)
  if (letterObject.color == -1) {
    el.setAttribute('data-color', 'correcting')
  } else 
  if (letterObject.color > 1) {
    el.setAttribute('data-color', letterObject.color)
  }
  if (letterObject.witeout) {
    el.setAttribute('data-witeout', 'true')
  }
  // el.style.transform = `translate3D(${letterObject.x}px, ${letterObject.y}px, ${0/*letterObject.z * 180*/}px)`
  let transform

  if (letterObject.witeout) {
    console.log('a')
    transform = `translate(${letterObject.x + letterObject.cx * .5 - .25}px, ${letterObject.y + letterObject.cy * .5 - 2.25}px)`
    transform += ` rotateZ(${Math.random() * 40 - 20}deg)`
  } else {
    transform = `translate(${letterObject.x + letterObject.cx * .5 - .25}px, ${letterObject.y + letterObject.cy * .5 - .25}px)`
  }

  el.style.transform = transform
  el.innerHTML = letterObject.letter

  return el
}

function isLetterNonprinting(letter) {
  return letter == '∂' || letter == '¬' || letter == 'å' ||
      letter == 'ƒ' || letter == '∫' || letter == '®' ||
      letter == '˜' || letter == '∑' || letter == ''
}

function updateTypewriterText(slideEl, startFromScratch) {
  typewriterX = 0
  typewriterY = 0

  let temporaryEl = document.createElement('div')


  // startFromScratch = true
  // console.log(typewriterTexts, typewriterTextsPrev)

  if (startFromScratch) {
    slideEl.querySelector('.letters-inner-inner').innerHTML = 
      `<div class="paper-header"><div class="paper-header-inside"></div>
      </div>`
      
      // <div class="photo-young"></div>
      // <div class="photo-pile-old"></div>
      // <div class="photo-pile-new"></div>
      // <div class="photo-wall-stickies"></div>
      // <div class="photo-sticky"></div>
      
    slideEl.querySelector('.paper-header').setAttribute('data-angle', typewriterPaperAngle)

    // slideEl.querySelector('.photo-young').setAttribute('data-angle', typewriterPaperAngle)
    // slideEl.querySelector('.photo-pile-old').setAttribute('data-angle', typewriterPaperAngle)
    // slideEl.querySelector('.photo-pile-new').setAttribute('data-angle', typewriterPaperAngle)

  }

  const childEls = slideEl.querySelectorAll('.letters-inner-inner > .letter-group')
  // console.log('chidlEls', childEls.length)

  for (var typewriterTextNo = 0; typewriterTextNo < typewriterTexts.length; typewriterTextNo++) {
  // for (var typewriterTextNo in typewriterTexts) {
    let newChildEl = false
    let childEl 
    let removed = false

    // console.log(childEls)

    if (childEls[typewriterTextNo] && !removed) {
      newChildEl = false
      childEl = childEls[typewriterTextNo]
    } else {
      // if (typewriterTexts[typewriterTextNo].text) {
        // console.log('new', typewriterTexts)
        newChildEl = true
        childEl = document.createElement('div')
        childEl.classList.add('letter-group')
        childEl.setAttribute('data-angle', typewriterTexts[typewriterTextNo].typewriterPaperAngle)
      // }
    }

    if (typewriterTextNo == typewriterTexts.length - 1) {
      if (!newChildEl) {
        if (childEl && childEl.innerHTML == '') {
          childEl.setAttribute('data-angle', typewriterTexts[typewriterTextNo].typewriterPaperAngle)
        }
      }
    }
    

    let typewriterText = typewriterTexts[typewriterTextNo].text

    typewriterX = typewriterTexts[typewriterTextNo].typewriterX
    typewriterY = typewriterTexts[typewriterTextNo].typewriterY
    let witeout = typewriterTexts[typewriterTextNo].witeout
    let color = typewriterTexts[typewriterTextNo].color

    let noop
    // start from -1 because first letter could be enter etc.
    for (var i = -1; i < typewriterText.length; i++) {
      noop = false

      let letter = (i == -1) ? '' : typewriterText[i]
      let nextLetter = typewriterText[i + 1]

      if (isLetterNonprinting(letter)) {
        noop = true
      }

      if (!noop) {
        if (startFromScratch || (!typewriterTextsPrev[typewriterTextNo] || 
            !typewriterTextsPrev[typewriterTextNo].text || (i >= typewriterTextsPrev[typewriterTextNo].text.length))) {
          const letterObject = {
            letter,
            x: typewriterX,
            y: /*y +*/ typewriterY + TYPEWRITER_LINE_HEIGHT - 5,
            cx: Math.random(),
            cy: Math.random(),
            // z,
            color,
            witeout,
          }
          childEl.appendChild(getLetterElement(letterObject))
        }
      }
      
      switch (letter) {
        case '´':
        case '¸':
        case '`':
        case '¨':
        case '~':
          // dead keys
          typewriterX -= TYPEWRITER_LETTER_WIDTH
          break
        case '∑': // Alt W, half space
          typewriterX += TYPEWRITER_LETTER_WIDTH / 2
          break
      }

      // correcting = dead
      if (color == -1 && i > -1) {
        typewriterX -= TYPEWRITER_LETTER_WIDTH
      }

      switch (nextLetter) {
        case '˜': // Alt N, return
          typewriterX = marginLeft * TYPEWRITER_LETTER_WIDTH
          typewriterY += TYPEWRITER_LINE_HEIGHT
          break
        case '¬': // Alt L, backspace
          if (noop) {
            typewriterX -= TYPEWRITER_LETTER_WIDTH
          }
          // z++
          break
        case '∂': // Alt D, down one third
          typewriterY += TYPEWRITER_LINE_HEIGHT / 3
          break
        case 'å': // Alt A, up one third
          typewriterY -= TYPEWRITER_LINE_HEIGHT / 3
          break
    
        default:
          if (!noop) {
            typewriterX += TYPEWRITER_LETTER_WIDTH
          }
          break
      }
    }

    if (newChildEl) {
      // if (childEl.innerHTML != '') {
        temporaryEl.appendChild(childEl)
      // }
    }
  }

  typewriterCursorX = typewriterX
  // typewriterCursorY = 20


  
  let tempX
  // let tempY
  switch (typewriterLastKeyPressed) {
    case 'Backspace':
    case '\\':
    case '#':
      tempX = typewriterCursorX - 4 * .75
      break
    case ' ':
      tempX = typewriterCursorX// - 16
      break
    case '`':
    case '§':
      tempX = typewriterCursorX// - 16
      break
    default:
      tempX = typewriterCursorX - 16 * .75
      if (typewriterKeysPressed[' ']) {
        tempX += 16
      }
      break
  }

  if (slideEl) {
    updateTypewriterLettersPositionsAndAngles(slideEl, tempX, typewriterPaperY, typewriterPaperAngle)
    // slideEl.querySelector('.cursor').style.transform = `translate(0, ${tempY}px)`
  }

  window.setTimeout(function() {
    slideEl.querySelector('.letters-inner-inner').innerHTML += temporaryEl.innerHTML
  }, 50)

  typewriterTextsPrev = JSON.parse(JSON.stringify(typewriterTexts))

  saveState()
}



function updateUI() {
  document.body.setAttribute('data-sidebar-visible', sidebarVisible)

  document.querySelector('aside .options').classList.toggle('more-options-visible', moreOptionsVisible)

  repositionPresentation()
}



function toggleSidebar() {
  if (zoomedOut) {
    zoomOut()
  }

  sidebarVisible = !sidebarVisible
  updateUI()
  saveState()
}


function onKeyUp(event) {
  switch (event.code) {
    case 'AltLeft':
    case 'AltRight':
      showKeyboardLayoutKey('temp-margin-release', false)
      marginReleaseActive = false
      playSound('key-down-non-printing')
      break

    case 'ShiftLeft':
    case 'ShiftRight':
    case 'CapsLock':
      playSound('key-down-non-printing')
      break

    case 'MetaLeft':
    case 'ControlLeft':
    case 'MetaRight':
    case 'ControlRight':
      break

    default:
      if (!event.metaKey && !event.ctrlKey) {
        typeIntoTypewriterUp(event)
        event.preventDefault()
        return
      }
      break
  }
}

function clearPageValues() {
  typewriterX = 0
  typewriterY = 100
  typewriterCursorX = 0
  typewriterPaperY = -typewriterY
  typewriterPaperAngle = 0
  
  typewriterTexts = []
  typewriterTextsPrev = []

  marginLeft = 0
  marginRight = 70

  typewriterTexts.push(getNewTypewriterTextSection())
}

function clearPage() {
  showVisualBell('Page cleared!')
  ensureZoomedIn()

  clearPageValues()

  updateTypewriterText(curSlide, true)
  updateTypewriterAfterTyping(curSlide)

  saveStateNow()
}

const colors = ['Black', 'Red', 'Green', 'Blue', 'Yellow']

function changeRibbon(event) {
  if (cheatMulticolor) {
    if (event.shiftKey) {
      currentColor--
      if (currentColor == 0) {
        currentColor = 5
      }
    } else {
      currentColor++

      if (currentColor == 6) {
        currentColor = 1
      }
    }

    showVisualBell(`Ribbon changed to ${colors[currentColor - 1]}`)
  } else {
    if (currentColor == 1) {
      currentColor = 2
    } else {
      currentColor = 1
    }
  }

  playSound('key-down-non-printing')

  addNewTypewriterSection()
  typewriterTexts[typewriterTexts.length - 1].color = currentColor
}

function rotatePaper(angleAdjustment) {
  ensureZoomedIn()

  let x = typewriterCursorX
  let y = typewriterPaperY - 10

  typewriterPaperAngle -= angleAdjustment

  let distance = Math.sqrt(x * x + y * y)
  let oldAngle2 = Math.atan2(y, x)

  const deltaX = -distance * Math.cos(oldAngle2) + distance * Math.cos(oldAngle2 + angleAdjustment)
  const deltaY = distance * Math.sin(oldAngle2) - distance * Math.sin(oldAngle2 + angleAdjustment)

  typewriterCursorX += deltaX
  typewriterX += (deltaX)

  typewriterPaperY -= deltaY
  typewriterY -= (-deltaY)

  suppressTransitions()

  addNewTypewriterSection()
  updateTypewriterText(curSlide)
  updateTypewriterAfterTyping(curSlide)

  unsuppressTransitions()
}

function setMargin(right) {
  if (right) {

    marginRight = Math.round(typewriterX / TYPEWRITER_LETTER_WIDTH)

    showVisualBell('Right margin set to current position')
  } else {

    marginLeft = Math.round(typewriterX / TYPEWRITER_LETTER_WIDTH)

    showVisualBell('Left margin set to current position')
  }

  saveState()
}

function rotateLeft() {
  ensureZoomedIn()
  rotatePaper(0.05)
}

function rotateRight() {
  ensureZoomedIn()
  rotatePaper(-0.05)
}

function onKeyDown(event) {
  console.warn('key down', event)


  //console.warn(event.code)
  switch (event.code) {

    case 'Delete':
      typeIntoTypewriter(event)
      event.preventDefault()
      break

    case 'Tab':
      toggleSidebar()
      event.preventDefault()
      break

    case 'ShiftLeft':
    case 'ShiftRight':
    case 'CapsLock':
      playSound('key-down-non-printing')
      break

    case 'AltLeft':
    case 'AltRight':
      showKeyboardLayoutKey('temp-margin-release', true)
      marginReleaseActive = true
      playSound('key-down-non-printing')
      break

    case 'MetaLeft':
    case 'ControlLeft':
    case 'ShiftLeft':
    case 'AltLeft':
    case 'MetaRight':
    case 'ControlRight':
    case 'ShiftRight':
    case 'AltRight':
      //console.warn('!!!')
      break

    case 'F5':
      rotateLeft()
      event.preventDefault()
      break

    case 'F6':
      rotateRight()
      event.preventDefault()
      break
  
    case 'F3':
      setMargin(false)
      event.preventDefault()
      break

    case 'F4':
      setMargin(true)
      event.preventDefault()
      break
  
    case 'Escape':
      if (mysteryCurrentlyTyping) {
        cancelPlayback()
        event.preventDefault()
        return
      }

      if (!event.repeat) {
        zoomOut()
      }
      event.preventDefault()
      break
  
    case 'F10':
      clearPage()
      event.preventDefault()
      break

    case 'F1':
      changeRibbon(event)
      event.preventDefault()
      break

    default:
      if (!event.metaKey && !event.ctrlKey) {
        typeIntoTypewriter(event)
        event.preventDefault()
      }
      return
  }
}

function onMouseMove(event) {
  if (cmdHeld) {

    let x = event.pageX
    let y = event.pageY

    let deltaX = (x - mouseDragLastX) / (outputScale * lettersScale)
    let deltaY = (y - mouseDragLastY) / (outputScale * lettersScale)

    if (deltaX || deltaY) {

      if (!mouseDragModeRotation) {

        typewriterCursorX -= (deltaX)
        typewriterPaperY += (deltaY)
        typewriterX -= (deltaX)
        typewriterY -= (deltaY)

        addNewTypewriterSection()
        updateTypewriterText(curSlide)
        updateTypewriterAfterTyping(curSlide)
      } else {
        rotatePaper((-deltaX - deltaY) / 50)
      }
    }


    mouseDragLastX = x
    mouseDragLastY = y
  }
}

function onMouseDown(event) {
  if (event.ctrlKey || event.metaKey || event.shiftKey) {

    mouseDragModeRotation = event.shiftKey

    document.body.classList.add('dragging-paper')
    cmdHeld = true

    mouseDragStartX = event.pageX
    mouseDragStartY = event.pageY
    mouseDragLastX = event.pageX
    mouseDragLastY = event.pageY

    event.preventDefault()
    event.stopPropagation()
  }
}

function onMouseUp(event) {
  if (cmdHeld) {
    // console.log('. UP')
    document.body.classList.remove('dragging-paper')

    let x = event.pageX
    let y = event.pageY

    let deltaX = x - mouseDragStartX
    let deltaY = y - mouseDragStartY
  }
  cmdHeld = false

  saveState()
}


function getGlobalBoundingBox() {
  let left = 9999999999999
  let right = -9999999999999
  let top = 9999999999999
  let bottom = -9999999999999


  let els = document.querySelectorAll('.letters .letter, .letters .paper-header-inside')
  // let els = document.querySelectorAll('.letters .letter')

  els.forEach((el) => {
    const br = el.getBoundingClientRect()

    if (br.left < left) {
      left = br.left
    }
    if (br.top < top) {
      top = br.top
    }
    if (br.right > right) {
      right = br.right
    }
    if (br.bottom > bottom) {
      bottom = br.bottom
    }
  })

  return { left, top, right, bottom }
}


let zoomedOutRepositioned = false



function repositionPresentation() {
  if (zoomedOut && zoomedOutRepositioned) {
    return
  }
  
  let width = window.innerWidth
  let height = window.innerHeight

  if (sidebarVisible) {
    width -= sidebarWidth
  }

  let ratio = width / height
  
  
  if (ratio > 1.5) {
    ratio = 1.5
  }

  let desiredWidth = 1920
  let desiredHeight = desiredWidth / ratio

  let left = sidebarVisible ? sidebarWidth : 0

  outputScale = width / desiredWidth

  document.querySelector('.presentation').style.left = `${left}px`

  document.querySelector('.presentation').style.width = `${width / outputScale}px`

  document.querySelector('.presentation').style.height = `${desiredHeight}px`

  let zoomedOutScale = zoomedOut ? .3333 : 1;

  if (zoomedOut) {
    document.body.classList.add('zoomed-out')

    document.querySelector('.letters-inner').style.transform = ``
    document.querySelector('.letters-inner-inner').style.transform = ``
    document.querySelector('.presentation').style.transform = `scale(1)`
    document.querySelector('.presentation').style.width = `${width}px`
    document.querySelector('.presentation').style.height = `${height}px`

    let bb = getGlobalBoundingBox()

    let canvasLeft = sidebarVisible ? sidebarWidth : 0

    let canvasWidth = window.innerWidth - canvasLeft - 50
    let canvasHeight = window.innerHeight - 100

    const globalScale1 = (canvasWidth / (bb.right - bb.left))
    const globalScale2 = (canvasHeight / (bb.bottom - bb.top))
    let globalScale = Math.min(globalScale1, globalScale2)

    document.querySelector('.letters').style.transform = 
        `translate(0, 0) scale(${lettersScale * globalScale})`

    let bb2 = getGlobalBoundingBox()

    let x = -bb2.left + canvasLeft + 25 + (canvasWidth - (bb2.right - bb2.left)) / 2
    let y = -bb2.top + 50 + (canvasHeight - (bb2.bottom - bb2.top)) / 2

    document.querySelector('.letters').style.transform = 
        `translate(${x}px, ${y}px) scale(${lettersScale * globalScale})`

    let bb3 = getGlobalBoundingBox()
/*
    let el = document.createElement('div')
    el.style.zIndex = 99999999
    el.style.position = 'absolute'
    el.style.outline = '1px solid red'
    el.style.left = `${bb3.left}px`
    el.style.top = `${bb3.top}px`
    el.style.width = `${bb3.right - bb3.left}px`
    el.style.height = `${bb3.bottom - bb3.top}px`
    document.body.appendChild(el)*/

    toSaveBoundingBox = bb3
    // console.log(bb3)

    zoomedOutRepositioned = true


  } else {
    document.body.classList.remove('zoomed-out')

    document.querySelector('.letters').style.transform = `translate(0, -50px) scale(${lettersScale * zoomedOutScale})`

    document.querySelector('.paper').style.backgroundSize = `${2334 / 4 * lettersScale * .75 * zoomedOutScale}px ${3501 / 4 * lettersScale * .75 * zoomedOutScale}px`

    document.querySelector('.presentation').style.transform = `scale(${outputScale})`
  }


}

function addNewTypewriterSection() {
  if (typewriterTexts[typewriterTexts.length - 1].text == '') {
    typewriterTexts.pop()
  }

  typewriterTexts.push(getNewTypewriterTextSection())
}

function getNewTypewriterTextSection() {
  return {
    color: currentColor,
    text: '',
    typewriterX,
    typewriterY: -typewriterPaperY,
    typewriterPaperAngle,
  }
}


function onBodyLoad() {
  if (document.fonts) {
    document.fonts.load('10px "Bohemian"').then(function() { })
  }
}



function changeSidebarPage(id) {
  sidebarPage = id
  fillSidebar()

  document.querySelector('aside .page').scrollTo(0, 0)
}


function fillSidebar() {

  switch (sidebarPage) {
    case 'main':
      document.querySelector('aside .page').innerHTML = `
        <h3>
          Welcome to the Retro typewriter simulator!
        </h3>
        <ul class='tasks'>
        </ul>
      `

      tasksContents.forEach(task => {
        const el = document.createElement('li')
        el.innerHTML = task.title
        if (task.separated) {
          el.classList.add('separated')
        }

        document.querySelector('aside .tasks').appendChild(el)

        el.addEventListener('click', () => { changeSidebarPage(task.id) })
      })
      break
    default:
      let task = tasksContents.find(el => el.id == sidebarPage)
      document.querySelector('aside .page').innerHTML = `
        <h3>${task.title}</h3>
        <button class='go-back'>← Go back</button>
        ${task.contents}
        <button class='go-back'>← Go back</button>
      `
      document.querySelectorAll('aside .go-back').forEach((el) => { el.addEventListener('click', () => { changeSidebarPage('main') })})
      break
  }


  let els = document.querySelectorAll('aside [data-playback-id]')
  els.forEach((el) => {
    if (el.classList.contains('playback-autofill')) {
      el.innerHTML = '<p>' + typewriterPlaybackData[el.getAttribute('data-playback-id')].trim(/\n/).replace(/\n/g, '</p><p>') + '</p>'
    }

    const buttonEl = document.createElement('button')
    buttonEl.innerHTML = el.classList.contains('playback-autofill') ? 'Type this in for me' : 'Show me'
    el.appendChild(buttonEl)

    buttonEl.addEventListener('click', () => {
      startPlayback(el.getAttribute('data-playback-id'))
    })
  })

  if (document.querySelector('.cheat-my-layout')) {
    updateCheatsUI()
    document.querySelector('.cheat-my-layout').addEventListener('change', readCheats)
    document.querySelector('.cheat-arrow-keys').addEventListener('change', readCheats)
    document.querySelector('.cheat-caps-lock').addEventListener('change', readCheats)
    document.querySelector('.cheat-ignore-margins').addEventListener('change', readCheats)
    document.querySelector('.cheat-computer-backspace').addEventListener('change', readCheats)
    document.querySelector('.cheat-multi-color').addEventListener('change', readCheats)
  }

}

function updateCheatsUI() {
  if (document.querySelector('.cheat-my-layout')) {
    document.querySelector('.cheat-my-layout').checked = cheatMyLayout
    document.querySelector('.cheat-arrow-keys').checked = cheatArrowKeys
    document.querySelector('.cheat-caps-lock').checked = cheatCapsLock
    document.querySelector('.cheat-ignore-margins').checked = cheatIgnoreMargins
    document.querySelector('.cheat-computer-backspace').checked = cheatComputerBackspace
    document.querySelector('.cheat-multi-color').checked = cheatMulticolor
  }
}

function readCheats() {
  if (document.querySelector('.cheat-my-layout')) {
    cheatMyLayout = document.querySelector('.cheat-my-layout').checked
    cheatArrowKeys = document.querySelector('.cheat-arrow-keys').checked
    cheatCapsLock = document.querySelector('.cheat-caps-lock').checked
    cheatIgnoreMargins = document.querySelector('.cheat-ignore-margins').checked
    cheatComputerBackspace = document.querySelector('.cheat-computer-backspace').checked
    cheatMulticolor = document.querySelector('.cheat-multi-color').checked

    saveState()
  }
}

function fillKeyboardLayout() {
  const els = document.querySelectorAll('.keyboard-layout')

  let rowEl

  els.forEach((el) => {


    Object.keys(UNDERWOOD_LETTERS).forEach((keyCode) => {

      const key = UNDERWOOD_LETTERS[keyCode]

      if (key.newRow) {
        rowEl = document.createElement('div')
        rowEl.classList.add('row')
        el.appendChild(rowEl)

        rowEl.style.marginLeft = `${key.rowLeftAlign * 1.2}em`
      }
      
      const keyEl = document.createElement('div')
      keyEl.classList.add('typewriter-key')
      if (key.smallLegend) {
        keyEl.classList.add('small-legend')
      }
      keyEl.setAttribute('keyCode', keyCode)
      if (key.key == key.shiftedKey || key.key.toUpperCase() == key.shiftedKey) {
        keyEl.innerHTML = `${key.shiftedKey}`
      } else {
        keyEl.innerHTML = `${key.shiftedKey}<br>${key.key}`
      }
      rowEl.appendChild(keyEl)

      keyEl.addEventListener('pointerdown', onLayoutKeyMouseDown)
      keyEl.addEventListener('pointerout', onLayoutKeyMouseOut)
      keyEl.addEventListener('pointerup', onLayoutKeyMouseUp)
    })
  })
}

function onLayoutKeyMouseDown(event) {
  let code = event.target.getAttribute('keyCode')
  let keyObject = UNDERWOOD_LETTERS[code]
  console.log('down', code, keyObject)

  let key = keyObject.key
  if (key == 'HS') {
    key = '`'
  } else if (key == 'BK') {
    key = 'Backspace'
  } else if (key == 'MR') {
    return
  }

  if (keyObject) {
    typeIntoTypewriter({ 
      key: key, 
      code: code,
      shiftKey: event.shiftKey
    })
  }
}

function onLayoutKeyMouseOut(event) {
  let code = event.target.getAttribute('keyCode')
  let keyObject = UNDERWOOD_LETTERS[code]

  let key = keyObject.key
  if (key == 'HS') {
    key = '`'
  } else if (key == 'BK') {
    key = 'Backspace'
  } else if (key == 'MR') {
    return
  }

  if (!typewriterKeysPressed[key]) {
    return
  }

  if (keyObject) {
    typeIntoTypewriterUp({ 
      key: key, 
      code: code,
      shiftKey: keyObject.shiftedKey
    })
  }


  console.log('out', code)  

}
function onLayoutKeyMouseUp(event) {
  let code = event.target.getAttribute('keyCode')
  let keyObject = UNDERWOOD_LETTERS[code]

  let key = keyObject.key
  if (key == 'HS') {
    key = '`'
  } else if (key == 'BK') {
    key = 'Backspace'
  } else if (key == 'MR') {
    return
  }

  if (!typewriterKeysPressed[key]) {
    return
  }


  if (keyObject) {
    typeIntoTypewriterUp({ 
      key: key, 
      code: code,
      shiftKey: keyObject.shiftedKey
    })
  }

  console.log('up', code)
}




function initSounds() {
  const click = 'asset/mixkit-hard-typewriter-click-1119.wav';
  const carriage = 'asset/typewriter-carriage-return-103750.mp3';

  sounds['key-down-new-1'] = new Audio(click);
  sounds['key-down-new-2'] = new Audio(click);
  sounds['key-down-new-3'] = new Audio(click);
  sounds['key-down-new-4'] = new Audio(click);
  sounds['key-down-new-5'] = new Audio(click);
  
  sounds['key-up-new-1'] = new Audio(click);
  sounds['key-up-new-2'] = new Audio(click);
  sounds['key-up-new-3'] = new Audio(click);
  sounds['key-up-new-4'] = new Audio(click);
  sounds['key-up-new-5'] = new Audio(click);

  sounds['key-down-non-printing-1'] = new Audio(click);
  sounds['key-down-non-printing-2'] = new Audio(click);
  sounds['key-down-non-printing-3'] = new Audio(click);
  sounds['key-down-non-printing-4'] = new Audio(click);
  sounds['key-down-non-printing-5'] = new Audio(click);

  sounds['carriage-return'] = new Audio(carriage);
  sounds['bell-1'] = new Audio(click);
  sounds['bell-2'] = new Audio(click);
  sounds['bell-3'] = new Audio(click);
  sounds['line-up-down'] = new Audio(click);
}

function save() {
  let zoomedOutChanged = false

  if (!zoomedOut) {
    zoomOut()

    zoomedOutChanged = true
  }

  let left = sidebarVisible ? sidebarWidth : 0

  html2canvas(document.querySelector(".typewriter"), { 
    width: toSaveBoundingBox.right - toSaveBoundingBox.left + 50,
    height: toSaveBoundingBox.bottom - toSaveBoundingBox.top + 50,
    x: toSaveBoundingBox.left - left - 25,
    y: toSaveBoundingBox.top - 25,
  }).then(canvas => {
    // document.body.appendChild(canvas)
    // canvas.style.position = 'fixed'
    // canvas.style.zIndex = 100000

    // let dataURL = canvas.toDataURL('image/png')
    // location.replace(dataURL)
    
    let link = document.createElement('a')
    // link.setAttribute('download', 'example.png')
    // location.replace(canvas.toDataURL("image/png"))
    link.href = canvas.toDataURL("image/png")
    link.download = 'typewriter.png'
    link.click()
    link.delete

    if (zoomedOutChanged) {
      zoomOut()
    }
  })
}

function onWindowResize() {
  if (zoomedOut) {
    ensureZoomedIn()
    updateTypewriterAfterTyping(curSlide)
  }
  repositionPresentation()
}

function toggleMoreOptions() {
  moreOptionsVisible = !moreOptionsVisible
  updateUI()
  saveState()
}

const WARNING_MOBILE = 0
const WARNING_SAFARI = 1

function addWarning(warning, large) {
  const el = document.createElement('div')
  el.classList.add('warning')
  if (large) {
    el.classList.add('large')
  }

  switch (warning) {
    case WARNING_SAFARI:
      el.innerHTML = 'This doesn’t work well in Safari yet. I’m so sorry! I ran out of time, but I will try to fix it soon. In the meantime, please use Chrome or Firefox.<br><br><button class="anyway">I want to try anyway</button>'
      break
    case WARNING_MOBILE:
      el.innerHTML = 'Please visit this on a laptop! This is not an experience that might ever work well on mobile, although I am thinking about it.<br><br><button class="anyway">I want to try anyway</button>'
      break
  }

  document.body.appendChild(el)  

  el.querySelector('.anyway').addEventListener('click', () => {
    document.querySelector('.warning').parentNode.removeChild(document.querySelector('.warning'))
  })
}

function main() {
  if (isIOS() || isIpadOS() || isAndroid() || getResponsiveWidthType() == RESPONSIVE_WIDTH_1023) {
    addWarning(WARNING_MOBILE ,true)
  } else if (navigator.userAgent.indexOf('Safari/') != -1 && 
     navigator.userAgent.indexOf('KHTML,') != -1 &&
     navigator.userAgent.indexOf('Chrome/') == -1) {
    addWarning(WARNING_SAFARI)
  }

  repositionPresentation()
  window.setTimeout(repositionPresentation, 200) // Dammit, Safari
  window.setTimeout(repositionPresentation, 1000) // Dammit, Safari

  fillSidebar()
  

  curSlide = document.querySelector('.slide-typewriter')
  // prepareTypewriterSlide(curSlide)

  clearPageValues()
  updateTypewriterText(curSlide, true)
  updateTypewriterAfterTyping(curSlide)
  loadState()

  initSounds()

  fillKeyboardLayout()

  document.body.addEventListener('keydown', onKeyDown)
  document.body.addEventListener('keyup', onKeyUp)
  window.addEventListener('mousemove', onMouseMove)
  document.body.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  document.querySelector('aside .options .show-hide-more').addEventListener('click', toggleMoreOptions)
  document.querySelector('.reveal-sidebar button').addEventListener('click', toggleSidebar)
  document.querySelector('.button-ribbon').addEventListener('click', changeRibbon)
  document.querySelector('.button-clear-page').addEventListener('click', clearPage)
  document.querySelector('.button-sidebar').addEventListener('click', toggleSidebar)
  document.querySelector('.button-witeout').addEventListener('click', addWiteout)
  document.querySelector('.button-zoom-out').addEventListener('click', zoomOut)
  document.querySelector('.button-rotate-left').addEventListener('click', rotateLeft)
  document.querySelector('.button-rotate-right').addEventListener('click', rotateRight)
  document.querySelector('.button-left-margin').addEventListener('click', () => { setMargin(false) })
  document.querySelector('.button-right-margin').addEventListener('click', () => { setMargin(true) })
  window.addEventListener('resize', onWindowResize)
  repositionPresentation()
}
