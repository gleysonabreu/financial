import { container } from 'tsyringe';

import { LocalStorageProvider } from './implementations/LocalStorageProvider';
import { IStorageProvider } from './IStorageProvider';

const storage = {
  local: LocalStorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  storage[process.env.STORAGE_PROVIDER],
);
