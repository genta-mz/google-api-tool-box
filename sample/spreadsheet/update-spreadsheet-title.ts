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
    .option('spreadsheetId', {
      type: 'string',
      alias: 's',
      description: 'SpreadsheetId',
      demandOption: true,
    })
    .option('title', {
      type: 'string',
      alias: 't',
      description: 'New Spreadsheet title.',
      demandOption: true,
    })
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  await toolBox.spreadSheet.updateSpreadsheetTitle({
    spreadsheetId: argv.spreadsheetId,
    title: argv.title,
  });
})();
