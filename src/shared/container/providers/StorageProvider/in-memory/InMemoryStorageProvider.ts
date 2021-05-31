import { IStorageProvider } from '../IStorageProvider';

class InMemoryStorageProvider implements IStorageProvider {
  private files: any[] = [];

  async save(file: string, folder: string): Promise<string> {
    this.files.push({
      folder,
      file,
    });

    return file;
  }

  async delete(file: string, folder: string): Promise<void> {
    const findFile = this.files.find(
      f => f.file === file && f.folder === folder,
    );

    this.files.splice(this.files.indexOf(findFile));
  }
}

export { InMemoryStorageProvider };
