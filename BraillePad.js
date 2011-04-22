dojo.ready(function() {
    var s = new io.Socket('localhost', {port: 8008, rememberTransport: false});

    s.connect();

    var map = {
        2: 0,
        12: 1,
        1: 2,
        15: 3,
        13: 5,
        0: 6,
        14: 7,
        3: 8 };

    s.on('connect', function() {
        console.log('connected');
    })
    s.on('message', function(e) {
        //console.log(e.event, e.button);
        b = map[e.button];
        if (e.event == 'down') {
            dojo.style(dojo.query('td')[b], 'backgroundColor', 'red');
        } else if(e.event == 'up') {
            dojo.style(dojo.query('td')[b], 'backgroundColor', 'yellow');
        }
    });
});
