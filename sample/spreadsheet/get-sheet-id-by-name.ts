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

  const sheetId = await toolBox.spreadSheet.getSheetIdByName({
    spreadsheetId: argv.spreadsheetId,
    sheetName: argv.sheetName,
  });

  console.log(sheetId);
})();
