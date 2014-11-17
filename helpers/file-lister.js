var es = require('event-stream');

module.exports = function lister(name) {
    
    var isFirst = true;

    return es.through(
        function firstPass(file) {
            
            if (isFirst && name) {
                console.log(name);
                console.log('-----');
            }
            
            isFirst = false;
               var relPath = file.path.substring(file.base.length);
            
            console.log(relPath);
            this.emit('data', file);

         

        },
        function secondPass() {
            console.log('-----\n');
            this.emit('end');
            
        });

}