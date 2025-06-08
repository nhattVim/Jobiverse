import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

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
      {
        publicKey: PUBLIC_KEY
      }
    )
    console.log('Email sent to', toEmail)
  } catch (err) {
    console.error('Failed to send email:', err)
  }
}
