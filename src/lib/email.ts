import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Verify transporter configuration
transporter.verify((error, success) => {
  if (error) {
    console.error('Email transporter error:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send email using Nodemailer
 */
export async function sendEmail({ to, subject, html, text }: EmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"Resume Builder" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Send verification email
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${verificationToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Resume Builder!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Thank you for signing up! We're excited to have you on board.</p>
          <p>To complete your registration and start building amazing resumes, please verify your email address by clicking the button below:</p>
          <center>
            <a href="${verificationUrl}" class="button">Verify Email Address</a>
          </center>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
            ${verificationUrl}
          </p>
          <p>This link will expire in 24 hours for security reasons.</p>
          <p>If you didn't create an account, you can safely ignore this email.</p>
          <p>Best regards,<br>The Resume Builder Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Verify Your Email - Resume Builder',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .warning {
          background: #fff3cd;
          border-left: 4px solid #ffc107;
          padding: 10px;
          margin: 15px 0;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Reset Your Password</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password for your Resume Builder account.</p>
          <p>Click the button below to create a new password:</p>
          <center>
            <a href="${resetUrl}" class="button">Reset Password</a>
          </center>
          <p>Or copy and paste this link in your browser:</p>
          <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
            ${resetUrl}
          </p>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong>
            <ul style="margin: 5px 0;">
              <li>This link will expire in 1 hour</li>
              <li>If you didn't request this, please ignore this email</li>
              <li>Your password will not change until you create a new one</li>
            </ul>
          </div>
          <p>Best regards,<br>The Resume Builder Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Reset Your Password - Resume Builder',
    html,
  });
}

/**
 * Send welcome email after verification
 */
export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .button {
          display: inline-block;
          padding: 12px 30px;
          background: #667eea;
          color: white;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
        }
        .features {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin: 15px 0;
        }
        .feature-item {
          margin: 10px 0;
          padding-left: 25px;
          position: relative;
        }
        .feature-item:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #667eea;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Welcome to Resume Builder!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Your email has been verified successfully! You're all set to create professional resumes.</p>
          
          <div class="features">
            <h3>What you can do now:</h3>
            <div class="feature-item">Create unlimited professional resumes</div>
            <div class="feature-item">Choose from 6 beautiful templates</div>
            <div class="feature-item">Customize colors, fonts, and styles</div>
            <div class="feature-item">Export high-quality PDFs</div>
            <div class="feature-item">Share resumes online with public links</div>
            <div class="feature-item">Auto-save your work in real-time</div>
          </div>

          <center>
            <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Start Building Your Resume</a>
          </center>

          <p><strong>Quick Tips:</strong></p>
          <ul>
            <li>Start with the Modern template for a clean look</li>
            <li>Your changes are auto-saved every 2 seconds</li>
            <li>Use the resume switcher to manage multiple resumes</li>
            <li>Export PDFs in different quality levels</li>
          </ul>

          <p>Need help? Check out our documentation or reach out to our support team.</p>
          
          <p>Happy building!<br>The Resume Builder Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Welcome to Resume Builder! 🎉',
    html,
  });
}

/**
 * Send resume share notification
 */
export async function sendResumeSharedEmail(
  email: string,
  name: string,
  resumeTitle: string,
  shareUrl: string
) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .share-box {
          background: white;
          padding: 20px;
          border-radius: 5px;
          margin: 15px 0;
          border: 2px dashed #667eea;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📋 Resume Shared Successfully!</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>Your resume "<strong>${resumeTitle}</strong>" is now available online!</p>
          
          <div class="share-box">
            <p><strong>Share this link:</strong></p>
            <p style="background: #f0f0f0; padding: 10px; border-radius: 5px; word-break: break-all;">
              ${shareUrl}
            </p>
          </div>

          <p><strong>What happens now:</strong></p>
          <ul>
            <li>Anyone with this link can view your resume</li>
            <li>View count is tracked in your dashboard</li>
            <li>You can deactivate the link anytime</li>
            <li>The resume updates automatically when you edit</li>
          </ul>

          <p>Good luck with your job applications!</p>
          
          <p>Best regards,<br>The Resume Builder Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: `Resume Shared: ${resumeTitle}`,
    html,
  });
}

/**
 * Send account deletion confirmation
 */
export async function sendAccountDeletionEmail(email: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: #dc3545;
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #666;
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Account Deleted</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>We're sorry to see you go. Your Resume Builder account has been successfully deleted.</p>
          
          <p><strong>What's been deleted:</strong></p>
          <ul>
            <li>Your account and profile information</li>
            <li>All your resumes and data</li>
            <li>Share links and analytics</li>
          </ul>

          <p>If you deleted your account by mistake or change your mind, you can always create a new account.</p>
          
          <p>Thank you for using Resume Builder!</p>
          
          <p>Best regards,<br>The Resume Builder Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Resume Builder. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Account Deleted - Resume Builder',
    html,
  });
}

export default transporter;
