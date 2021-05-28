import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

import { IMailProvider } from '../IMailProvider';

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then(account => {
        const transport = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transport;
      })
      .catch(error => console.log(error));
  }

  async sendMail(
    to: string,
    subject: string,
    variables: any,
    path: string,
  ): Promise<void> {
    const templateContent = fs.readFileSync(path).toString('utf-8');
    const templateParse = handlebars.compile(templateContent);
    const templateHTML = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: 'Financial <noreply@financial.com.br>',
      subject,
      html: templateHTML,
    });

    console.log('Message sent %s', message.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(message));
  }
}

export { EtherealMailProvider };