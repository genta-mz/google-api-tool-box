import { GoogleAPIToolBox } from '../../src';
import yargs from 'yargs';
import { Cell } from '../../src/lib/spreadsheet';

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

  await toolBox.spreadSheet.updateSheets({
    spreadsheetId: argv.spreadsheetId,
    requests: [
      {
        range: `${argv.sheetName}!A2:C`,
        rows: [
          [
            new Cell('name').setBackgroundColor('#ff00ff').setFontBold(),
            new Cell('country').setBackgroundColor('#ff00ff').setFontBold(),
            new Cell('email').setBackgroundColor('#ff00ff').setFontBold(),
          ],
          ['jonathan', 'us', 'jonathan@email.com'],
          ['hanako', 'ja', 'hanako@email.com'],
        ],
      },
    ],
  });
})();
