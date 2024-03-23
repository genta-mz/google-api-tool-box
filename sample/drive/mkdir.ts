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
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  const result = await toolBox.drive.mkdir({ folderId: argv.folderId, folderPath: 'path/to/dir' });
  if (!result) {
    throw new Error('Can not create folder.');
  }

  console.log(`${result.id},${result.name}`);
})();
