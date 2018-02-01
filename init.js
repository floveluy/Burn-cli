const fs = require('fs');
const logger = require('./lib/logger');

const commandMap = {
    '-init': '创建新项目，example：burn-cli -init BurnProject-example'
}

module.exports = class BurnInit {

    constructor(currentDir, argv) {
        this.appPath = __dirname + '/app/';
        this.currentDir = currentDir;
        this.argv = argv;
        this.project = argv[1];
        this.type = argv[0];
        this.files = [];
        this.dirs = [];
        this.command = {
            "-init": '-init'
        }
        this.logger = new logger;

    }
    /**
     * 获取用户指定project的工作目录
     */
    destination() {
        return this.currentDir + '/' + this.project;
    }
    /**
     * 构建目录
     */
    run() {
        const handler = this.command[this.type];
        if (!handler) {
            this.logger.blue('命令格式:burn-cli [command] [project-dir]');
            const sup = Object.keys(this.command).map((cm) => {
                return cm + '\n' + commandMap[cm] + '\n'
            })

            this.logger.green(`支持的命令(command)：\n\n${sup}`);
            return;
        }

        if (!this.project) {
            this.logger.blue('没有指定项目目录，命令格式:burn-cli [command] [project-dir]');
            return
        };
        this[handler]();
    }

    '-init'() {
        fs.mkdirSync(this.destination());//构建project
        fs.mkdirSync(this.destination() + '/app');//构建下的app
        this.cpySrc();//复制app下的所有内容到目标目录
        this.write();
    }

    output(des, json) {
        fs.writeFileSync(this.destination() + '/' + des, JSON.stringify(json, null, 4));
    }

    write() {
        const pkg = {
            "name": this.project,
            "version": "1.0.0",
            "description": "",
            "main": "app/start",
            "scripts": {
                "test": "echo \"Error: no test specified\" && exit 1",
                "dev": "./node_modules/nodemon/bin/nodemon.js"
            },
            "keywords": [],
            "author": "",
            "license": "ISC",
            "dependencies": {
                "burnjs": "^1.0.0",
                "nodemon": "^1.14.11"
            }
        }
        const nodemon = {
            "ignore": [
                "**/*.test.js",
                "**/*.spec.js",
                ".git",
                "node_modules"
            ],
            "watch": [
                "app"
            ],
            "exec": "node app/start.js",
            "ext": "js"
        }
        this.output("package.json", pkg);
        this.output("nodemon.json", nodemon);
    }

    cpySrc() {
        this.readDir(this.appPath);
        this.dirs.forEach((des) => {
            fs.mkdirSync(des);
        })
        this.files.forEach(({ src, des }) => {
            fs.copyFileSync(src, des);
        })
    }
    /**
     * 递归读取目标目录
     * @param {*} path 
     */
    readDir(path) {
        const app = fs.readdirSync(path);
        app.forEach((file) => {
            if (fs.statSync(path + file).isDirectory()) {
                const p = path + file;
                const makeup = p.substr(__dirname.length, p.length);
                const des = this.destination() + makeup;
                this.dirs.push(des);
                this.readDir(path + file + '/');
            } else {
                const P = path + file;
                const des = this.destination() + P.substring(__dirname.length, P.length);
                this.files.push({ src: P, des: des });
            }
        })
    }
}




