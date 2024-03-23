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
    .option('folderId', {
      type: 'string',
      alias: 'p',
      description: 'Parent folderId',
      demandOption: true,
    })
    .option('filePath', {
      type: 'string',
      alias: 'f',
      description: 'Path to upload file',
      demandOption: true,
    })
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  await toolBox.drive.upload({
    folderId: argv.folderId,
    filePath: argv.filePath,
    mimeType: 'text/plain',
  });
})();
