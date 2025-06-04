import emailjs from 'emailjs-com'

const SERVICE_ID = 'Jobiverse'
const TEMPLATE_ID = 'template_lw71jjo'
const USER_ID = 'Lm9BLo2zmwPEnuRij'

export const sendEmail = async ({ toEmail, content }) => {
  try {
    await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        toEmail,
        name: 'Jobiverse',
        time: new Date().toLocaleString(),
        content
      },
      USER_ID
    )
    console.log('Email sent to', toEmail)
  } catch (err) {
    console.error('Failed to send email:', err)
  }
}
