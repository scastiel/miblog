
import path from 'path';
import fs from 'fs-promise';
import fse from 'fs-extra';
import promisify from './util/promisify';

export default class FileWriter {
    constructor(outputDirectory) {
        this.outputDirectory = outputDirectory;
    }
    async writeFile(fileObject) {
        const filePath = fileObject.directory
            ? path.join(this.outputDirectory, fileObject.directory, fileObject.file)
            : path.join(this.outputDirectory, fileObject.file);
        await fs.writeFile(filePath, fileObject.content, 'utf-8');
    }
    async copyFile(fileObject) {
        const srcPath = [ fileObject.basePath ];
        const dstPath = [ this.outputDirectory ];
        if (fileObject.directory) {
            srcPath.push(fileObject.directory);
            dstPath.push(fileObject.directory);
        }
        if (fileObject.path) {
            srcPath.push(fileObject.path);
            dstPath.push(fileObject.path);
        }
        const src = path.join(... srcPath);
        const dst = path.join(... dstPath);
        await promisify(::fse.copy)(src, dst);
    }
    async createDirectory(directory) {
        await promisify(::fse.mkdirs)(directory);
    }
}
