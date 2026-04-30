declare module 'react-native-google-drive-api-wrapper' {
  export interface GDriveFiles {
    create(params: {
      requestBody: {name: string; mimeType?: string; parents?: string[]};
      media?: {mimeType: string; body: string};
      fields?: string;
    }): Promise<{id: string}>;

    list(params: {
      q?: string;
      orderBy?: string;
      fields?: string;
      spaces?: string;
    }): Promise<{
      files: Array<{id: string; name: string; createdTime: string; size?: string}>;
    }>;

    get(params: {fileId: string; alt?: string}): Promise<string>;
  }

  export interface IGDrive {
    files: GDriveFiles;
  }

  export interface GDriveConstructor {
    new (accessToken: string): IGDrive;
  }

  const GDrive: GDriveConstructor;
  export default GDrive;
}