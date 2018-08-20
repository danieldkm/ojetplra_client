/**
 Copyright (c) 2015, 2018, Oracle and/or its affiliates.
 The Universal Permissive License (UPL), Version 1.0
 */
'use strict';

/**
 * Example of Require.js boostrap javascript
 */
/* eslint-disable quote-props */

requirejs.config(
        {
            baseUrl: 'js',

            // Path mappings for the logical module names
            // Update the main-release-paths.json for release mode when updating the mappings
            paths:
                    //injector:mainReleasePaths
                    {
                        'knockout': 'libs/knockout/knockout-3.4.2.debug',
                        'mapping': 'libs/knockout/knockout.mapping-latest',
                        'jquery': 'libs/jquery/jquery-3.3.1',
                        'jqueryui-amd': 'libs/jquery/jqueryui-amd-1.12.1',
                        'promise': 'libs/es6-promise/es6-promise',
                        'hammerjs': 'libs/hammer/hammer-2.0.8',
                        'ojdnd': 'libs/dnd-polyfill/dnd-polyfill-1.0.0',
                        'ojs': 'libs/oj/v5.0.0/debug',
                        'ojL10n': 'libs/oj/v5.0.0/ojL10n',
                        'ojtranslations': 'libs/oj/v5.0.0/resources',
                        'text': 'libs/require/text',
                        'signals': 'libs/js-signals/signals',
                        'customElements': 'libs/webcomponents/custom-elements.min',
                        'proj4': 'libs/proj4js/dist/proj4-src',
                        'css': 'libs/require-css/css',
                        'appConfig': 'appConfigExternal',
                        'qrCodeScanner': 'libs/qr-code-scanner/scanner',
                        'qrCodeReader': 'libs/qrcode-reader/index',
                        'barCodeScanner': 'barcode-scanner-master/app/js/main',
                        'jsQR': 'libs/jsqr/jsqr',
                        'socket.io': 'libs/socket.io-client/dist/socket.io.slim',
                        'jsencrypt': 'libs/jsencrypt/jsencrypt.min',
                        'node-rsa': 'libs/node-rsa/src/main',
                        'mysocket': 'https://plra.unifil.br:8080/socket.io/socket.io.js'
                    }
                    //endinjector
                    ,

                    // Shim configurations for modules that do not expose AMD
                    shim:
                            {
                                'jquery':
                                        {
                                            exports: ['jQuery', '$']
                                        }
                            }
                }
        );

        require(['ojs/ojcore', 'knockout', 'appController'],
                function (oj, ko, app) {
                    $(function () {
                        function init() {
                            oj.Router.sync().then(function () {
                                // app.loadModule();
                                // Bind your ViewModel for the content of the whole page body.
                                ko.applyBindings(app, document.getElementById('page'));
                            }, function (error) {
                                oj.Logger.error('Error in root start: ' + error.message);
                            });
                        }

                        // If running in a hybrid (e.g. Cordova) environment, we need to wait for the deviceready
                        // event before executing any code that might interact with Cordova APIs or plugins.
                        if ($(document.body).hasClass('oj-hybrid')) {
                            document.addEventListener('deviceready', init);
                        } else {
                            init();
                        }
                    });
                }
        );
