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

  const result = await toolBox.drive.list({ folderId: argv.folderId });
  for (const item of result) {
    console.log(`${item.id},${item.name},${item.type},${item.mimetype}`);
  }
})();
