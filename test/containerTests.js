var assert = require('assert');

var container = require('../src/Container');

describe('#cdi container test', function () {
    it('should resolve simple class dependencies ', function () {

        container.add('test', ['test2', function (test2) {
                assert.equal(typeof test2 !== 'undefined', true);
            }
        ]);

        container.add('test2', ['test3', function (test3) {
                assert.equal(typeof test3 !== 'undefined', true);
                assert.equal(test3.id, 2);
            }
        ]);

        container.add('test3', [function () {
                this.id = 2;
            }
        ]);

        container.run();

    });


    it('should resolve dependiencies with custome order ', function () {

        container.add('test', ['test2', function (test2) {
                assert.equal(typeof test2 !== 'undefined', true);
            }
        ]);
        container.add('test3', [function () {
                this.id = 2;
            }
        ]);

        container.add('test2', ['test3', function (test3) {
                assert.equal(typeof test3 !== 'undefined', true);
                assert.equal(test3.id, 2);
            }
        ]);


        container.run();

    });

    it('should create each instance only once', function () {
        var createdInstanceCounter = 0;

        container.add('test', ['test2', function (test2) {
                createdInstanceCounter += 1;
            }
        ]);
        container.add('test3', [function () {
                createdInstanceCounter += 1;
            }
        ]);

        container.add('test2', ['test3', function (test3) {
                createdInstanceCounter += 1;
            }
        ]);


        container.run();

        assert.equal(createdInstanceCounter, 3);

    });

});