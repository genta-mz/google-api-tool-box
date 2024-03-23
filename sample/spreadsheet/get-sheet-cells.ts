import { GoogleAPIToolBox } from '../../src';
import yargs from 'yargs';
import { CellInfo } from '../../src/lib/spreadsheet';

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

  const ranges = await toolBox.spreadSheet.getSheetCells({
    spreadsheetId: argv.spreadsheetId,
    range: argv.sheetName,
  });

  const values = ranges.get(argv.sheetName);
  if (!values) {
    throw new Error('Sheet name or range not found.');
  }

  const createStyleText = (info: CellInfo) =>
    `w:${info.width},r:${info.cell.effectiveFormat?.backgroundColor?.red},g:${info.cell.effectiveFormat?.backgroundColor?.green},b:${info.cell.effectiveFormat?.backgroundColor?.blue}`;
  for (const row of values) {
    console.log(row.map((info) => `${info.cell.formattedValue}/${createStyleText(info)}`).join(','));
  }
})();
