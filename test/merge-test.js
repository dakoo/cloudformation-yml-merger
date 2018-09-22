const chai = require('chai');
const assert = chai.assert;
const fs = require('fs');
const merge = require('../index').default;

describe('merge', function () {
    it('should support the absolute path of the folder to be scanned and the target file', (done) => {
        const outputYml = 'withVersionAndTransform-output.yml';
        try {
            merge(__dirname + '/' + 'withVersionAndTransform', __dirname + '/' + outputYml);
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
        try {
            const buf = fs.readFileSync(__dirname + '/' + outputYml).toString();
            fs.unlinkSync(__dirname + '/' + outputYml);
            const expected = fs.readFileSync('test/expectedResults/withVersionAndTransform.yml').toString();
            assert.equal(buf, expected);
            done();
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
    });

    it('should throw an error if the relative path of the folder is used.', (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge('withVersionAndTransform', __dirname + '/' + outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });

    it('should throw an error if the relative path of the target file is used.', (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge(__dirname + '/' + 'withVersionAndTransform', outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });

    it('should get rid of the empty lines in the yml templates', (done) => {
        const outputYml = 'withEmptyLines-output.yml';
        try {
            merge(__dirname + '/' + 'withEmptyLines', __dirname + '/' + outputYml);
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
        try {
            const buf = fs.readFileSync(__dirname + '/' + outputYml).toString();
            fs.unlinkSync(__dirname + '/' + outputYml);
            const expected = fs.readFileSync('test/expectedResults/withVersionAndTransform.yml').toString();
            assert.equal(buf, expected);
            done();
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
    });

    it('should merge yml files even though there is no Transform.', (done) => {
        const outputYml = 'noTransform-output.yml';
        try {
            merge(__dirname + '/' + 'noTransform', __dirname + '/' + outputYml);
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
        try {
            const buf = fs.readFileSync(__dirname + '/' + outputYml).toString();
            fs.unlinkSync(__dirname + '/' + outputYml);
            const expected = fs.readFileSync('test/expectedResults/noTransform.yml').toString();
            assert.equal(buf, expected);
            done();
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
    });

    it('should support both of the yaml and yml extension.', (done) => {
        const outputYml = 'yamlAndYml-output.yml';
        try {
            merge(__dirname + '/' + 'yamlAndYml', __dirname + '/' + outputYml);
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
        try {
            const buf = fs.readFileSync(__dirname + '/' + outputYml).toString();
            fs.unlinkSync(__dirname + '/' + outputYml);
            const expected = fs.readFileSync('test/expectedResults/withVersionAndTransform.yml').toString();
            assert.equal(buf, expected);
            done();
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
    });

    it('should support multiple resources.', (done) => {
        const outputYml = 'multipleResources-output.yml';
        try {
            merge(__dirname + '/' + 'multipleResources', __dirname + '/' + outputYml);
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
        try {
            const buf = fs.readFileSync(__dirname + '/' + outputYml).toString();
            fs.unlinkSync(__dirname + '/' + outputYml);
            const expected = fs.readFileSync('test/expectedResults/multipleResources.yml').toString();
            assert.equal(buf, expected);
            done();
        } catch(err) {
            assert.isOk(false, 'This should fail');
        }
    });

    it('should throw an error if there is no yml file.', (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge(__dirname + '/' + 'noYml', __dirname + '/' + outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });

    it('should throw an error if the input folder is not a directory.', (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge(__dirname + '/' + 'withVersionAndTransform/c.yml', __dirname + '/' + outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });

    it(`should throw an error if the input folder doesn't exist`, (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge(__dirname + '/' + 'folder-not-exists', __dirname + '/' + outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });

    it('should throw an error if no yml file has AWSTemplateFormationVersion.', (done) => {
        const outputYml = 'test-output.yml';
        try {
            merge(__dirname + '/' + 'noAWSTemplateFormatVersion', __dirname + '/' + outputYml);
            assert.isOk(false, 'This should fail');
        } catch(err) {
            done();
        }
    });
});
