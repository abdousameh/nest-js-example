import * as nodemailer from 'nodemailer';
import { MAILER_CONFIG } from '../../config/global.env';
import { LoggerService } from '../../logger/logger.service';

export class MailService {
  private static readonly logger = new LoggerService(MailService.name);
  private static recipient: string;
  private static subject: string;
  private static message: string;

  sendMail(recipient: string, subject: string, message: string) {
    MailService.logger.setMethod(this.sendMail.name);
    MailService.recipient = recipient;
    MailService.subject = subject;
    MailService.message = message;
    const mailOptions = {
      from: process.env.MAILER_FROM,
      to: MailService.recipient,
      subject: MailService.subject,
      html: MailService.message,
    };

    const transporter = nodemailer.createTransport({
      host: MAILER_CONFIG.host,
      port: MAILER_CONFIG.port,
      secure: false,
      auth: {
        user: MAILER_CONFIG.user,
        pass: MAILER_CONFIG.password,
      },
      tls: { rejectUnauthorized: false },
    });

    transporter.sendMail(mailOptions, function(error) {
      if (error) {
        MailService.logger.error(
          `Error sending email to ${MailService.recipient}.`,
          error,
        );
        throw new Error(`Error sending email to ${MailService.recipient}.`);
      } else {
        MailService.logger.log(
          `Mail to address ${MailService.recipient} sent with success.`,
        );
      }
    });
  }
}
