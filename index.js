const merge = require('./src/merge').default;
const logger = require('./src/colorCli');

const args = require('yargs')
    .usage('Usage: $0 <options>')
    .example('$0 -i path -o target.yml')
    .string('i')
    .alias('i', 'path')
    .describe('i', 'The path of the folder containing the sub folders and yaml ymlFiles.')
    .demand('i')
    .string('o')
    .alias('o', 'targetFile')
    .describe('o', 'The merged yaml file')
    .demand('o')
    .strict()
    .argv;

const run = () => {
    logger.debug('Merging ...');
    try {
        merge(__dirname + '/' + args.input, __dirname + '/' + args.output);
    } catch(err) {
        logger.error('failed to merge the cloudformation yaml files ' + err);
    }
    logger.debug('Finished merge!');
};

run();

exports.default = merge;
