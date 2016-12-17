//simple build file to export the library modules into a single, reusable file
//the build makes use of 'almond.js' which allows for users to fully use the library without needing requirejs 

({
    //because all modules are loaded relative to baseUrl, it needs to be set to the directory containing all the source code modules
    baseUrl: '../src',

    out: '../SimplePhysics-min.js',
    optimize: 'uglify2',

    include: ['SimplePhysics', '../build/almond'],
    
    wrap: {
        startFile: "start.js",
        endFile: "end.js"
    }
})