const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const oauth2Client = new OAuth2(
  "156863199178-7q8r4p4822ef6k7j284b1f2rq01p44e5.apps.googleusercontent.com", // ClientID
  "xNzlLXJ3QeeNtzUEpuW1iw3H", // Client Secret
  "https://developers.google.com/oauthplayground" // Redirect URL
);

exports.emailServer = async () => {
  oauth2Client.setCredentials({
    refresh_token:
      "1//04BfQA-836KdPCgYIARAAGAQSNwF-L9IrcaNxn2bRrQsptDwtAEsRBqv2FdU8S6etj8qH1Iqrq13m5fs8-g1Q-gFFTJY5mgvTAqc",
  });
  const token = await oauth2Client.getAccessToken();
  return {
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: "contact@bocxy.com",
      clientId:
        "156863199178-7q8r4p4822ef6k7j284b1f2rq01p44e5.apps.googleusercontent.com",
      clientSecret: "xNzlLXJ3QeeNtzUEpuW1iw3H",
      refreshToken:
        "1//04BfQA-836KdPCgYIARAAGAQSNwF-L9IrcaNxn2bRrQsptDwtAEsRBqv2FdU8S6etj8qH1Iqrq13m5fs8-g1Q-gFFTJY5mgvTAqc",
      accessToken: token,
    },
  };
};
