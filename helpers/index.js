// const sendGrid = require("@sendgrid/mail");

// const { SEND_GRID_KEY } = process.env;

const nodemailer = require("nodemailer");

const { EMAIL_USER, EMAIL_PASS } = process.env;

function tryCatchWrapper(enpointFn) {
  return async (req, res, next) => {
    try {
      await enpointFn(req, res, next);
    } catch (error) {
      return next(error);
    }
  };
}

function HttpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

async function sendMail({ to, html, subject }) {
  // try {
  //   sendGrid.setApiKey(SEND_GRID_KEY);

  //   const email = {
  //     from: "brovarecbogban@gmail.com",
  //     to,
  //     subject,
  //     html,
  //   };

  //   const response = await sendGrid.send(email);
  //   console.log(response);
  // } catch (error) {
  //   console.error("App error:", error);
  // }

  const email = {
    from: "info@mymovies.com",
    to,
    subject,
    html,
  };

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
  });

  await transport.sendMail(email);
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  sendMail,
};
