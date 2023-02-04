const sendGrid = require("@sendgrid/mail");

const { SEND_GRID_KEY } = process.env;

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
  try {
    sendGrid.setApiKey(SEND_GRID_KEY);

    const email = {
      from: "brovarecbogban@gmail.com",
      to,
      subject,
      html,
    };

    const response = await sendGrid.send(email);
    console.log(response);
  } catch (error) {
    console.error("App error:", error);
  }
}

module.exports = {
  tryCatchWrapper,
  HttpError,
  sendMail,
};
