import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const sendVerificationEmail = async (email: string, verificationToken: string) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify?token=${verificationToken}`;

    const mailOptions = {
        from: '"AttendIt" <no-reply@trial-0p7kx4x2jqvg9yjr.mlsender.net>',
        to: email,
        subject: 'Verify Your Email Address',
        text: `Please verify your email by clicking on the link: ${verificationUrl}`,
        html: `<p>Please verify your email by clicking on the link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };
    return transporter.sendMail(mailOptions);
};
