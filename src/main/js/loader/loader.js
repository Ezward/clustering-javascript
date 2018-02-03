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
    const modules = {};
    const bindings = {};

    /**
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
     * Determine if a string start with a given substring.
     * @param {*} s 
     * @param {*} t 
     * @return true if s begins with t, false otherwise
     */
    function startsWith(s, t) {
        if((typeof s === 'string') && (typeof t === 'string')) {
            return 0 === s.lastIndexOf(t, 0);
        }
        throw TypeError("matchStartCount: received non-string argument.");
    }

    /**
     * count the number of matching characters at
     * the start of two strings.
     * 
     * @param {*} p 
     * @param {*} q 
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
     * return the span of characters that match
     * at the start of two strings.
     * 
     * @param {*} p 
     * @param {*} q 
     * @return the matching characters.
     */
    function matchAtStart(p, q) {
        if((typeof p === 'string') && (typeof q === 'string')) {
            return p.substring(0, matchAtStartCount(p, q));
        }
        throw TypeError("matchStart: received non-string argument.");
    }

    /**
     * Replace substring at start of a string.
     * 
     * @param {*} s the string
     * @param {*} t the substring to replace
     * @param {*} r the replacement
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
     * Replace substring at end of a string.
     * 
     * @param {*} s the string
     * @param {*} t the substring to replace
     * @param {*} r the replacement
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


    //
    // get the most recently loaded script 
    // (that will be this one; loader.js)
    // and get the data-root element from it
    // so we can use it as the modules root
    //
    function getProjectRootPath() {
        const script = lastScript();
        const scriptPath = script.src;
        const doc = script.ownerDocument;
        const docPath = doc.baseURI;

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
        // let path = lastScript().src;
        let path = replaceAtStart(lastScript().src, projectRoot, "");

        //
        // remove the root from the path and treat
        // require(path) calls like the working
        // directory is the root.
        //
        if(typeof moduleRoot === 'string') {
            path = replaceAtStart(path, moduleRoot, ".");
            path = replaceAtEnd(path, ".js", "");
        }

        if(typeof modules[path] !== 'undefined') {
            throw Error("module at path(" + path + ") is already loaded." );
        }
        modules[path] = module;
    }

    function bind(path) {
        if(typeof modules[path] === 'undefined') {
            throw Error("module at path(" + path + ") is not loaded." );
        }

        if(typeof bindings[path] === 'undefined') {
            bindings[path] = modules[path](bind);
        }

        return bindings[path];
    }

    return {'load': load, 'bind': bind};
}();

const define = com.lumpofcode.loader.load;
const require = com.lumpofcode.loader.bind;

