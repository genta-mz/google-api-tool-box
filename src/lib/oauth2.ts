import { resolve } from 'path';
import { readJSONSync, mkdirpSync, writeJSONSync } from 'fs-extra';
import { google } from 'googleapis';
import { createServer } from 'http';
import { join } from 'path';
import { API_SCOPE } from './const';

export function getAuth2ClientToken(params: {
  clientSecretPath: string;
  outDir: string;
  onAuthorize: (url: string) => void;
}) {
  const clientSecret = readJSONSync(resolve(params.clientSecretPath));
  const client = new google.auth.OAuth2(
    `${clientSecret.installed.client_id}`,
    `${clientSecret.installed.client_secret}`,
    'http://localhost:3000'
  );

  const authUrl = client.generateAuthUrl({
    access_type: 'offline',
    scope: API_SCOPE,
  });

  params.onAuthorize(authUrl);

  return new Promise<void>((resolve, reject) => {
    const server = createServer(async (req, res) => {
      try {
        const qs = new URL(req.url || '', 'http://localhost:3000').searchParams;
        const code = qs.get('code');

        if (!code) {
          throw new Error(`Invalid code. ${code}`);
        }

        mkdirpSync(params.outDir);

        const tokenResponse = await client.getToken(code);
        {
          const savePath = join(params.outDir, 'client-secret.json');

          writeJSONSync(savePath, clientSecret.installed, { encoding: 'utf-8' });
          console.log(savePath);
        }
        {
          const savePath = join(params.outDir, 'token.json');

          writeJSONSync(savePath, tokenResponse.tokens, { encoding: 'utf-8' });
          console.log(savePath);
        }

        res.end('Success!');
        resolve();
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`${e}`);
        reject(e);
      }

      server.close();
    });

    server.listen(3000);
  });
}
