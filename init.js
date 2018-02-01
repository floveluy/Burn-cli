const fs = require('fs');

module.exports = class BurnInit {

    constructor() {
        this.appPath = __dirname + '/app/';
    }
    run(currentDir, argv) {
        const project = argv[0];
        if (!project) return;

        const des = currentDir + '/' + project + '/app';
        fs.mkdirSync(currentDir + '/' + project);
        fs.mkdirSync(des);
        this.readDir(this.appPath, project, currentDir);

        this.write(currentDir, project);
    }

    write(currentDir, project) {
        const json = {
            "name": project,
            "version": "1.0.0",
            "description": "",
            "main": "app/start",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1"
            },
            "keywords": [],
            "author": "",
            "license": "ISC",
            "dependencies": {
                "burnjs": "0.0.21"
            }
        }

        fs.writeFileSync(currentDir + '/' + project + '/package.json', JSON.stringify(json));
    }

    readDir(path, project, currentDir) {
        const app = fs.readdirSync(path);
        app.forEach((file) => {
            if (fs.statSync(path + file).isDirectory()) {
                const p = path + file;
                const makeup = p.substr(__dirname.length, p.length);
                const des = currentDir + '/' + project + makeup;
                fs.mkdirSync(des);
                console.log(des);

                this.readDir(path + file + '/', project, currentDir);
            } else {

                const P = path + file;
                const des = currentDir + '/' + project + P.substring(__dirname.length, P.length);
                console.log(des);
                fs.copyFileSync(P, des);
            }
        })
    }

}




