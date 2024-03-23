import { GoogleAPIToolBox } from '../../src';
import yargs from 'yargs';

(async () => {
  const argv = await yargs
    .option('keyFile', {
      type: 'string',
      alias: 'k',
      description: 'Path to service account key file',
      demandOption: true,
    })
    .option('fileId', {
      type: 'string',
      alias: 'd',
      description: 'Download file id',
      demandOption: true,
    })
    .option('filePath', {
      type: 'string',
      alias: 'f',
      description: 'Path to download file',
      demandOption: true,
    })
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  await toolBox.drive.download({
    fileId: argv.fileId,
    downloadFilePath: argv.filePath,
  });
})();
