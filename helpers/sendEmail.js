import sgMail from '@sendgrid/mail';
import 'dotenv/config';
import { nanoid } from "nanoid";


const { SENDGRID_EMAIL_FROM, BASE_URL } = process.env;

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const verificationCode = nanoid();

const sendEmail = async() => {
    const msg = {
        to: 'kurtanerku@gufum.com', // Change to your recipient
        from: SENDGRID_EMAIL_FROM, // Change to your verified sender
        subject: 'HTML',
        text: 'Click to verify email',
        html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}
 export default sendEmail

