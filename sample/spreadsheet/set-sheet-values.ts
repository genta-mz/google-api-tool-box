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
      description: 'Spreadsheet id',
      demandOption: true,
    })
    .option('sheetName', {
      type: 'string',
      alias: 'n',
      description: 'Sheet name or range specification',
      demandOption: true,
    })
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  await toolBox.spreadSheet.setSheetValues({
    spreadsheetId: argv.spreadsheetId,
    range: argv.sheetName,
    rows: [
      ['name', 'country', 'email'],
      ['jonathan', 'us', 'jonathan@email.com'],
      ['hanako', 'ja', 'hanako@email.com'],
    ],
  });
})();
