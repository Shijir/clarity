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
 * @desk read directory content and return list of files names
 * @param {string} rawPath: path of directory
 * @resolve {string[]}: file names in the directory
 * @reject {err}
 * */
let readDirContent = (rawPath) => {

    let absolutePath = path.resolve(rawPath);

    return new Promise((resolve, reject)=> {

        fs.readdir(absolutePath, (err, files)=> {

            if (err) reject(err);

            resolve(files);

        });

    });

};

/*
 * @desk reads file names and return their unique prefixes
 * @param {string[]} fileNamesParam: all file names
 * @return {string[]} prefixes
 * */
let getIconNames = (fileNamesParam) => {

    let lineSuffix = "_line.svg";
    let lineAlertSuffix = "_line_alert.svg";
    let lineBadgeSuffix = "_line_badge.svg";

    let solidSuffix = "_solid.svg";
    let solidAlertSuffix = "_solid_alert.svg";
    let solidBadgeSuffix = "_solid_badge.svg";

    let iconNamesWithDuplicates = fileNamesParam.map((fileName)=> {


        if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(lineSuffix)) {
            return fileName.replace(lineSuffix, "");

        }
        else if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(lineAlertSuffix)) {
            return fileName.replace(lineAlertSuffix, "");

        }
        else if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(lineBadgeSuffix)) {
            return fileName.replace(lineBadgeSuffix, "");

        }
        else if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(solidSuffix)) {
            return fileName.replace(solidSuffix, "");

        }
        else if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(solidAlertSuffix)) {
            return fileName.replace(solidAlertSuffix, "");

        }
        else if (!/[A-Z0-9]/.test(fileName) && fileName.endsWith(solidBadgeSuffix)) {
            return fileName.replace(solidBadgeSuffix, "");

        }
        else {
            console.error(`'${fileName}' doesn't qualify as a standard name for icon files.`);
        }

    });

    let iconSet = new Set(iconNamesWithDuplicates);
    return Array.from(iconSet.values());

};

/*
 * @desk read and return the file content
 * @param {string} path of file
 * @return {string} file content
 * */
let readFileContent = (pathToIconsParam, fileNameParam) => {

    return new Promise((resolve, reject)=> {

        fs.readFile(path.join(pathToIconsParam, fileNameParam), "utf-8", (err, data) => {
            if (err) reject(err);

            resolve({"fileName": fileNameParam, "content": data});
        });

    });

};

readDirContent(pathToIcons)
    .then((fileNames)=> {
        return Promise.all(fileNames.map((fileName)=> {

            return readFileContent(pathToIcons, fileName);

        }));

    })
    .then((fileContents)=> {

        console.log(fileContents);

    })
    .catch((error)=> {
        console.log(error);
    });

