function shuffle(A) {
    A = A.slice(0);
    for(var i = A.length - 1; i >= 0; i = i-1) {
        var j = Math.floor(Math.random()*(i+1));
        var t = A[i];
        A[i] = A[j];
        A[j] = t;
    }
    return A;
}

var BrailleDotsToLetter = {
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

var LetterToBrailleDots = {};
    for(var dots in BrailleDotsToLetter) {
        LetterToBrailleDots[BrailleDotsToLetter[dots]] = dots;
    }

function spell(word) {
    return word.split('').join(', ').toUpperCase();
}

function silence(duration) {
    var r = '';
    var t = 0;
    while (t < duration) {
        t += 0.25;
        r += ' " " ';
    }
    return r;
}

dojo.declare('iLGame', [ ], {
	masterVolume: 1.0,
	speechVolume: 1.0,
	soundVolume: 1.0,
	playingSound: false,
	
    constructor: function(game) {
        var self = this;
        self.game = game;
        document.title = game.name;
        
        uow.ui.connectKeys();
    
        // configure the Braille display
        
        var tds = dojo.query('#dots td');
        // mapping from Braille dots to table cells
        self.dmap = { 1: tds[0],
                      2: tds[2],
                      3: tds[4],
                      4: tds[1],
                      5: tds[3],
                      6: tds[5] };
        self.tds = tds;

        uow.getAudio({ defaultCaching: true }).then(function(a) {
            self.audio = a;
			
			dojo.subscribe('/org/hark/prefs/response', self, self.prefsCallback);
            dojo.publish('/org/hark/prefs/request');
			
			// configure the preview channel
            //self.audio.setProperty({ channel: 'preview', name: 'volume', value: 0.4, immediate: true });
            self.audio.setProperty({ channel: 'preview', name: 'pitch', value: 0.4, immediate: true });
            self.audio.setProperty({name : 'voice', value : 'default+f1', channel : 'preview'});
            
            dojo.subscribe('message', self, 'message');
            dojo.subscribe('dots', self, 'display');
            dojo.subscribe('letter', self, 'newLetter');
			
            self.newGame();
        });
    },
	
	prefsCallback: function(prefs, which)
	{
		var self = this;
		
		self.masterVolume=prefs.volume;
		self.speechVolume=prefs.speechVolume;
		self.soundVolume=prefs.soundVolume;
		
		self.audio.setProperty({name: 'volume', value: this.masterVolume*(this.playingSound ? this.soundVolume : this.speechVolume), immediate: true});
		self.audio.setProperty({name: 'volume', channel: 'preview', value: this.masterVolume*this.speechVolume, immediate: true});
		
		//Set speech rate of channels
		self.audio.setProperty({name: 'rate', value: prefs.speechRate, immediate: true});
		self.audio.setProperty({name: 'rate', channel: 'preview', value: prefs.speechRate, immediate: true});
	},
    
    newGame: function() {
        var self = this;
        self.say("Welcome to " + self.game.name + "!");
        self.say(self.game.intro).callAfter(function() {
            self.words = shuffle(self.game.words);
            console.log(self.words);
            self.newWord();
        });
    },
    
    newWord: function() {
        var self = this;
        self.waitingForLetter = false;
        self.word = self.words.pop();
        // handle empty case
        if (self.word.image) {
            self.show(self.word.image);
        }
        self.letter = self.word[0];
        if (self.word.sound) {
            self.play(self.word.sound).anyAfter(dojo.hitch(self, function(){
				self.playingSound=false;console.log(self.playingSound);
				self.audio.setProperty({name: 'volume', value: self.masterVolume*self.speechVolume, immediate: true});
			}));
        }
		
		self.say(self.word.intro).callAfter(function() {
			self.waitingForLetter = true;
		});
    },
    
    newLetter: function(l) {
        var self = this;
        console.log('letter', l);
        if (!self.waitingForLetter) {
            return;
        }
        if (self.word.word[0].toUpperCase() == l.toUpperCase()) {
            self.reward(l);
        } else {
            self.instruct(l);
        }
    },
    
    reward: function(l) {
        var self = this;
        self.waitingForLetter = false;
        console.log('reward', l);
        this.mute = true;
        var txt = 'You made the letter, ' + l + '. ';
        txt += silence(1.0);
        txt += spell(self.word.word) + ' spells ' + self.word.word + '. ';
        txt += silence(1.0);
        self.say(txt).callAfter(function(){
			self.say(self.word.success + silence(2.0)).callAfter(function() {
				self.newWord();
		})});
    },
    
    instruct: function(l) {
        var self = this;
        self.waitingForLetter = false;
        var txt = 'You made the letter, ' + l + '.  ';
        txt += silence(0.5);
        var misp = l + self.word.word.slice(1);
        var goal = self.word.word[0].toUpperCase();
        var dots = LetterToBrailleDots[goal];
        if (dots.length > 1) {
            dots = 'dots ' + dots.slice(0,-1).split('').join(', ') + ' and ' + dots[dots.length-1];
        } else {
            dots = 'dot ' + dots;
        }
        txt += 'That would make, ' + spell(misp) + silence(1.0) + misp + '.  ';
        txt += silence(1.0);
        txt += self.word.word + ', begins with the letter, ' + goal + '.  ';
        txt += silence(1.0);
        txt += 'Make the letter, ' + goal + ', by pressing ' + dots + '. ';
        self.say(txt).callAfter(function() {
            self.waitingForLetter = true;
        });
    },
    
    show: function(url) {
        var self = this;
        if (!url) {
            dojo.style('pic', { backgroundImage: '' });
        } else {
            dojo.style('pic', { 
                backgroundImage: 'url(' + self.word.image + ')', 
                //backgroundSize: 'contain',
                //backgroundRepeat: 'no-repeat',
                //backgroundPosition: 'center' });
            });
        }
    },
    
    silence: function(duration) {
        var self = this;
        var t = 0;
        var r = null;
        while (t < duration) {
            t += 0.5;
            r = self.say('" "');
        }
        return r;
    },
    
    message: function(txt, channel, after) {
        var self = this;
        if (self.waitingForLetter) {
            d = this.say(txt, channel);
            if (after) {
                d.callAfter(after);
            }
        } else if (after) {
            after();
        }
    },
    
    say: function(txt, channel) {
        if (!channel) {
            channel = 'default';
        }
        //console.log('say:  channel: '+channel+', text: '+txt);
		this.audio.setProperty({name: 'volume', channel: channel, value: this.masterVolume*this.speechVolume});
        return this.audio.say({ text: txt, channel: channel });
    },
    
    play: function(snd) {
		this.playingSound=true;console.log(this.playingSound);
		this.audio.setProperty({name: 'volume', value: this.masterVolume*this.soundVolume});
        return this.audio.play({ url: snd });
    }, 
    
    display: function(dots) {
        //console.log('display', dots, this.tds);
        this.tds.removeClass('dot');
        dojo.forEach(dots, function(d) {
            dojo.addClass(this.dmap[d], 'dot');
            console.log('add class', this.dmap[d]);
        }, this);
    }
});

dojo.ready(function() {
    console.log('game', game);
    var g = new iLGame(game);
    var b = new BrailleKB();
    var p = new BraillePad();
});

