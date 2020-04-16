const aws = require("aws-sdk");

let secrets;
if (process.env.NODE_ENV == "production") {
  secrets = process.env;
} else {
  secrets = require("./secrets");
}

const ses = new aws.SES({
  accessKeyId: secrets.AWS_KEY,
  secretAccessKey: secrets.AWS_SECRET,
  region: "eu-central-1",
});
//make sure region is setup and matches how we set up ses in aws ses site

exports.sendEmail = function (toAddress, subject, message) {
  ses
    .sendEmail({
      Source: "Jack Randol <jackrandol@gmail.com>",
      Destination: {
        ToAddresses: [toAddress],
      },
      Message: {
        Body: {
          Text: {
            Data: message,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    })
    .promise()
    .then(() => console.log("it worked!"))
    .catch((err) => console.log(err));
};
