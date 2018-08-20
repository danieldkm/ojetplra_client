'use strict';
define(['ojs/ojcore'
       ,'knockout'
       // ,'qrCodeReader'
       ,'appController'
       ,'jsQR'
       ,'appConfig'
       ,'socket.io'
       ,'jsencrypt'
       // ,'barCodeScanner'
       // ,'dataService'
       ,'ojs/ojknockout'
       ,'ojs/ojfilepicker'
       ,'ojs/ojbutton'
       ,'ojs/ojdialog']
       ,function(oj
                ,ko
                // ,QrCode
                ,app
                ,jsQR
                ,appConfig
                ,io
                ,JSEncrypt
                // ,data
                ) {
    
  
  function QRCodeViewModel() {
    
    // var crypt = new JSEncrypt.JSEncrypt();
    // crypt.setKey('libs/mykey/public.key');
    // $.get('mykey/public.key', function(data) {
    //     alert(data);
    //     console.log('key', crypt.setKey(data));
    //     var text = 'awdaw';
    //     // Encrypt the data with the public key.
    //     var enc = crypt.encrypt(text);
    //     console.log('encryt',enc);
    // });
    
//     crypt.setKey(
// "-----BEGIN RSA PRIVATE KEY-----\n" +
// "MIICXgIBAAKBgQDVE1JUVIp5yLdmsZ19z2yK7LwlOEOFnykNCGrOWYyAMeQdCvTo\n" +
// "P1YP7yKW0RJEIR41981bCuaQ9zdPSDWIkfPN6a+PVj7p/YbavIhyVnV1hgH+iHJB\n" +
// "WBTAM0j8Ov4PmD7vhC5p839zhtN3fLJSkrIQ7OiEgbPhEpeKhFJ88Wl3fwIDAQAB\n" +
// "AoGBAJ4rNp1FGHooxgPkaz1+IVvLOisC5hSlvmpfSjGdhc+PuX7ZqE1S3sb7RBji\n" +
// "YAXU88EqDvW7VMZdzV/8AUk81tYz9bEWS5Njp1iRglEnX3SHXm90vp4o6LR6/GHH\n" +
// "ujB+rW/0qyPPy9UAfGkzLSCqFP8uCKdo9aS7JUkp3mkBiNPZAkEA8C+Dfn9DmwTd\n" +
// "OFzbgl5kYJTMsCzw0PMfUkOofoHp360itK9Uo88ZW6SDjyfzsWhev0X5M+OuipAq\n" +
// "YZqLFvFynQJBAOMa2VTE9g2VMNrcL0EpVSEYkFz7j287MgGi9QF/p/NA9twu29Ux\n" +
// "Psb/8TA/W+k69It15xgiKa0cgGcLg58XWcsCQQCZ4ZcZgGfL9b3V0ohAakFdL3hE\n" +
// "l0ZiWKGEjxxwkMNKLx7BLGPJ33GbqTcwjKQw0XGCkk4q1ICK/fppNh5OwLpxAkAw\n" +
// "DZ9Mw3w4tYen140cIY3EufjZ49SeuYzEMeHbllJIM0fIoRWcz5Wz77Xt+ooNGI9j\n" +
// "7ueeAKSG34//vbz07bDvAkEAplP8Qf1hygfwmzHGraaP7nnwBv+aDHlONCBvBU7U\n" +
// "Qfnah9aa6gJXXPor6KVZpFt76hw5Zl6arSf++vzOKs7d1A==\n" +
// "-----END RSA PRIVATE KEY-----");     
// // "-----BEGIN PUBLIC KEY-----\n" +
// // "MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgGJVSd+d2nGGXwSFu2DB46fqoPN1\n" + 
// // "iWHUKXs6Z73EdCu0mPaQVCw1pmOQqVjJ+3aX6gG3v3uB75PmrE9+4Nyrk3o+RYBb\n" + 
// // "y3z9plR74b6QhYIX5wuTtAEyOTv0jnqyUSG4r9Ojfdls1hKdW5XZ9Tt4VbBGOAF6\n" + 
// // "8ATjJd6d8H0kmLzBAgMBAAE=\n" + 
// // "-----END PUBLIC KEY-----"); 
// //You can use also setPrivateKey and setPublicKey, they are both alias to setKey
    // var text = 'awdaw';
    // // Encrypt the data with the public key.
    // var enc = crypt.encrypt(text);
    // console.log('encryt',enc);
    // Now decrypt the crypted text with the private key.
    // var dec = crypt.decrypt('M9bumQcYQdtdrfEyTUd2Mn7IrPbE5OqaTDoddTcfdLMem5qnpdk3HAzwNbaX+aJNhcMPfXqnE6TuRDRBN5B2Q4dYeXPq6kw0ISb3Yb4YPVQcdYEuPRFWwMO1ElzH2Lqo7Ycu/Sf9hyx1HC7vqfdO/60EpHM9jZI2S9FpsC02BtQ=');

    // // Now a simple check to see if the round-trip worked.
    // if (dec === text){
    //     alert('It works!!!');
    // } else {
    //     alert('Something went wrong....');
    // }
    
    var self = this;
    console.log('app.pushClient', app.pushClient);
    console.log('localStorage', localStorage);
    var isAuth = false;
    if(localStorage.isAuthenticated){
        isAuth = localStorage.isAuthenticated;
    }
    console.log('isAuthorized',isAuth);
    if(!isAuth){
        oj.Router.rootInstance.go('/');
    } else if (localStorage.token) {
        self.socket = io.connect('https://plra.unifil.br:8080');
        console.log('token',localStorage.token);
        self.socket.on('connect', function () {
            self.socket.emit('authenticate', {token: localStorage.token}).on('authenticated', function () {
                console.log('autenticado - socket');
                localStorage.socketisAuthenticated = true;
                return true;
            }).on('unauthorized', function(msg) {
                console.log("msg: ", msg);
                console.log("unauthorized: " + JSON.stringify(msg.data));
                localStorage.socketisAuthenticated = false;
                // throw new Error(msg.data.type);
                // return false;
            })
        });

        // self.canvasElement = ko.observable();

        // self.canvasElement.subscribe(function initCanvas(element) {
        //     var ctx = element.getContext("2d");
        //     console.log('ctx', ctx);
        //     ctx.fillStyle = "#FF0000";
        //     ctx.fillRect(10, 10, 100, 100);
        // });
        

        // self.clickedButton = ko.observable("(None clicked yet)");

        // self.preview = ko.observable("preview");


        

       //  self.handleOpen = $("#buttonOpener").click(function() {
       //     $("#modalDialog1").ojDialog("open"); });

       // self.handleOKClose = $("#okButton").click(function() {
       //     $("#modalDialog1").ojDialog("close"); });

        // var qr = new QrCode();

        // qr.callback = function(err, result) {
        //     if(result){
        //         console.log('result', result);
        //         console.log('preview', preview);
        //         preview.innerHTML = result.result;
        //     } else{
        //         preview.innerHTML = err;
        //         console.error(err);
        //     }
        // }

        // self.fileNames = ko.observableArray([]);

        // self.selectListener = function(event) {
        //     var files = event.detail.files;
        //     for (var i = 0; i < files.length; i++) {
        //         var file = files[i];
        //         var imageType = /^image\//;

        //         if (!imageType.test(file.type)) {
        //           throw new Error('File type not valid');
        //         }

        //         // Read file
        //         var reader = new FileReader();
        //         reader.addEventListener('load', function() {
        //           // Show as preview image
        //           var img = document.querySelector('img') || document.createElement('img');
        //           img.src = this.result;
        //           // preview.appendChild(img);

        //           // Analyse code
        //           // console.log(this.result);
        //           qr.decode(this.result);

        //             // var canvas = document.createElement('canvas');
        //             // var context = canvas.getContext('2d');
        //             // // var img = document.getElementById('myimg');
        //             // canvas.width = img.width === 0 ? 100 : img.width;
        //             // canvas.height = img.height;
        //             // context.drawImage(img, 0, 0 );
        //             // console.log('img',img);
        //             // console.log('img.width',img.clientWidth);
        //             // console.log('img.height', img.clientHeight);
        //             // var myData = context.getImageData(0, 0, 1200, 1200);

        //             // var width = img.clientWidth;
        //             // var height = img.clientHeight;

        //             // console.log('myData', myData);

        //             // const code = jsQR(myData.data, 1200, 1200);

        //             // console.log('code', code);                
        //             // if (code) {
        //             //   console.log("Found QR code", code);
        //             //   preview.innerHTML = code;
        //             // } else {
        //             //     preview.innerHTML = "erro";
        //             // }
        //         }.bind(reader), false);
        //         reader.readAsDataURL(file);
        //       }


        //     console.log(files);
        // }


        // self.buttonClick = function(event){
        //     self.clickedButton(event.currentTarget.id);

        // }


        $(document).ready(function ()
        {
            self.handleOKClose = $("#okButton").click(function() {
                $("#modalDialog1").ojDialog("close"); 
                self.openVideo();
            });
            
            self.video = document.createElement("video");

            self.canvasElement = document.getElementById("canvasElement");
            self.canvas = canvasElement.getContext("2d");
            self.loadingMessage = document.getElementById("loadingMessage");
            // var outputContainer = document.getElementById("output");
            // var outputMessage = document.getElementById("outputMessage");
            self.outputData = document.getElementById("outputData");

            self.drawLine = function(begin, end, color) {
              self.canvas.beginPath();
              self.canvas.moveTo(begin.x, begin.y);
              self.canvas.lineTo(end.x, end.y);
              self.canvas.lineWidth = 4;
              self.canvas.strokeStyle = color;
              self.canvas.stroke();
            }

            self.openVideo = function () {
                // Use facingMode: environment to attemt to get the front camera on phones
                navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
                    self.video.srcObject = stream;
                    self.video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
                    self.video.play();
                    app.video = self.video;
                    requestAnimationFrame(self.tick);
                });
            }
            self.openVideo();

            self.tick = function() {
                self.loadingMessage.innerText = "⌛ Loading video..."
                if (self.video.readyState === self.video.HAVE_ENOUGH_DATA) {
                    self.loadingMessage.hidden = true;
                    self.canvasElement.hidden = false;
                    // outputContainer.hidden = false;

                    self.canvasElement.height = self.video.videoHeight;
                    self.canvasElement.width = self.video.videoWidth;
                    self.canvas.drawImage(self.video, 0, 0, self.canvasElement.width, self.canvasElement.height);
                    var imageData = self.canvas.getImageData(0, 0, self.canvasElement.width, self.canvasElement.height);
                    var code = jsQR(imageData.data, imageData.width, imageData.height);
                    if (code) {
                        self.drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
                        self.drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
                        self.drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
                        self.drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
                        // outputMessage.hidden = true;
                        // outputData.parentElement.hidden = false;
                        // outputData.innerText = code.data;
                        if(code.data){
                            self.outputData.innerText = code.data;
                            console.log('stop camera');
                            var track = self.video.srcObject.getTracks()[0];  // if only one media track
                            track.stop();

                            self.socket.emit('eventoAluno', {sqAluno: code.data});
                            $("#modalDialog1").ojDialog("open");
                            
                        }
                    // } else {
                    //     outputMessage.hidden = false;
                    //     outputData.parentElement.hidden = true;
                    }
                }
                requestAnimationFrame(self.tick);
            }
        });



        // QRScanner.initiate({
        //     match: /^[a-zA-Z0-9]{16,18}$/, // optional
        //     onResult: function (result) { console.info('DONE: ', result); },
        //     onError: function (err) { console.error('ERR :::: ', err); }, // optional
        //     onTimeout: function () { console.warn('TIMEDOUT'); } // optional
        // })

        // self.integerConverter = ko.observable(null);

        // var converterFactory = oj.Validation.converterFactory('number');
        // self.integerConverter(converterFactory.createConverter({minimumFractionDigits: 0, maximumFractionDigits: 0}));

        // app.refreshStats = function (response) {
        //   self.setBarChart(JSON.parse(response).metrics);
        // };

        // app.refreshIncStats = function (response) {
        //   self.setPieChart(JSON.parse(response))
        // };

        // // load incidents stats on activation
        // self.handleActivated = function(params) {

        //   self.statsPromises = [data.getIncidentsStats(), data.getIncidentsHistoryStats()];

        //   self.incidentsStatsPromise = Promise.all(self.statsPromises);

        //   // update charts data upon loading incidents stats
        //   self.incidentsStatsPromise.then(function(results) {

        //     var pieChartResult = JSON.parse(results[0]);
        //     var barChartResult = JSON.parse(results[1]);

        //     self.setPieChart(pieChartResult);

        //     self.setBarChart(barChartResult.metrics);

        //   });

        //   return self.incidentsStatsPromise;
        // };

        // self.handleAttached = function(info) {
        //   app.appUtilities.adjustContentPadding();
        // };

        // self.centerLabel = ko.observable();
        // self.labelStyle = ko.observable('color:#6C6C6C;font-size:33px;font-weight:200;');

        // self.numPriorityHigh = ko.observable(0);
        // self.numPriorityNormal = ko.observable(0);
        // self.numPriorityLow = ko.observable(0);

        // self.pieSeriesValue = ko.observableArray([]);
        // self.pieGroupsValue = ko.observableArray([]);

        // self.barSeriesValue = ko.observableArray([]);
        // self.barGroupsValue = ko.observableArray([]);

        // self.innerRadius = ko.observable(0.8);

        // self.setBarChart = function(data) {

        //   var barGroups = [];
        //   var series = [{ name: "Open Incidents", items: [], color: '#88C667' },
        //                 { name: "Closed Incidents", items: [], color: '#4C4C4B' }];

        //   data.forEach(function(entry) {
        //     barGroups.push({name: entry.month.substr(0, 3), shortDesc: entry.month});
        //     var openIncidents = entry.incidentsAssigned - entry.incidentsClosed;
        //     series[0].items.push({value: openIncidents, shortDesc: openIncidents + " Open Incidents in " + entry.month});
        //     series[1].items.push({value: entry.incidentsClosed, shortDesc: entry.incidentsClosed + " Closed Incidents in " + entry.month});
        //   });

        //   self.barSeriesValue(series);

        //   self.barGroupsValue(barGroups);
        // };

        // /**
        //  * Generate the custom tooltip
        //  */
        // self.tooltipFunction = function (dataContext) {
        //   // Set a black border for the tooltip
        //   dataContext.parentElement.style.borderColor = "#5a5a5a";

        //   var tooltipElem = document.createElement('div');

        //   // Add series and group text
        //   var textDiv = document.createElement('div');
        //   textDiv.style.textAlign = 'center'
        //   tooltipElem.appendChild(textDiv);

        //   var dateText = document.createElement('span');
        //   dateText.textContent = dataContext.group;
        //   dateText.style.fontWeight = 'bold';
        //   textDiv.appendChild(dateText);

        //   textDiv.appendChild(document.createElement('br'));

        //   var table = document.createElement('table');
        //   textDiv.appendChild(table);

        //   var chart = dataContext.componentElement;
        //   for (var i = 0; i < chart.getSeriesCount(); i++)
        //   {
        //     var seriesItem = chart.getDataItem(i, dataContext.x);

        //     var row = document.createElement('tr');
        //     table.appendChild(row);

        //     var column1 = document.createElement('td');
        //     row.appendChild(column1);
        //     column1.style.backgroundColor = seriesItem['color'];
        //     column1.style.width = '5px';

        //     var column2 = document.createElement('td');
        //     row.appendChild(column2);
        //     var seriesText = document.createElement('span');
        //     seriesText.textContent = seriesItem['series']
        //     seriesText.style.cssFloat = 'left';
        //     column2.appendChild(seriesText);

        //     var column3 = document.createElement('td');
        //     row.appendChild(column3);
        //     var valueText = document.createElement('span');
        //     valueText.textContent = seriesItem['value'];
        //     column3.appendChild(valueText)
        //   }

        //   // Return an object with the elem to be inserted mapped to the 'insert' key
        //   return {'insert':tooltipElem};
        // };

        // self.setPieChart = function(data) {
        //   self.centerLabel(data.incidentCount.high + data.incidentCount.normal + data.incidentCount.low);

        //   self.numPriorityHigh(data.incidentCount.high);
        //   self.numPriorityNormal(data.incidentCount.normal);
        //   self.numPriorityLow(data.incidentCount.low);

        //   var pieSeries = [{items: [{value: self.numPriorityLow(), shortDesc: self.numPriorityLow() + " Low Priority Incidents"}], color: '#7FBA60', name: 'Low Pirority' },
        //                {items: [{value: self.numPriorityNormal(), shortDesc: self.numPriorityNormal() + " Normal Priority Incidents"}], color: '#4092D0', name: 'Normal Priority' },
        //                {items: [{value: self.numPriorityHigh(), shortDesc: self.numPriorityHigh() + " High Priority Incidents"}], color: '#FF453E', name: 'High Priority' }];

        //   var pieGroups = ["Group A"];

        //   self.pieSeriesValue(pieSeries);
        //   self.pieGroupsValue(pieGroups);
        // };

        // self.labelValue = ko.computed(function() {
        //   if(self.centerLabel()) {
        //     return {text: self.centerLabel().toString(), style: self.labelStyle()};
        //   }
        // });


    }

  }

    // /**--------------------------------------------------------------------------*/
    // $(document).ready(function ()
    // {
    //     // ko.applyBindings(new SimpleModel(), document.getElementById('div1'));
    //     // var canvas = document.createElement('canvas');
    //     // var context2 = canvas.getContext('2d');
    //     // console.log('context2:', context2);

    //     var video = document.createElement("video");
    //     var canvasElement = document.getElementById("canvas");
    //     console.log('canvasElement:', canvasElement);
    //     var canvas = canvasElement.getContext("2d");
    //     var loadingMessage = document.getElementById("loadingMessage");
    //     var outputContainer = document.getElementById("output");
    //     var outputMessage = document.getElementById("outputMessage");
    //     var outputData = document.getElementById("outputData");

    //     function drawLine(begin, end, color) {
    //       canvas.beginPath();
    //       canvas.moveTo(begin.x, begin.y);
    //       canvas.lineTo(end.x, end.y);
    //       canvas.lineWidth = 4;
    //       canvas.strokeStyle = color;
    //       canvas.stroke();
    //     }

    //     // Use facingMode: environment to attemt to get the front camera on phones
    //     navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } }).then(function(stream) {
    //         alert('try play video');
    //       video.srcObject = stream;
    //       video.setAttribute("playsinline", true); // required to tell iOS safari we don't want fullscreen
    //       video.play();
    //       alert('video played');
    //       // requestAnimationFrame(tick);
    //     });

    //     function tick() {
    //       loadingMessage.innerText = "⌛ Loading video..."
    //       if (video.readyState === video.HAVE_ENOUGH_DATA) {
    //         loadingMessage.hidden = true;
    //         canvasElement.hidden = false;
    //         outputContainer.hidden = false;

    //         canvasElement.height = video.videoHeight;
    //         canvasElement.width = video.videoWidth;
    //         canvas.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
    //         var imageData = canvas.getImageData(0, 0, canvasElement.width, canvasElement.height);
    //         var code = jsQR(imageData.data, imageData.width, imageData.height);
    //         if (code) {
    //           drawLine(code.location.topLeftCorner, code.location.topRightCorner, "#FF3B58");
    //           drawLine(code.location.topRightCorner, code.location.bottomRightCorner, "#FF3B58");
    //           drawLine(code.location.bottomRightCorner, code.location.bottomLeftCorner, "#FF3B58");
    //           drawLine(code.location.bottomLeftCorner, code.location.topLeftCorner, "#FF3B58");
    //           outputMessage.hidden = true;
    //           outputData.parentElement.hidden = false;
    //           outputData.innerText = code.data;
    //         } else {
    //           outputMessage.hidden = false;
    //           outputData.parentElement.hidden = true;
    //         }
    //       }
    //       requestAnimationFrame(tick);
    //     }
    // });
    /**--------------------------------------------------------------------------*/

  return QRCodeViewModel;
});
