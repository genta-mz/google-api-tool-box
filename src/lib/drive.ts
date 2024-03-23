import { google, drive_v3 } from 'googleapis';
import { createReadStream } from 'fs';
import { basename, resolve, sep } from 'path';
import { GoogleAPIContext } from './context';
import { createWriteStream } from 'fs-extra';

export enum DriveItemType {
  File,
  Folder,
}

export class DriveItem {
  public readonly type: DriveItemType;
  public readonly mimetype?: string;
  public readonly id?: string;
  public readonly name?: string;
  public readonly resourceKey?: string;

  constructor(file: drive_v3.Schema$File) {
    this.type = (() => {
      if (file.mimeType == 'application/vnd.google-apps.folder') {
        return DriveItemType.Folder;
      }

      return DriveItemType.File;
    })();

    this.mimetype = file.mimeType || undefined;
    this.id = file.id || undefined;
    this.name = file.name || undefined;
    this.resourceKey = file.resourceKey || undefined;
  }
}

export interface UploadParams {
  /**
   * Parent folderId
   */
  folderId?: string;
  /**
   * Path to upload file
   */
  filePath: string;
  /**
   * mimeType
   */
  mimeType: string;
}

export interface DownloadParams {
  /**
   * Download file id
   */
  fileId: string;
  /**
   * Download file path
   */
  downloadFilePath: string;
}

export interface MkdirParams {
  /**
   * Parent folderId
   */
  folderId?: string;
  /**
   * Create folder path
   */
  folderPath: string;
}

export interface ListParams {
  /**
   * Parent folderId
   */
  folderId?: string;
}

export class GoogleDriveFacade {
  private readonly context: GoogleAPIContext;

  constructor(context: GoogleAPIContext) {
    this.context = context;
  }

  /**
   * Upload your files on GoogleDrive.
   *
   * @param param
   * @returns
   */
  public async upload(param: UploadParams) {
    const response = await this.context.runner.withRetry(() =>
      google.drive('v3').files.create({
        auth: this.context.authorizer.createClient(),
        requestBody: {
          parents: param.folderId ? [param.folderId] : undefined,
          name: basename(param.filePath),
        },
        media: { mimeType: param.mimeType, body: createReadStream(resolve(param.filePath)) },
      })
    );

    return response.data;
  }

  /**
   * Download files from GoogleDrive.
   *
   * @param param
   * @returns
   */
  public async download(params: DownloadParams) {
    await this.context.runner.withRetry(async () => {
      const stream = createWriteStream(resolve(params.downloadFilePath));
      const response = await google
        .drive('v3')
        .files.get(
          { auth: this.context.authorizer.createClient(), fileId: params.fileId, alt: 'media' },
          { responseType: 'stream' }
        );

      return new Promise<void>((resolve, reject) => {
        try {
          response.data.on('data', (chunk) => stream.write(chunk));
          response.data.on('end', () => {
            stream.end();
            resolve();
          });
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /**
   * Create a folder hierarchy on GoogleDrive.
   *
   * @detail If the folder does not exist, it is created recursively
   * @param param
   * @returns
   */
  public async mkdir(param: MkdirParams) {
    const dirs = param.folderPath.split(sep);

    let rootInfo: { id: string; name: string } | undefined = undefined;
    let folderId = param.folderId;
    for (const d of dirs) {
      const response = await this.context.runner.withRetry(() =>
        google.drive('v3').files.create({
          auth: this.context.authorizer.createClient(),
          requestBody: {
            parents: folderId ? [folderId] : undefined,
            name: d,
            mimeType: 'application/vnd.google-apps.folder',
          },
        })
      );

      folderId = response.data.id || undefined;
      if (!rootInfo) {
        rootInfo = { id: folderId || '', name: d };
      }
    }

    return rootInfo;
  }

  /**
   * List items in a GoogleDrive folder.
   *
   * @param param
   * @returns
   */
  public async list(param: ListParams) {
    const response = await this.context.runner.withRetry(() =>
      google
        .drive('v3')
        .files.list({ auth: this.context.authorizer.createClient(), q: `'${param.folderId}' in parents` })
    );

    return (response.data.files || []).map((f) => new DriveItem(f));
  }
}
