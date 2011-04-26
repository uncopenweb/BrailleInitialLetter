dojo.declare('BraillePad', null, {
    constructor: function() {
        var self = this;
        var s = new io.Socket('localhost', {port: 8008, rememberTransport: false});
        s.connect();
        s.on('connect', function() {
            console.log('connected');
            self.message('pad connected');
        });
        s.on('message', function(e) {
            if (e.event == 'down') {
                self.padDown(e);
            } else if(e.event == 'up') {
                self.padUp(e);
            }
        });

        // default mapping from pad buttons to Braille dots (can be changed with setup pad)
        this.kmap = { 0:  3, // LL
                      15: 2, // ML
                      2:  1, // UL
                      1:  4, // UR
                      13: 5, // MR
                      3:  6 }; // LR

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
            holding: {
                down: { state: 'p1' },
                up: { state: 'p1' },
                timer: { action: 'holding' }
            },
            releasing: {
                up: { action: 'isClear' },
                timer: { action: 'isClear' }
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
        this.timing = true; // false to disable the timer while speaking
        setInterval(dojo.hitch(this, 'onTimer'), 100);
    },

    fsm: function(input) {
        var entry = this.state_table[this.state][input];
        console.log('fsm', input, this.state);
        if (!entry) {
            return;
        }
        if (entry.state) {
            this.state = entry.state;
        }
        if (entry.action == 'preview') {
            if (this.dots.length > 0) {
                this.state = 'holding';
                this.holdCount = 0;
                this.preview();
            } else {
                this.state = 'idle';
            }
        } else if (entry.action == 'holding') {
            this.holdCount += 1;
            if (this.holdCount > 10) {
                this.state = 'releasing';
                this.write();
            }
        } else if (entry.action == 'isFull') {
            if (this.dots.length == 6) { // holding 6 down
                this.state = 'clearing';
                this.message('Keys noted, now release them all.');
            }
        } else if (entry.action == 'isClear') {
            if (this.dots.length === 0) { // all released
                this.state = 'idle';
                //this.message();
            }
        }
    },

    preview: function() {
        var letter = dotsToLetter(this.dots);
        var msg = '';
        if (this.dots.length == 1) {
            msg = 'dot ' + this.dots;
        } else {
            msg = 'dots ' + this.dots.join(' ');
        }
        if (letter) {
            msg = msg + '. Makes ' + letter + '.';
            console.log('preview', letter);
        }
        this.timing = false;
        this.message(msg, 'preview', dojo.hitch(this, function() {
            this.timing = true; }));
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

    padDown: function(evt) {
        //console.log('down', evt);
        var dot = this.kmap[evt.button];
        if (! dot && this.state.match(/setup/) ) {
            dot = (this.dots.length + 1) + '';
            this.kmap[evt.button] = dot;
        }
        if (dot && dojo.indexOf(this.dots, dot) == -1) {
            console.log('down', evt, dot, this.dots);
            this.dots.push(dot);
            this.dots.sort();
            this.display();
            this.fsm('down');
        }
    },

    padUp: function(evt) {
        //console.log('up', evt);
        var dot = this.kmap[evt.button];
        if (dot && dojo.indexOf(this.dots, dot) > -1) {
            //console.log('up', evt, dot, this.dots);
            this.dots = dojo.filter(this.dots, function(d) { return d != dot; });
            this.display();
            this.fsm('up');
            if (this.state.match(/setup/)) {
                delete this.kmap[evt.button];
            }
        }
    },

    onTimer: function() {
        if (this.timing) {
            this.fsm('timer');
        }
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
    
    message: function(text, channel, after) {
        console.log('message', text, channel);
        dojo.publish('message', [text, channel, after]);
    }
});

