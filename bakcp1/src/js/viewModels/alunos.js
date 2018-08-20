'use strict';
define(['ojs/ojcore'
       ,'knockout'
       ,'jquery'
       ,'appController'
       ,'socket.io'
       ,'ojs/ojknockout'
       ,'promise'
       ,'ojs/ojlistview'
       ,'ojs/ojarraydataprovider'
       ,'ojs/ojmenu'
       ,'ojs/ojoption'],
function(oj, ko, $, app, io) {

  function alunosViewModel(params) {

    var self = this;
    // if(app.video.srcObject){
    //   var track = app.video.srcObject.getTracks()[0];  // if only one media track
    //   console.log('track', track);
    //   track.stop();
    // }

    self.buttonClick = function(event){
        console.log('clicked', self.data);
        self.data.unshift({name: 'Settings2', version: '10.3.6.2', nodes: 3, cpu: 4, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8});
    }

    self.socket = io.connect('https://plra.unifil.br:8080');

    self.socket.on('connect', function () {
      self.socket.emit('authenticate', {token: localStorage.token}).on('authenticated', function () {
        // console.log('autenticado - socket');
        localStorage.socketisAuthenticated = true;
        return true;
      }).on('unauthorized', function(msg) {
        oj.Router.rootInstance.go('/');
        console.log("msg: ", msg);
        console.log("unauthorized: " + JSON.stringify(msg.data));
        localStorage.socketisAuthenticated = false;
        // throw new Error(msg.data.type);
        // return false;
      })
    });

    self.socket.on('novoaluno', function(msg){
      // console.log('novoAluno', msg);
      let aluno = {
        sqaluno: msg.SQ_ALUNO,
        name: msg.NM_ALUNO,
        foto: 'http://portal.filadelfia.br:7778/UniFilPolos/assets/images/Foto_Usuario.jpg'
      };

      let aluno_exist = false;
      for(var i = 0; i < self.data().length; i++){
        if(self.data()[i].sqaluno === aluno.sqaluno){
          aluno_exist = true;
          break;
        }
      }

      console.log('aluno::', aluno);
      if(!aluno_exist){
        console.log('add aluno');
        self.data.unshift(aluno);
      }

    });

    self.data = ko.observableArray(
                  [
                    // {
                    //   name: 'Settings', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8
                    // },
                    // {
                    //   name: 'Tools', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8
                    // },
                    // {
                    //   name: 'Base', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8
                    // },
                    // {
                    //   name: 'Environment', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8
                    // },
                    // {
                    //   name: 'Security', version: '10.3.6', nodes: 2, cpu: 2, type: 'Java Cloud Service Virtual Image', balancer: 1, memory: 8
                    // }
                  ]);

    self.dataProvider = new oj.ArrayDataProvider(self.data, 
                                                {'idAttribute': 'sqaluno'}
                                                 // {keys: self.data.map(function(value) {
                                                 //     return value.name;
                                                 // })}
                                                 );

    this.renderer = function(context)
    {
        var template;
        if (context.leaf && context.data.type)
            template = self.activeLayout() == "thumbView" ? 'item_grid_template' : 'item_template';
        else
            template = 'group_template';
        var renderer = oj.KnockoutTemplateUtils.getRenderer(template, true);
        return renderer.call(this, context);
    };

     this.selectTemplate = function(file, bindingContext)
      {
        return self.activeLayout() == "thumbView" ? 'item_grid_template' : 'item_template';
      };

   
    self.selectedMenuItem = ko.observable("None selected yet");
    self.myActionFunction = function(event)
    {
        self.selectedMenuItem(event.target.textContent);
    };

    this.layoutViewRadios = [
                              {id: 'thumbView', icon: 'oj-fwk-icon-grid oj-fwk-icon'},
                              {id: 'listView', icon: 'oj-fwk-icon-list oj-fwk-icon'}
                            ];
    this.activeLayout = ko.observable("listView");
    this.handleLayoutChange = function(event) 
    {
      var listview = document.getElementById('listview');
      $(listview).toggleClass("oj-listview-card-layout");
      listview.refresh();
    };


    // self.myBeforeOpenFunction = function (event) 
    // {
    //     var target = event.detail.originalEvent.target;
    //     var context = document.getElementById("listview").getContextByNode(target);
    //     if (context != null)
    //     {
    //         self.launchedFromItem(context["key"]);
    //     }
    // };

  }

  return alunosViewModel;

});
