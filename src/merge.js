const fs = require('fs');
const jsYaml = require('js-yaml');
const logger = require('./colorCli');
const mergeYaml = require('merge-yaml');
const path = require('path');

const scanFolder = (inputPath, results) => {
    if (!fs.existsSync(inputPath)) {
        logger.warn("The directory path is wrong.", path);
        return;
    }
    const files = fs.readdirSync(inputPath);
    for (let i = 0; i < files.length; i++) {
        const filename = path.join(inputPath, files[i]);
        const stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            scanFolder(filename, results);
        }
        else if (new RegExp('\.y.?ml$').test(filename)) {
            results.push(filename);
        }
    }
};

const getYmlFiles = (path) => {
    let files = [];
    logger.debug('Finding the yml template files...');
    scanFolder(path, files);
    logger.info('Found yml files:');
    for (i in files) {
        logger.info(files[i]);
    }
    return files;
};

const getMergedJsObject = (files) => {

    return mergeYaml(files);
};

const getYamlFromJsObject = (jsObject) => {
    return jsYaml.safeDump(jsObject);
};


const templateVersionRegex = new RegExp('^AWSTemplateFormatVersion:');
const isTemplateVersion = (line) => templateVersionRegex.test(line);

const transformRegex = new RegExp('^Transform:');
const isTransform = (line) => transformRegex.test(line);

const getReorderedYmlForCfnTemplateInArray = (ymlContent) => {
    const array = ymlContent.toString().split("\n");
    let indexOfHead = -1;
    let indexOfTransform = -1;
    for (let i = 0; i < array.length; i++) {
        if (isTemplateVersion(array[i])) {
            indexOfHead = i;
            continue;
        }
        if (isTransform(array[i])) {
            indexOfTransform = i;
            continue;
        }
    }
    if (indexOfHead === -1) {
        logger.error(`Error: couldn't get the AWSTemplateFormatVersion.`);
        return;
    }
    if (indexOfTransform !== -1) {
        if (indexOfTransform > indexOfHead) {
            indexOfHead = indexOfHead + 1;
        }
        let transform = array.splice(indexOfTransform, 1);
        array.unshift(transform[0]);
    }
    let head = array.splice(indexOfHead, 1);
    array.unshift(head[0]);
    return array;
};

const blankRegex = new RegExp('/^\\s*$/');
const isBlankLine = (line) => blankRegex.test(line);

const writeMergedYmlFile = (array, mergedFile) => {
    logger.debug('Writing to ' + mergedFile);
    let str = '';
    for (i in array) {
        if (!isBlankLine(array[i])) {
            str = str.concat(array[i] + '\n');
        }
    }
    try {
        fs.writeFileSync(mergedFile, str);
    } catch (err) {
        throw Error('Failed to write to the target file');
    }
};

exports.default = (path, targetFile) => {
    if (path === undefined || path === '' || !path.startsWith('/')) {
        logger.error('The path should be valid.');
        throw Error();
    }
    if (!fs.existsSync(path) || !fs.lstatSync(path).isDirectory()) {
        logger.error('The path should be a directory.');
        throw Error();
    }
    if (targetFile === undefined || targetFile === '' || !targetFile.startsWith('/')) {
        logger.error('The target file should be valid.');
        throw Error();
    }
    const ymlFiles = getYmlFiles(path);
    if (ymlFiles === undefined || ymlFiles.length === 0) {
        logger.error('No yaml file found');
        throw Error();
    }
    const mergedJsObject = getMergedJsObject(ymlFiles);
    //Javascript doesn't guarantee the order of the properties in objects.So, convert to yml and then reorder the content.
    const mergedYamlContent = getYamlFromJsObject(mergedJsObject);
    const reorderedYmlContentInArray = getReorderedYmlForCfnTemplateInArray(mergedYamlContent);
    writeMergedYmlFile(reorderedYmlContentInArray, targetFile);
};
