'use strict';
define(['ojs/ojcore'
       ,'knockout'
       ,'jquery'
       ,'ojs/ojmodule-element-utils'
       ,'mapping'
       ,'PushClient'
       ,'ojs/ojknockout'
       ,'ojs/ojnavigationlist'
       ,'ojs/ojoffcanvas'
       ,'ojs/ojrouter'
       ,'ojs/ojmodule'
       ,'ojs/ojmoduleanimations'],
        function (oj, ko, $, moduleUtils, mapping, PushClient)
        {
            oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

            var router = oj.Router.rootInstance;

            router.configure(
                    {
                        'login': {label: 'Login', isDefault: true},
                        'initialize': { label: 'Inicio' },
                        'alunos': { label: 'Alunos'}
                    });

            function AppControllerViewModel()
            {
                ko.mapping = mapping;

                var self = this;

                self.pushClient = new PushClient(self);

                self.router = router;

                // Router setup 1 ----------------------------------------------
                var platform = oj.ThemeUtils.getThemeTargetPlatform();

                self.pendingAnimationType = null;

                function switcherCallback(context) {
                    return self.pendingAnimationType;
                }

                function mergeConfig(original) {
                    return $.extend(true, {}, original, {
                        'animation': oj.ModuleAnimations.switcher(switcherCallback),
                        'cacheKey': self.router.currentValue()
                    });
                }

                self.moduleConfig = mergeConfig(self.router.moduleConfig);

                 // Router setup 2 ----------------------------------------------
                // self.router = oj.Router.rootInstance;
                // self.router.configure({
                //     'login': {label: 'Login', isDefault: true}
                // });
                // oj.Router.defaults['urlAdapter'] = new oj.Router.urlParamAdapter();

                // self.moduleConfig = ko.observable({'view':[], 'viewModel':null});

                // self.loadModule = function() {
                //     ko.computed(function() {
                //         var name = self.router.moduleConfig.name();
                //         var viewPath = 'views/' + name + '.html';
                //         var modelPath = 'viewModels/' + name;
                //         var masterPromise = Promise.all([
                //             moduleUtils.createView({'viewPath':viewPath}),
                //             moduleUtils.createViewModel({'viewModelPath':modelPath})
                //         ]);
                //         masterPromise.then(
                //             function(values){ 
                //             self.moduleConfig({'view':values[0],'viewModel':values[1]}); 
                //         },
                //         function(reason){}
                //         );
                //     });
                // };
                // Router setup 2 ----------------------------------------------

                // Navigate to incident by id
                // self.goToIncident = function(id, from) {
                //     self.router.go('initialize/' + id);
                //     self.fromIncidentsTab = from;
                // };

                self.goToIncidents = function() {
                    var destination = self.fromIncidentsTab;
                    self.router.go('initialize/' + destination);
                };

                self.toggleDrawer = function () {
                    return oj.OffcanvasUtils.toggle({selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
                };

                self.closeDrawer = function () {
                    return oj.OffcanvasUtils.close({selector: '#navDrawer', modality: 'modal', content: '#pageContent' });
                };

                self.drawerChange = function (event) {
                    self.closeDrawer();
                };

            }

            
            return new AppControllerViewModel();

        });