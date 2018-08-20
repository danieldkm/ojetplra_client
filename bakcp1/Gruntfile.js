// /**
//   Copyright (c) 2015, 2018, Oracle and/or its affiliates.
//   The Universal Permissive License (UPL), Version 1.0
// */
// 'use strict';

// var path = require('path');

// module.exports = function(grunt) {

//   grunt.initConfig({
//     connect: {
//         // watch: {
//         // bower: {
//         //   files: ['bower.json'],
//         //   tasks: ['wiredep']
//         // },
//         // js: {
//         //   files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
//         //   tasks: ['newer:jshint:all'],
//         //   options: {
//         //       livereload: {
//         //         port: 9000,
//         //         key: grunt.file.read('private.key'),
//         //         cert: grunt.file.read('STAR_unifil_br.crt')
//         //       }
//         //     }
//         // },
//         // jsTest: {
//         //   files: ['test/spec/{,*/}*.js'],
//         //   tasks: ['newer:jshint:test', 'karma']
//         // },
//         // styles: {
//         //   files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
//         //   tasks: ['newer:copy:styles', 'autoprefixer'],
//         //   options: {
//         //       livereload: {
//         //         port: 9000,
//         //         key: grunt.file.read('private.key'),
//         //         cert: grunt.file.read('STAR_unifil_br.crt')
//         //       }
//         //     }
//         // },
//         // gruntfile: {
//         //   files: ['Gruntfile.js']
//         // },
//         // livereload: {
//         //  options: {
//         //      livereload: {
//         //        port: 9000,
//         //        key: grunt.file.read('private.key'),
//         //        cert: grunt.file.read('STAR_unifil_br.crt')
//         //      }
//         //    },
//         //   files: [
//         //     '<%= yeoman.app %>/{,*/}*.html',
//         //     '.tmp/styles/{,*/}*.css',
//         //     '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
//         //   ]
//         // }

//          options: {
//             protocol: 'https', // or 'http2'
//             port: 8443,
//             key: grunt.file.read('private.key').toString(),
//             cert: grunt.file.read('STAR_unifil_br.crt').toString(),
//             ca: grunt.file.read('STAR_unifil_br.ca-bundle').toString(),
//             // Change this to '0.0.0.0' to access the server from outside.
//             hostname: 'localhost'
//           },
//           livereload: {
//             options: {
//               open: true,
//               port: 8443,
//               key: grunt.file.read('private.key').toString(),
//               cert: grunt.file.read('STAR_unifil_br.crt').toString(),
//               middleware: function (connect) {
//                 return [
//                   modRewrite(['^[^\\.]*$ /index.html [L]']),
//                   connect.static('.tmp'),
//                   connect().use(
//                     '/bower_components',
//                     connect.static('./bower_components')
//                   ),
//                   connect().use(
//                     '/app/styles',
//                     connect.static('./app/styles')
//                   ),
//                   connect.static(appConfig.app)
//                 ];
//               }
//             }
//           },


//       // server: {
//         // options: {
//         //   livereload: {
//         //     protocol: 'https', // or 'http2'
//         //     port: 9000,
//         //     key: grunt.file.read('private.key').toString(),
//         //     cert: grunt.file.read('STAR_unifil_br.crt').toString(),
//         //     // ca: grunt.file.read('STAR_unifil_br.ca-bundle').toString()
//         //   }
//         // },
//       // },
//     }
//   });

//   require('load-grunt-config')(grunt, {
//   	configPath: path.join(process.cwd(), 'scripts/grunt/config')
//   });

//   grunt.loadNpmTasks("@oracle/grunt-oraclejet");

//   grunt.registerTask("build", "Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.", function (buildType) {
//     grunt.task.run([`oraclejet-build:${buildType}`]);
//   });

//   grunt.registerTask("serve", "Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.", function (buildType) {
//     grunt.task.run([`oraclejet-serve:${buildType}`]);    
//   }); 

//   // grunt.registerTask("default", "Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.", function (buildType) {
//   //   grunt.task.run([`oraclejet-serve:${buildType}`]);    
//   // }); 
// };

'use strict';
var path = require('path');
module.exports = function(grunt) {

  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), 'scripts/grunt/config'),
    data: {
      appname: path.basename(process.cwd()),  // same as project directory name, accessible with '<%= appname %>'
      appdir: 'web',  // accessible with '<%= appdir %>'
      distdir: 'dist'  // accessible with '<%= distdir %>'
    }
  });
  grunt.loadNpmTasks("grunt-oraclejet");
  //grunt.loadNpmTasks("grunt-war");
  grunt.registerTask("build", "Public task. Calls oraclejet-build to build the oraclejet application. Can be customized with additional build tasks.", function (buildType) {
    grunt.task.run([`oraclejet-build:${buildType}`, 'war']);
  });
  grunt.registerTask("serve", "Public task. Calls oraclejet-serve to serve the oraclejet application. Can be customized with additional serve tasks.", function (buildType) {
    grunt.task.run([`oraclejet-serve:${buildType}`]);
  });
};