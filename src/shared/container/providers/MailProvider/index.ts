import { container } from 'tsyringe';

import { IMailProvider } from './IMailProvider';
import { EtherealMailProvider } from './implementations/EtherealMailProvider';
import { GMailMailProvider } from './implementations/GMailMailProvider';

const mailProvider = {
  ethereal: container.resolve(EtherealMailProvider),
  gmail: container.resolve(GMailMailProvider),
};

container.registerInstance<IMailProvider>(
  'MailProvider',
  mailProvider[process.env.MAIL_PROVIDER],
);
