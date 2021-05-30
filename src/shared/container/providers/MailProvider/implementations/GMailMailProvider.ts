import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';
import { injectable } from 'tsyringe';

import { IMailProvider } from '../IMailProvider';

@injectable()
class GMailMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      host: process.env.GMAIL_MAIL_HOST,
      port: Number(process.env.GMAIL_MAIL_PORT),
      secure: false,

      auth: {
        user: process.env.GMAIL_MAIL_USER,
        pass: process.env.GMAIL_MAIL_PASS,
      },
    });
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

    await this.client.sendMail({
      to,
      from: 'Financial <noreply@financial.com.br>',
      subject,
      html: templateHTML,
    });
  }
}

export { GMailMailProvider };
