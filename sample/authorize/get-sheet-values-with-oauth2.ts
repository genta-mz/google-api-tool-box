import { join } from 'path';
import { GoogleAPIToolBox, getAuth2ClientToken } from '../../src';
import yargs from 'yargs';

(async () => {
  const argv = await yargs
    .option('clientSecretPath', {
      type: 'string',
      alias: 'c',
      description: 'Path to OAuth2 Client secret json',
      demandOption: true,
    })
    .option('tokenDir', {
      type: 'string',
      alias: 't',
      description: 'Path to install token files',
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

  await await getAuth2ClientToken({
    clientSecretPath: argv.clientSecretPath,
    outDir: argv.tokenDir,
    // click this url and authorize
    onAuthorize: (url) => console.log(url),
  });

  const toolBox = new GoogleAPIToolBox({
    auth: {
      OAuth2: {
        tokenJsonFile: join(argv.tokenDir, 'token.json'),
        clientSecretJsonFile: join(argv.tokenDir, 'client-secret.json'),
      },
    },
  });

  const ranges = await toolBox.spreadSheet.getSheetValues({
    spreadsheetId: argv.spreadsheetId,
    range: argv.sheetName,
  });

  const values = ranges.get(argv.sheetName);
  if (!values) {
    throw new Error('Sheet name or range not found.');
  }

  for (const row of values) {
    console.log(row.join(','));
  }
})();
