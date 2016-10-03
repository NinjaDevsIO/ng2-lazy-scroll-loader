Error.stackTraceLimit = Infinity;

jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

var builtPath = '/base/';

__karma__.loaded = function () { };

function isJsFile(path) {
  return path.slice(-3) == '.js';
}

function isSpecFile(path) {
  return /\.spec\.(.*\.)?js$/.test(path);
}

function isBuiltFile(path) {
  return isJsFile(path) && (path.substr(0, builtPath.length) == builtPath);
}

var allSpecFiles = Object.keys(window.__karma__.files)
  .filter(isSpecFile)
  .filter(isBuiltFile);

System.config({
  baseURL: '/base',
  paths: {
    // paths serve as alias
    'npm:': 'node_modules/'
  },
  // Extend usual application package list with test folder
  packages: {
    'testing': {
      main: 'index.js',
      defaultExtension: 'js'
    },
    'src': {
      defaultExtension: 'js'
    },
    rxjs: {
      defaultExtension: 'js'
    }
  },

  map: {
    '@angular/core': 'npm:@angular/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js',
    '@angular/compiler': 'npm:@angular/compiler/bundles/compiler.umd.js',
    '@angular/platform-browser': 'npm:@angular/platform-browser/bundles/platform-browser.umd.js',
    '@angular/platform-browser-dynamic': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
    '@angular/http': 'npm:@angular/http/bundles/http.umd.js',
    '@angular/router': 'npm:@angular/router/bundles/router.umd.js',
    '@angular/forms': 'npm:@angular/forms/bundles/forms.umd.js',
    '@angular/upgrade': 'npm:@angular/upgrade/bundles/upgrade.umd.js',

    // testing
    '@angular/core/testing': 'npm:@angular/core/bundles/core-testing.umd.js',
    '@angular/common/testing': 'npm:@angular/common/bundles/common-testing.umd.js',
    '@angular/compiler/testing': 'npm:@angular/compiler/bundles/compiler-testing.umd.js',
    '@angular/platform-browser/testing': 'npm:@angular/platform-browser/bundles/platform-browser-testing.umd.js',
    '@angular/platform-browser-dynamic/testing': 'npm:@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
    '@angular/http/testing': 'npm:@angular/http/bundles/http-testing.umd.js',
    '@angular/router/testing': 'npm:@angular/router/bundles/router-testing.umd.js',
    '@angular/forms/testing': 'npm:@angular/forms/bundles/forms-testing.umd.js',

    // other libraries
    'rxjs': 'npm:rxjs',
  },
});

Promise.all([
  System.import('@angular/core/testing'),
  System.import('@angular/platform-browser-dynamic/testing')
])
.then(function (providers) {
  var coreTesting    = providers[0];
  var browserTesting = providers[1];

  coreTesting.TestBed.initTestEnvironment(
    browserTesting.BrowserDynamicTestingModule,
    browserTesting.platformBrowserDynamicTesting());
})
.then(function () {
  return Promise.all(allSpecFiles.map(function (moduleName) {
    return System.import(moduleName);
  }));
})
.then(__karma__.start, __karma__.error);
