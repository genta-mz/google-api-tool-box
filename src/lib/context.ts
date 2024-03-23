import { PromiseRunner } from './helper';
import { GoogleAuthorizer } from './auth';

export interface GoogleAPIContext {
  authorizer: GoogleAuthorizer;
  runner: PromiseRunner;
}
