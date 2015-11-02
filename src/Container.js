(function (module) {
    
    var Container = function () {
        var me = this, definitions = {}, instances = {};
        
        me.add = function (name, definition) {
            var instanceConstructorIndex = definition.length - 1;
            definitions[name] = {
                fn: definition[instanceConstructorIndex],
                dependencies: definition.slice(0, instanceConstructorIndex),
                name: name
            };
        };
        
        me.get = function (name) {
            return instances[name];
        };
        
        me.run = function () {
            var name, definition;
            for (name in definitions) {
                definition = definitions[name];
                createInstance(definition);
            }
        };
        
        function createInstance(definition) {
            var temporary, instance = Object.create(definition.fn.prototype);
            temporary = definition.fn.apply(instance, resolveDependencies(definition));
            instance = typeof temporary !== 'undefined' ? temporary : instance;
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