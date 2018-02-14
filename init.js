const fs = require('fs');
const logger = require('./lib/logger');

const commandMap = {
    '-init': '创建新项目，example：burn-cli -init BurnProject-example',
    '-init-ts': '创建新一个ts项目，example：burn-cli -init-ts BurnProject-example'
}

module.exports = class BurnInit {

    constructor(currentDir, argv) {
        this.appPath = __dirname + '/js/';
        this.currentDir = currentDir;
        this.argv = argv;
        this.project = argv[1];
        this.type = argv[0];
        this.files = [];
        this.dirs = [];
        this.appVersion = '1.0.16'
        this.command = {
            "-init": '-init',
            "-init-ts": "-init-ts"
        }
        this.logger = new logger;
        this.pkg = {
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
                "burnjs": this.appVersion,
                "nodemon": "^1.14.11"
            }
        }

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
                return cm + '\n' + commandMap[cm] + '\n\n'
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

    '-init-ts'() {
        fs.mkdirSync(this.destination());//构建project
        fs.mkdirSync(this.destination() + '/ts');//构建下的app
        this.cpySrc(__dirname + '/ts/');//复制app下的所有内容到目标目录
        this.writeTs();
        fs.renameSync(this.destination() + '/ts', this.destination() + '/src');
    }

    '-init'() {
        fs.mkdirSync(this.destination());//构建project
        fs.mkdirSync(this.destination() + '/js');//构建下的app
        this.cpySrc(this.appPath);//复制app下的所有内容到目标目录
        this.write();
        fs.renameSync(this.destination() + '/js', this.destination() + '/app');
    }

    output(des, json) {
        fs.writeFileSync(this.destination() + '/' + des, JSON.stringify(json, null, 4));
    }

    writeTs() {
        const nodemon = {
            "ignore": [
                "**/*.test.ts",
                "**/*.spec.ts",
                ".git",
                "node_modules"
            ],
            "watch": [
                "src"
            ],
            "exec": "tsc&&node  NODE_ENV=development app/start.js",
            "ext": "ts"
        }
        const ts = {
            "compilerOptions": {
                "module": "commonjs", //指定生成哪个模块系统代码
                "target": "es2017", //目标代码类型
                "noImplicitAny": true, //在表达式和声明上有隐含的'any'类型时报错。
                "sourceMap": false, //用于debug   
                // "rootDir": "./build", //仅用来控制输出的目录结构--outDir。
                "outDir": "./app", //重定向输出目录。   
                "watch": false, //在监视模式下运行编译器。会监视输出文件，在它们改变时重新编译。
                "noUnusedLocals": true,
                "strict": true,
                "strictPropertyInitialization": false,//不限制属性初始化
                "experimentalDecorators": true
            },
            "include": [
                "src/**/*",
                // "test/**/*"
            ]
        }

        this.output("package.json", this.pkg);
        this.output("nodemon.json", nodemon);
        this.output("tsconfig.json", ts);
        this.output('.gitignore', 'node_modules');
    }

    write() {
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
        this.output("package.json", this.pkg);
        this.output("nodemon.json", nodemon);
    }

    cpySrc(appPath) {
        this.readDir(appPath);
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


