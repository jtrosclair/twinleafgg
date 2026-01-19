//@ts-ignore
import { EmailTemplate } from './email-template';

export class Mailer {

  public async sendEmail(
    email: string,
    template: EmailTemplate,
    params: { [key: string]: string }
  ): Promise<void> {

    return;

  }

}