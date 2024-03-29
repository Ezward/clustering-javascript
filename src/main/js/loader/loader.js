/**
 * A 'fake' requirejs implementation.
 * The scripts must be loaded in script tags,
 * at which time the module is remembered.
 * subsequent require() calls will use the loaded
 * modules.
 * 
 * NOTE: You MUST load this script before any 
 *       modules using define() and require()!!!
 * 
 * This is done because, for educational purposes,
 * I want readers of this page to be able to
 * 'view source' and see all the scripts and 
 * load them.  
 * 
 * At the same time, I wanted to organize the
 * files using requirejs modules so they can 
 * be used in either a browser or node.  So
 * I hacked up this solution.
 * 
 * Basically, ignore this crap, it is just
 * plumbing for my very narrow use case.
 */
var com = com || {};
com.lumpofcode = com.lumpofcode || {};
com.lumpofcode.loader = function() {
    const modules = {};     // map of require path to module constructor
    const bindings = {};    // map of require path to constructed (bound) modules
    const bindingStack = [];// stack used to resolve relative paths during binding

    /**
     * @private
     * Get the most recently loaded script tag.
     * This uses the hack that the browser loads
     * scripts in order, provided they are not 'async'
     * 
     * @return  the last script tag.
     */
    function lastScript() {
        const scripts = document.getElementsByTagName("script");
        const script = scripts[scripts.length-1];
        return script;
    }

    /**
     * @private
     * Determine if a string start with a given substring.
     * @param {string} s 
     * @param {string} t 
     * @return true if s begins with t, false otherwise
     */
    function startsWith(s, t) {
        if((typeof s === 'string') && (typeof t === 'string')) {
            return 0 === s.lastIndexOf(t, 0);
        }
        throw TypeError("matchStartCount: received non-string argument.");
    }

    /**
     * @private
     * count the number of matching characters at
     * the start of two strings.
     * 
     * @param {string} p 
     * @param {string} q 
     * @return the matching count.
     */
    function matchAtStartCount(p, q) {
        if((typeof p === 'string') && (typeof q === 'string')) {
            const n = Math.min(p.length, q.length);
            let i = 0;
            while((i < n) && p[i] == q[i]) {
                i += 1;
            }
            return i;
        }
        throw TypeError("matchStartCount: received non-string argument.");
    }

    /**
     * @private
     * return the span of characters that match
     * at the start of two strings.
     * 
     * @param {string} p 
     * @param {string} q 
     * @return the matching characters.
     */
    function matchAtStart(p, q) {
        if((typeof p === 'string') && (typeof q === 'string')) {
            return p.substring(0, matchAtStartCount(p, q));
        }
        throw TypeError("matchStart: received non-string argument.");
    }

    /**
     * @private
     * Replace substring at start of a string.
     * 
     * @param {string} s the string
     * @param {string} t the substring to replace
     * @param {string} r the replacement
     * @return if the string starts with the substring, 
     *         then a new string with substring replaced by the replacement
     *         otherwise the original string.
     */
    function replaceAtStart(s, t, r) {
        if((typeof s === 'string') && (typeof t === 'string') && (typeof r === 'string')) {
            return startsWith(s, t) ? s.replace(t, r) : s;
        }
        throw TypeError("replaceAtStart: received non-string argument.");
    }

    /**
     * @private
     * Replace substring at end of a string.
     * 
     * @param {string} s the string
     * @param {string} t the substring to replace
     * @param {string} r the replacement
     * @return if the string ends with the substring, 
     *         then a new string with substring replaced by the replacement
     *         otherwise the original string.
     */
    function replaceAtEnd(s, t, r) {
        if((typeof s === 'string') && (typeof t === 'string') && (typeof r === 'string')) {
            if (s.endsWith(t)) {
                return s.substring(0, s.length - t.length) + r;
            }
            return s;
        }
    }


    /**
     * @private
     * get the project path by sniffing
     * the path to the html page, 
     * which we assume to be in 
     * the root of the project.
     * 
     * @return {string} full path to root of project
     */
    function getProjectRootPath() {
        //
        // - both the script src path and 
        //   the owning page's URI are
        //   fully qualified paths.
        //
        const script = lastScript();
        const scriptPath = script.src;
        const doc = script.ownerDocument;
        const docPath = doc.baseURI;

        //
        // - so find what those two paths
        //   have in common at their starts
        //   and that will be the path
        //   to the project folder.
        //
        const projectRoot = matchAtStart(docPath, scriptPath);
        return projectRoot;
    }
    const projectRoot = getProjectRootPath();
    const moduleRoot = lastScript().attributes['data-root'].value;

    /**
     * @public
     * This is called when the module script is 
     * loaded in the script tag and the define() call
     * is made.
     * 
     * It uses a trick in the browser to find the path
     * of the most recent script tag, which is uses
     * as the module path.
     */
    function load(module) {
        //
        // get most recently loaded script tag (that will the module's script)
        // so we can get the src path from it.
        //
        let path = replaceAtStart(lastScript().src, projectRoot, "");

        //
        // remove the root from the path and treat
        // require(path) calls like the working
        // directory is the root.
        //
        if(typeof moduleRoot === 'string') {
            path = replaceAtStart(path, moduleRoot, "");    // remove module root
            path = replaceAtEnd(path, ".js", "");           // remove extension
        }

        if(typeof modules[path] !== 'undefined') {
            throw Error("module at path(" + path + ") is already loaded." );
        }
        modules[path] = module;
    }

    /**
     * require paths are relative to the module calling them,
     * so use the binding stack to resolve the full require path
     * 
     * @param {string} path relative path to module being required
     */
    function resolveRequirePath(path) {
        if(path.startsWith("/")) {
            return path;    // it's an abolute path from module root
        }
        if(!path.startsWith(".")) {
            return "/lib/" + path;    // it's an absolute path from library root
        }

        //
        // split require path into component folder names;
        // this may include relative folders (. or ..)
        //
        pathParts = path.split("/");

        //
        // the require path is relative the module that is loading it (that depends upon,
        // so get the dependant module's path from the binding stack,
        // and use it to build the full module bind path
        //
        const dependantPath = (bindingStack.length > 0) ? bindingStack[0] : "";
        const dependandParts = dependantPath.split("/");    // make it an array
        dependandParts.pop();       // remove the dependant module name to get current director

        //
        // process any relative path parts as start of path
        //
        while((pathParts.length != 0) && ((pathParts[0] === ".") || (pathParts[0] === ".."))) {
            if(pathParts[0] === "..") {
                dependandParts.pop();      // back up in relative path
            }    
            pathParts.shift();  // remove .. or .
        }


        const modulePath =  dependandParts.join("/") + "/" + pathParts.join("/");
        return modulePath;
    }

    /**
     * Call the modules constructor to get an instance of the module.
     * The results in recursive calls to required dependencies, so
     * they can load their dependencies.
     * 
     * @param {string} path relative path to module being required
     */
    function bind(paths, andThen) {

        //
        // bind a single path
        //
        function bindOne(path) {
            path = resolveRequirePath(path);
    
            if(typeof modules[path] === 'undefined') {
                throw Error("module at path(" + path + ") is not loaded." );
            }
    
            if(typeof bindings[path] === 'undefined') {
                // 
                // push the module being bound into the binding stack 
                // so we can handle recursive calls to bind.
                //
                bindingStack.unshift(path);
                
                //
                // Bind the module (resolve it's requirements and add it to the stack).
                // This function (bind) is passed as the 'require' function to
                // the module being bound.
                // This results in recursive calls to this bind function; each
                // required dependency calls the passed 'require' function to
                // get it's bound dependencies.
                //
                bindings[path] = modules[path](bind); 

                bindingStack.shift();       // pop module, we are done binding it
            }
        
            return bindings[path];
        }

        //
        // if passed an array, then we are in async mode.
        // resolve each binding, then call the callback
        // passing the bindings as the arguments
        //
        if(Array.isArray(paths)) {
            // async mode, array of paths
            const bindings = [];

            for(let i = 0; i < paths.length; i += 1) {
                bindings.push(bindOne(paths[i]));
            }

            if(andThen) {
                // send bound modules as arguments to callback
                andThen.apply(this, bindings);
            }

        } else {
            // synchonous mode, one path
            return bindOne(paths);
        }
    
    }

    return {'load': load, 'bind': bind};
}();

//
// set the global define and require methods
// to use our loader
//
const define = com.lumpofcode.loader.load;
const require = com.lumpofcode.loader.bind;

