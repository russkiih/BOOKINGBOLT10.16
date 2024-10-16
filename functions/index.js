const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');
const twilio = require('twilio');

admin.initializeApp();

// Initialize SendGrid
sgMail.setApiKey(functions.config().sendgrid.key);

// Initialize Twilio
const twilioClient = twilio(
  functions.config().twilio.account_sid,
  functions.config().twilio.auth_token
);

exports.sendAppointmentConfirmation = functions.firestore
  .document('appointments/{appointmentId}')
  .onCreate(async (snap, context) => {
    const appointment = snap.data();
    const { name, email, phone, service, date } = appointment;

    // Send email confirmation
    const msg = {
      to: email,
      from: 'your-salon@example.com', // Replace with your verified sender
      subject: 'Appointment Confirmation',
      text: `Dear ${name},\n\nYour appointment for ${service} on ${date} has been confirmed.\n\nThank you for choosing our salon!`,
      html: `<p>Dear ${name},</p><p>Your appointment for <strong>${service}</strong> on <strong>${date}</strong> has been confirmed.</p><p>Thank you for choosing our salon!</p>`,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
    }

    // Send SMS confirmation
    try {
      await twilioClient.messages.create({
        body: `Your appointment for ${service} on ${date} has been confirmed. Thank you for choosing our salon!`,
        from: '+1234567890', // Replace with your Twilio phone number
        to: phone
      });
      console.log('SMS sent successfully');
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  });