// const fs = require('fs');
// const readline = require('readline');
// const { FileSystem } = require('./File.js');
import fs from 'fs';
import readline from 'readline';
import { FileSystem } from './File.js';


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const fileSystem = new FileSystem();

function processCommand(line) {
    const [command, ...args] = line.trim().split(" ");
    switch (command) {
        case 'mkdir':
            fileSystem.mkdir(args[0]);
            break;
        case 'cd':
            fileSystem.cd(args[0]);
            break;
        case 'ls':
            fileSystem.ls();
            break;
        case 'touch':
            fileSystem.touch(args[0]);
            break;
        case 'cat':
            fileSystem.cat(args[0]);
            break;
        case 'echo':
            fileSystem.echo(args.slice(0, -1).join(' '), args[args.length - 1]);
            break;
        case 'mv':
            fileSystem.mv(args[0], args[1]);
            break;
        case 'cp':
            fileSystem.cp(args[0], args[1]);
            break;
        case 'rm':
            fileSystem.rm(args[0]);
            break;
        case 'exit':
            rl.close();
            break;
        default:
            console.log(`Unknown command: ${command}`);
    }
}

console.log("In-Memory File System CLI. Type 'exit' to quit.");
rl.on('line', processCommand);
