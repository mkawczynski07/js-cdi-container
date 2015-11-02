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

        container.add('test4', ['test3', 'test', 'test2', function (test3) {
                createdInstanceCounter += 1;
            }
        ]);

        container.run();

        assert.equal(createdInstanceCounter, 4);

    });

    it('should create returned instance', function () {

        container.add('test', [function () {
                this.b = 2;
                return  {b: 1};
            }
        ]);

        container.run();

        assert.equal(container.get('test').b, 1);

    });

    it('should create new instance on each call', function () {

        var producedInstances = 0;

        container.add('test', [function () {
                this.b = 2;
            }
        ]);

        container.producer('producer', ['test', function (test) {
                return function () {
                    producedInstances += 1;
                    return {a: test.b};
                };
            }
        ]);

        container.add('test2', ['producer', function (producer) {
                assert.equal(producer().a, 2);
            }
        ]);

        container.add('test3', ['producer', function (producer) {
                assert.equal(producer().a, 2);
            }
        ]);

        container.run();

        assert.equal(producedInstances, 2);
        assert.equal(container.get('producer')().a, 2);
        assert.equal(producedInstances, 3);

    });

});