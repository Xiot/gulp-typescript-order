var es = require('event-stream');
var toposort = require('toposort');
var gutil = require('gulp-util');
var ts = require('typescript-services');

module.exports = function typescriptSort(debug) {
    
    var classes = {};
    var references = [];
    var files = [];
    
    function parse(text) {
        
        var re = /class\s+(\w+)\s*(extends\s+([a-z0-9-.]+)\s*)?[{|$]/ig
        var match = null;
        
        var found = [];
                        
        while ((match = re.exec(text)) != null) {
            
            found.push({
                className: match[1],
                baseClassName: match[3],
                module: /module\s+([a-z0-9-]+)/i.exec(text)[1]
            });
        }
        
        var angRe = /\.(controller|service|factory|provider|directive)\([^,]+?,\s*([^)]+)\)/g;
        while ((match = angRe.exec(text)) != null) {
            
            found.push({
                baseClassName: match[2]
            });
        }

        return found;
    }
    
  //  console.log();

    return es.through(
        function firstPass(file) {
            
            var found = parse(file.contents.toString());
            
            var relPath = file.path.substring(file.base.length);
            file.relPath = relPath;

            for (var i = 0; i < found.length; i++) {
                var classDef = found[i];
                
                //console.log(classDef.className + ' -> ' + classDef.baseClassName);
                
                classDef.relPath = relPath;
                classDef.path = file.path;
                classDef.file = file;
                
                if (classDef.className) {
                    var fullClassName = classDef.module + '.' + classDef.className;                    
                    classes[fullClassName] = classDef;
                    
                } else {
                    references.push(classDef)
                }                
            }
            
            //console.log(file.relPath);
            files.push(file);
        //this.emit('data', file);
        },
        function secondPass() {
            
            //console.log();

            var toSort = [];
            
            for (var key in classes) {
                var def = classes[key];
                
                if (!def.baseClassName) {
                    //toSort.push([def.file, null]);
                    continue;
                }
                //    continue;
                
                var depModule = classes[def.baseClassName] ||
                classes[def.module + '.' + def.baseClassName];
                
                if (!depModule)
                    continue;
                
                if(debug)
                    console.log(def.file.relPath + ' -> ' + depModule.file.relPath);

                toSort.push([def.file, depModule.file]);
            
            }
            //console.log();
            
            for (var i = 0; i < references.length; i++) {
                var def = references[i];
                
                //if (debug) console.log('ref: ' + def.baseClassName);
                var depClass = classes[def.baseClassName];
                if (depClass) {
                    //if (debug) console.log('  :' + depClass.file.relPath);
                    toSort.push([def.file, depClass.file]);

                    if (debug)
                        console.log(def.file.relPath + ' :> ' + depClass.file.relPath);
                }
            }
            
            if (debug) console.log();

            var self = this;
            toposort.array(files, toSort)
            .reverse()
            .forEach(function (file, g) {
                    self.emit('data', file);
            //        console.log(g);
                    if(debug)
                    console.log(file.relPath);
                });
            
            this.emit('end');
        });

}