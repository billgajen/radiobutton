module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
		    dist: {
		        src: [
		            'public/**/*.js', // All JS in the libs folder
		            'js/global.js'  // This specific file
		        ],
		        dest: 'dist/js/production.js',
		    }
		},
		jshint: {
			options: {
				reporter: require('jshint-stylish')
			},
			all: ['Grunfile.js', 'public/**/*.js', '!public/js/jquery-1.11.3.min.js', '!public/js/angular-1.4.8.min.js', '!public/js/bootstrap/*.js']
		},
		uglify: {
			options: {
				banner: '/*\n <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/\n'
			},
			build: {
				files: {
					'dist/js/main.min.js': 'public/js/main.js'
				}
			}
		},
		less: {
			build: {
				files: {
					'dist/css/style.css': 'public/css/style.less'
				}
			},
			options: {
				'compress': true,
				'ieCompat': true,
			}
		},		
		watch: {
			stylesheets: {
				files: ['public/**/*.css', 'public/**/*.less'],
				tasks: ['less']
			},
			scripts: {
				files: 'public/**/*.js',
				tasks: ['jshint', 'uglify']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['jshint', 'uglify', 'less', 'watch']);
};