(function (module) {

    var Container = function () {
        var me = this, definitions = {}, instances = {};

        me.add = function (name, definition) {
            createDefinition(name, definition);
        };

        me.producer = function (name, definitionArray) {
            createDefinition(name, definitionArray);
            definitions[name].isProducer = true;
        };

        me.constant = function (name, object) {
            instances[name] = object;
        };

        me.get = function (name) {
            var definition = definitions[name];
            if (typeof definition === 'undefined') {
                return  instances[name];
            }
            if (isProducer(definition)) {
                return createInstanceFromProducer(definition);
            }
            return instances[name];
        };

        me.run = function () {
            var name, definition;
            for (name in definitions) {
                definition = definitions[name];
                createInstance(definition);
            }
        };

        function createDefinition(name, definition) {
            var instanceConstructorIndex = definition.length - 1;
            definitions[name] = {
                fn: definition[instanceConstructorIndex],
                dependencies: definition.slice(0, instanceConstructorIndex),
                name: name
            };
        }

        function createInstance(definition) {
            if (isProducer(definition)) {
                return createInstanceFromProducer(definition);
            }
            return createServiceInstance(definition);
        }

        function isProducer(definition) {
            return definition.isProducer === true;
        }

        function createInstanceFromProducer(definition) {
            return definition.fn.apply(definition, resolveDependencies(definition));
        }

        function createServiceInstance(definition) {
            var name = definition.name, temporary, instance;
            if (isInstanceExists(name)) {
                return instances[name];
            }
            instance = Object.create(definition.fn.prototype);
            temporary = definition.fn.apply(instance, resolveDependencies(definition));
            instance = typeof temporary !== 'undefined' ? temporary : instance;
            instances[name] = instance;
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

    module.exports = Container;

})(module);