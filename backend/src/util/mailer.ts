import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import { MAILER_USER, MAILER_PASSWORD } from '../constants';

export async function sendMail(mailerOptions: Mail.Options) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // TODO: use real transport
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: MAILER_USER, // generated ethereal user
      pass: MAILER_PASSWORD, // generated ethereal password
    },
  });

  // send mail with defined transport object
  const info = await transporter.sendMail(mailerOptions);

  console.log('Message sent: %s', info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
}
