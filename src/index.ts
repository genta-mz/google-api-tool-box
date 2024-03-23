import { AuthOption, GoogleAuthorizer } from './lib/auth';
import { GoogleAPIContext } from './lib/context';
import { GoogleDriveFacade } from './lib/drive';
import { ErrorConfig, PromiseRunner } from './lib/helper';
import { GoogleSpreadsheetFacade } from './lib/spreadsheet';

export class GoogleAPIToolBox {
  public readonly spreadSheet: GoogleSpreadsheetFacade;
  public readonly drive: GoogleDriveFacade;

  constructor(options: { auth: AuthOption; errorConfig?: ErrorConfig }) {
    const context: GoogleAPIContext = {
      authorizer: new GoogleAuthorizer(options.auth),
      runner: new PromiseRunner(options.errorConfig),
    };

    this.spreadSheet = new GoogleSpreadsheetFacade(context);
    this.drive = new GoogleDriveFacade(context);
  }
}
