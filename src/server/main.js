
import path from 'path';
import program from 'commander';
import fs from 'fs-promise';
import Miblog from './Miblog';

function die(message) {
    console.error(message);
    process.exit(1);
}

async function main() {
    let outputDirectory;
    program
        .description('Generates your blog\'s static files.')
        .usage('[options] <output_directory>')
        .option('-f, --config-file <path>', 'specify a config file (default: ./miblog.conf)')
        .action(_outputDirectory => outputDirectory = _outputDirectory)
        .parse(process.argv);

    if (!outputDirectory) {
        die('Output directory is required.');
    }

    const configFile = path.resolve(program.configFile || 'miblog.conf.js');
    if (!await fs.exists(configFile)) {
        die(`File not found: ${configFile}`);
    }
    const config = require(configFile);
    const blog = new Miblog(config);
    try {
        await blog.generate(outputDirectory);
        console.log(`Files generated in ${outputDirectory}.`); //eslint-disable-line
    } catch (err) {
        console.error(err.stack);
    }
}

main();
