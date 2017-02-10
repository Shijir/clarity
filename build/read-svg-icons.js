/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const targetFileType = "svg";

const pathToIcons = process.argv[2];

/*
 * @desk synchronously checks whether directory exists or not
 * @param {string} path of directory
 * @return {boolean}
 * */
let checkDirExist = (rawPath) => {

    let absolutePath = path.resolve(rawPath);
    
    if (!fs.existsSync(absolutePath)) {
        console.error(`'${absolutePath}' is not found.`);
        return false;
    }
    if (!fs.statSync(path.resolve(rawPath)).isDirectory()) {
        console.error(`'${absolutePath}' is not a directory.`);
        return false;
    }

    return true;
};

/*
 * @desk read directory content and return list of files names
 * @param {string} path of directory
 * @resolve {string[]} file names in the directory
 * @reject {err}
 * */
let readDirContent = () => {
};

/*
 * @desk reads file names and return their unique prefixes
 * @param {string[]} all file names
 * @return {string[]} prefixes
 * */
let getPrefixes = () => {
};

/*
 * @desk read and return the file content
 * @param {string} path of file
 * @return {string} file content
 * */
let readFileContent = () => {
};

console.log(checkDirExist(pathToIcons));

