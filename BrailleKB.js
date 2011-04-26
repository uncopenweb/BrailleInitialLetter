dojo.provide('BrailleKB');
dojo.require('dojo.parser');

var Braille = {
    '1':     'A',
    '12':    'B',
    '14':    'C',
    '145':   'D',
    '15':    'E',
    '124':   'F',
    '1245':  'G',
    '125':   'H',
    '24':    'I',
    '245':   'J',
    '13':    'K',
    '123':   'L',
    '134':   'M',
    '1345':  'N',
    '135':   'O',
    '1234':  'P',
    '12345': 'Q',
    '1235':  'R',
    '234':   'S',
    '2345':  'T',
    '136':   'U',
    '1236':  'V',
    '2456':  'W',
    '1346':  'X',
    '13456': 'Y',
    '1356':  'Z'
};
function dotsToLetter(dots) {
    var key = dots.join('');
    var letter = Braille[key];
    return letter;
}

var keyNames = { 188: ',', 190: '.', 191: '/' };

function keyName(keyCode) {
    if (keyNames[keyCode]) {
        return keyNames[keyCode];
    }
    for (var keyName in dojo.keys) {
        if (dojo.keys[keyName] == keyCode) {
            //console.log('returning', keyName, keyCode);
            return keyName;
        }
    }
    return String.fromCharCode(keyCode);
}

dojo.declare('BrailleKB', null, {
    constructor: function() {
        dojo.subscribe('/uow/key/down', this, 'keyDown');
        dojo.subscribe('/uow/key/up', this, 'keyUp');

        // default mapping from key codes to Braille dots (can be changed with setup keys)
        this.kmap = { 83:  3, // S
                      68:  2, // D
                      70:  1, // F
                      74:  4, // J
                      75:  5, // K
                      76:  6 }; // L

        // finite state machine transition table, maps state and input to new state or action
        this.state_table = {
            idle: {
                down: { state: 'p1' }
            },
            p1: {
                timer: { state: 'p2' }
            },
            p2: {
                down: { state: 'p1' },
                up: { state: 'p1' },
                timer: { action: 'preview' }
            },
            preview: {
                down: { state: 'p1' },
                up: { state: 'r1' }
            },
            r1: {
                down: { state: 'p1' },
                timer: { state: 'r2' }
            },
            r2: {
                down: { state: 'p1' },
                up: { state: 'r1' },
                timer: { action: 'write' }
            },
            setup: {
                down: { state: 'setup' },
                up: { state: 'setup' },
                timer: { state: 'setup1' }
            },
            setup1: {
                down: { state: 'setup' },
                up: { state: 'setup' },
                timer: { action: 'isFull' }
            },
            clearing: {
                up: { action: 'isClear' },
                down: { state: 'setup' }
            }
        };
        this.state = 'idle';
        this.dots = [ ];
        this.current_letter = '';

        setInterval(dojo.hitch(this, 'onTimer'), 200);
    },

    fsm: function(input) {
        var entry = this.state_table[this.state][input];
        if (!entry) {
            return;
        }
        if (entry.state) {
            this.state = entry.state;
        }
        if (entry.action == 'preview') {
            if (this.dots.length > 0) {
                this.state = 'preview';
                this.preview();
            } else {
                this.state = 'idle';
            }
        } else if (entry.action == 'write') {
            if (this.dots.length === 0) {
                this.state = 'idle';
                this.write();
            } else {
                this.state = 'preview';
                this.preview();
            }
        } else if (entry.action == 'isFull') {
            if (this.dots.length == 6) { // holding 6 down
                this.state = 'clearing';
                this.message('Keys noted, now release them all.');
            }
        } else if (entry.action == 'isClear') {
            if (this.dots.length === 0) { // all released
                this.state = 'idle';
                this.message();
            }
        }
    },

    preview: function() {
        var letter = dotsToLetter(this.dots);
        if (letter) {
            console.log('preview', letter);
            this.message(letter, 'preview');
        }
        this.current_letter = letter;
    },

    write: function() {
        if (this.current_letter) {
            console.log('write', this.current_letter);
            dojo.publish('letter', [ this.current_letter ]);
            console.log('published');
        }
    },

    startSetup: function() {
        this.kmap = {};
        this.state = 'setup';
        this.message('Press and hold dots 1 through 6 in order.');
    },

    keyDown: function(evt) {
        //console.log('down', evt);
        var dot = this.kmap[evt.keyCode];
        if (! dot && this.state.match(/setup/) ) {
            dot = (this.dots.length + 1) + '';
            this.kmap[evt.keyCode] = dot;
        }
        if (dot && dojo.indexOf(this.dots, dot) == -1) {
            console.log('down', evt, dot, this.dots);
            this.dots.push(dot);
            this.dots.sort();
            this.display();
            this.fsm('down');
        }
    },

    keyUp: function(evt) {
        //console.log('up', evt);
        var dot = this.kmap[evt.keyCode];
        if (dot && dojo.indexOf(this.dots, dot) > -1) {
            //console.log('up', evt, dot, this.dots);
            this.dots = dojo.filter(this.dots, function(d) { return d != dot; });
            this.display();
            this.fsm('up');
            if (this.state.match(/setup/)) {
                delete this.kmap[evt.keyCode];
            }
        }
    },

    onTimer: function() {
        this.fsm('timer');
    },

    display: function() {
        console.log('display', this.dots);
        dojo.publish('dots', [this.dots]);
    },
    
    displayKeyMap: function() {
        //console.log('displayKeyMap', keyNames);
        var dots = [ ];
        for (var kc in this.kmap) {
            dots[this.kmap[kc]] = keyName(kc);
        }
        //console.log('dots', dots);
        var kmsg = [ ];
        for (var i = 1; i <= 6; i++) {
            this.dmap[i].innerHTML = dots[i];
            kmsg.push(dots[i] + "&rarr;Dot " + i);
        }
        //console.log(kmsg);
        dojo.byId('keymap').innerHTML = kmsg.join(', ');
    },
    
    message: function(text, channel) {
        console.log('message', text, channel);
        dojo.publish('message', [text, channel]);
    }
});

