import { google, Auth } from 'googleapis';
import { resolve } from 'path';
import { API_SCOPE } from './const';
import { readJSONSync } from 'fs-extra';

export interface AuthOption {
  serviceAccountKeyFile?: string;
  OAuth2?: {
    tokenJsonFile: string;
    clientSecretJsonFile: string;
  };
}

export class GoogleAuthorizer {
  private readonly option: AuthOption;

  constructor(option: AuthOption) {
    this.option = option;
  }

  public createClient() {
    if (this.option.serviceAccountKeyFile) {
      const client = new Auth.GoogleAuth({
        keyFile: resolve(this.option.serviceAccountKeyFile),
        scopes: API_SCOPE,
      });

      return client;
    }
    if (this.option.OAuth2) {
      const clientSecret = readJSONSync(resolve(this.option.OAuth2.clientSecretJsonFile), { encoding: 'utf-8' });
      const tokens = readJSONSync(resolve(this.option.OAuth2.tokenJsonFile), { encoding: 'utf-8' });
      const client = new google.auth.OAuth2(`${clientSecret.client_id}`, `${clientSecret.client_secret}`);
      client.credentials = tokens;

      return client;
    }

    throw new Error('Please set up some authentication information');
  }
}
