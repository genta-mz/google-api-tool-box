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
    .option('sheetId', {
      type: 'number',
      alias: 'i',
      description: 'Sheet id or range specification',
      demandOption: true,
    })
    .help().argv;

  const toolBox = new GoogleAPIToolBox({ auth: { serviceAccountKeyFile: argv.keyFile } });

  await toolBox.spreadSheet.updateSheetProperties({
    spreadsheetId: argv.spreadsheetId,
    requests: [
      {
        sheetId: argv.sheetId,
        properties: {
          title: 'New Title',
          tabColor: { red: 1, green: 0, blue: 1 },
        },
      },
    ],
  });
})();
