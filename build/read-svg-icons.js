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
let getIconName = (fileNameParam) => {

    let lineSuffix = "_line.svg";
    let lineAlertSuffix = "_line_alert.svg";
    let lineBadgeSuffix = "_line_badge.svg";

    let solidSuffix = "_solid.svg";
    let solidAlertSuffix = "_solid_alert.svg";
    let solidBadgeSuffix = "_solid_badge.svg";


    if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineSuffix)) {
        return fileNameParam.replace(lineSuffix, "");

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineAlertSuffix)) {
        return fileNameParam.replace(lineAlertSuffix, "");

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineBadgeSuffix)) {
        return fileNameParam.replace(lineBadgeSuffix, "");

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidSuffix)) {
        return fileNameParam.replace(solidSuffix, "");

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidAlertSuffix)) {
        return fileNameParam.replace(solidAlertSuffix, "");

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidBadgeSuffix)) {
        return fileNameParam.replace(solidBadgeSuffix, "");

    }
    else {

        console.error(`'${fileNameParam}' doesn't qualify as a standard name for icon files.`);
        return "";

    }


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

/*
 * @desc wraps the svg elements with the proper svg element tag and gives it a title
 * @param {string} shapeTitle: The text to be used inside title tag
 * @param {string} shapeContent: The svg elements to be used for creating a svg icon.
 * @return {string} A valid string representation of svg icon.
 * */

let makeSVG = (shapeTitle, shapeContent) => {

    let openingTag = `<svg version="1.1" viewBox="0 0 36 36" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`;
    let title = `<title>${shapeTitle}</title>`;
    let closingTag = `</svg>`;

    return `${openingTag}
                ${title}
                ${shapeContent}
            ${closingTag}`;


};

let prepareIconContent = (shapeContent) => {

    $ = cheerio.load(shapeContent);

    return $("svg").html();

};


readDirContent(pathToIcons)
    .then((fileNames)=> {
        return Promise.all(fileNames.map((fileName)=> {

            return readFileContent(pathToIcons, fileName);

        }));

    })
    .then((iconFileObjs)=> {

        let icons = {};

        iconFileObjs.map((iconFileObj)=> {
            let iconName = getIconName(iconFileObj["fileName"]);

            if (iconName !== "" && icons[iconName] !== undefined) {
                //exist
            } else {
                icons[iconName] = prepareIconContent(iconFileObj["content"]);
            }

        });

        console.log(icons);


    })
    .catch((error)=> {
        console.log(error);
    });

