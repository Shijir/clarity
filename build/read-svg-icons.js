/*
 * Copyright (c) 2016 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */


const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const targetFileType = ".svg";
const separatorCaseChar = "_";

let lineSuffix = separatorCaseChar + "line" + targetFileType;
let lineAlertSuffix = separatorCaseChar + "line_alert" + targetFileType;
let lineBadgeSuffix = separatorCaseChar + "line_badge" + targetFileType;

let solidSuffix = separatorCaseChar + "solid" + targetFileType;
let solidAlertSuffix = separatorCaseChar + "solid_alert" + targetFileType;
let solidBadgeSuffix = separatorCaseChar + "solid_badge" + targetFileType;

let alertPathValue = "M26.85,1.14,21.13,11A1.28,1.28,0,0,0,22.23,13H33.68A1.28,1.28,0,0,0,34.78,11L29.06,1.14A1.28,1.28,0,0,0,26.85,1.14Z";


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

let prepareIconContent = (fileNameParam, fileContentParam) => {


    let elements = fileContentParam.match(/(<((title|path|circle|rect|line|polygon|polyline|ellipse)[^>]+\/>))/ig);


    if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineSuffix)) {
        return elements.map((element, index)=> {
            return element
                .replace(/(\/>)/ig, ` class="clr-i-outline clr-i-outline-path-${index + 1}" />`)
                .replace(/fill="\#[a-z0-9]+"/ig, "");
        });
    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineAlertSuffix)) {

        return elements.map((element, index)=> {

            if (element.includes(alertPathValue)) {

                return element
                    .replace(/(\/>)/ig, ` class="clr-i-outline--alerted clr-i-outline-path-${index + 1}--alerted clr-i-alert" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");

            } else {

                return element
                    .replace(/(\/>)/ig, ` class="clr-i-outline--alerted clr-i-outline-path-${index + 1}--alerted" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");

            }
        });

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(lineBadgeSuffix)) {

        return elements.map((element, index)=> {
            if (element.includes("circle") && element.includes(`r="5"`)) {
                return element
                    .replace(/(\/>)/ig, ` class="clr-i-outline--badged clr-i-outline-path-${index + 1}--badged clr-i-badge" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");
            } else {
                return element
                    .replace(/(\/>)/ig, ` class="clr-i-outline--badged clr-i-outline-path-${index + 1}--badged" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");
            }
        });

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidSuffix)) {

        return elements.map((element, index)=> {
            return element
                .replace(/(\/>)/ig, ` class="clr-i-solid clr-i-solid-path-${index + 1}" />`)
                .replace(/fill="\#[a-z0-9]+"/ig, "");
        });

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidAlertSuffix)) {

        return elements.map((element, index)=> {
            if (element.includes(alertPathValue)) {

                return element
                    .replace(/(\/>)/ig, ` class="clr-i-solid--alerted clr-i-solid-path-${index + 1}--alerted clr-i-alert" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");

            } else {

                return element
                    .replace(/(\/>)/ig, ` class="clr-i-solid--alerted clr-i-solid-path-${index + 1}--alerted" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");

            }
        });

    }
    else if (!/[A-Z0-9]/.test(fileNameParam) && fileNameParam.endsWith(solidBadgeSuffix)) {

        return elements.map((element, index)=> {
            if (element.includes("circle") && element.includes(`r="5"`)) {
                return element
                    .replace(/(\/>)/ig, ` class="clr-i-solid--badged clr-i-solid-path-${index + 1}--badged clr-i-badge" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");
            } else {
                return element
                    .replace(/(\/>)/ig, ` class="clr-i-solid--badged clr-i-solid-path-${index + 1}--badged" />`)
                    .replace(/fill="\#[a-z0-9]+"/ig, "");
            }
        });

    }
    else {

    }

};


readDirContent(pathToIcons)
    .then((fileNames)=> {
        return Promise.all(fileNames.map((fileName)=> {

            return readFileContent(pathToIcons, fileName);

        }));

    })
    .then((iconFileObjs)=> {

        let iconsWithArrayContent = {};

        iconFileObjs.map((iconFileObj)=> {

            let iconName = getIconName(iconFileObj["fileName"]);

            if (iconName !== "" && iconsWithArrayContent[iconName] !== undefined) {
                iconsWithArrayContent[iconName] = iconsWithArrayContent[iconName].concat(prepareIconContent(iconFileObj["fileName"], iconFileObj["content"]));
            } else {
                iconsWithArrayContent[iconName] = prepareIconContent(iconFileObj["fileName"], iconFileObj["content"]);
            }

        });

        let iconNames = Object.keys(iconsWithArrayContent);

        let icons = {};

        iconNames.map((iconName)=> {


            if (iconName !== "") {

                let iconContent = iconsWithArrayContent[iconName].reduce((accumulator, currentValue)=> {

                    return `${accumulator}
                            ${currentValue}`;

                });

                icons[iconName] = makeSVG(iconName, iconContent);
            }

        });

        console.log(icons);


    })
    .catch((error)=> {
        console.log(error);
    });

