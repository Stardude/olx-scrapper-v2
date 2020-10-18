const grunt = require("grunt");
const sass = require("node-sass");

grunt.initConfig({
    sass: {
        options: {
            implementation: sass,
            sourceMap: true
        },
        dist: {
            files: {
                "public/style.css": "public/main.scss"
            }
        }
    },
    watch: {
        sass: {
            files: "public/main.scss",
            tasks: ["sass"]
        }
    }
});

grunt.loadNpmTasks("grunt-sass");
grunt.loadNpmTasks("grunt-contrib-watch");
grunt.registerTask("default", ["sass", "watch"]);