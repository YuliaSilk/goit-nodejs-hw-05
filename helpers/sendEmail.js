import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_FROM, BASE_URL} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, 
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_PASSWORD,
    }
};

const tranport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: UKR_NET_FROM};
    return tranport.sendMail(email);
}

export default sendEmail;


// import sgMail from '@sendgrid/mail';
// import 'dotenv/config';
// import { nanoid } from "nanoid";


// const { SENDGRID_EMAIL_FROM, BASE_URL } = process.env;

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const sendEmail = async() => {

//   const verificationCode = nanoid();

//     const msg = {
//         to: 'rardaregni@gufum.com', // Change to your recipient
//         from: SENDGRID_EMAIL_FROM, // Change to your verified sender
//         subject: 'Varify email',
//         text: 'Click to verify email',
//         html: `<a target="_blank" href="${BASE_URL}/api/auth/verify/${verificationCode}">Click to verify email</a>`,
//       }
//       sgMail
//         .send(msg)
//         .then(() => {
//           console.log('Email sent')
//         })
//         .catch((error) => {
//           console.error(error)
//         })
// }
//  export default sendEmail
