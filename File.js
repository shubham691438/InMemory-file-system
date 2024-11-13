import chalk from "chalk";

class File {
    constructor(name, content = '') {
        this.name = name;
        this.content = content;
    }

    write(content) {
        this.content = content;
    }

    read() {
        return this.content;
    }
}

class Directory {
    constructor(name) {
        this.name = name;
        this.contents = {}; 
    }

    add(item) {
        this.contents[item.name] = item;
    }

    get(name) {
        return this.contents[name];
    }

    remove(name) {
        delete this.contents[name];
    }

    list() {
        return Object.keys(this.contents);
    }
}

export class FileSystem {
    constructor() {
        this.root = new Directory('/');
        this.currentDir = this.root;
    }

    mkdir(name) {
        try {
            if (this.currentDir.get(name)) {
                console.log(chalk.red(`Directory ${name} already exists.`));
            } else {
                this.currentDir.add(new Directory(name));
                console.log(chalk.green(`Directory ${name} created.`));
            }
        } catch (error) {
            console.error(chalk.red(`Error creating directory: ${error.message}`));
        }
    }

    cd(path) {
        try {
            if (path === '/') {
                this.currentDir = this.root;
                console.log(chalk.green(`Navigated to root directory.`));
                return;
            }

            const parts = path.split('/').filter(Boolean);
            let targetDir = this.currentDir;

            for (let part of parts) {
                if (part === '..') {
                    targetDir = targetDir.parent || targetDir;
                    console.log(targetDir.parent);
                } else {
                    const nextDir = targetDir.get(part);
                    if (nextDir instanceof Directory) {
                        targetDir.parent = targetDir;
                        targetDir = nextDir;
                    } else {
                        throw new Error(`No such directory: ${part}`);
                    }
                }
            }
            this.currentDir = targetDir;
            console.log(chalk.green(`Changed directory to ${path}`));
        } catch (error) {
            console.error(chalk.red(`Error changing directory: ${error.message}`));
        }
    }

    ls() {
        try {
            const contents = this.currentDir.list();
            if (contents.length === 0) {
                console.log(chalk.yellow('Directory is empty.'));
            } else {
                contents.forEach(name => {
                    const item = this.currentDir.get(name);
                    const displayName = item instanceof Directory
                        ? chalk.blue.bold(name) // Directory names in blue
                        : chalk.cyan(name); // File names in cyan
                    console.log(displayName);
                });
            }
        } catch (error) {
            console.error(chalk.red(`Error listing directory contents: ${error.message}`));
        }
    }

    touch(name) {
        try {
            if (this.currentDir.get(name)) {
                console.log(chalk.red(`File ${name} already exists.`));
            } else {
                this.currentDir.add(new File(name));
                console.log(chalk.green(`File ${name} created.`));
            }
        } catch (error) {
            console.error(chalk.red(`Error creating file: ${error.message}`));
        }
    }

    cat(name) {
        try {
            const file = this.currentDir.get(name);
            if (file instanceof File) {
                console.log(chalk.yellow(file.read()));
            } else {
                throw new Error(`File ${name} does not exist.`);
            }
        } catch (error) {
            console.error(chalk.red(`Error reading file: ${error.message}`));
        }
    }

    echo(content, name) {
        try {
            let file = this.currentDir.get(name);
            if (!file) {
                file = new File(name);
                this.currentDir.add(file);
            }
            file.write(content);
            console.log(chalk.green(`Content written to ${name}`));
        } catch (error) {
            console.error(chalk.red(`Error writing content to file: ${error.message}`));
        }
    }

    mv(source, destination) {
        try {
            const item = this.currentDir.get(source);
            if (item) {
                this.currentDir.remove(source);
                const destDir = this._getDirectory(destination);
                destDir.add(item);
                console.log(chalk.green(`${source} moved to ${destination}`));
            } else {
                throw new Error(`No such file or directory: ${source}`);
            }
        } catch (error) {
            console.error(chalk.red(`Error moving item: ${error.message}`));
        }
    }

    cp(source, destination) {
        try {
            const item = this.currentDir.get(source);
            if (item) {
                const destDir = this._getDirectory(destination);
                if (item instanceof File) {
                    destDir.add(new File(item.name, item.read()));
                } else {
                    destDir.add(new Directory(item.name));
                }
                console.log(chalk.green(`${source} copied to ${destination}`));
            } else {
                throw new Error(`No such file or directory: ${source}`);
            }
        } catch (error) {
            console.error(chalk.red(`Error copying item: ${error.message}`));
        }
    }

    rm(name) {
        try {
            if (this.currentDir.get(name)) {
                this.currentDir.remove(name);
                console.log(chalk.green(`${name} removed.`));
            } else {
                throw new Error(`No such file or directory: ${name}`);
            }
        } catch (error) {
            console.error(chalk.red(`Error removing item: ${error.message}`));
        }
    }

    _getDirectory(path) {
        let dir = path === '/' ? this.root : this.currentDir;
        const parts = path.split('/').filter(Boolean);
        for (const part of parts) {
            if (part === '..') {
                dir = dir.parent || dir;
            } else {
                dir = dir.get(part);
            }
        }
        return dir;
    }
}
