(function () {

    var Container = function () {
        var me = this, definitions = {}, instances = {};

        me.add = function (name, definition) {
            var instanceContructorIndex = definition.length - 1;
            definitions[name] = {
                fn: definition[instanceContructorIndex],
                dependencies: definition.slice(0, instanceContructorIndex),
                name: name
            };
        };

        me.run = function () {
            var name, definition;
            for (name in definitions) {
                definition = definitions[name];
                createInstance(definition);
            }
        };

        function createInstance(definition) {
            var instance = Object.create(definition.fn.prototype);
            definition.fn.apply(instance, resolveDependencies(definition));
            instances[definition.name] = instance;
            return instance;
        }

        function resolveDependencies(definition) {
            var currentDeps = [], requiredDependiencies = definition.dependencies || [],
                    length = requiredDependiencies.length, x = 0, dependience, instance;
            for (; x < length; x += 1) {
                dependience = requiredDependiencies[x];
                if (isInstanceExists(dependience)) {
                    currentDeps.push(instances[dependience]);
                } else {
                    instance = createInstance(definitions[dependience]);
                    currentDeps.push(instance);
                }
            }
            return currentDeps;
        }

        function isInstanceExists(name) {
            return typeof instances[name] !== 'undefined';
        }

    };

    module.exports = new Container();

})(module);