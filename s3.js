const aws = require("aws-sdk");
const fs = require("fs");

let secrets;
//this if else block is only on here in case hosting from heroku
if (process.env.NODE_ENV == "production") {
  secrets = process.env;
} else {
  secrets = require("./secrets");
}

//creating an aws client
const s3 = new aws.S3({
  accessKeyId: secrets.AWS_KEY,
  secretAccessKey: secrets.AWS_SECRET,
});

exports.upload = (req, res, next) => {
  console.log("req.file from s3.js:", req.file);

  if (!req.file) {
    console.log("no file :(");
    return res.sendStatus(500);
  }

  const { filename, mimetype, size, path } = req.file;

  const promise = s3
    .putObject({
      Bucket: "littlegremlin",
      ACL: "public-read",
      Key: filename,
      Body: fs.createReadStream(path),
      ContentType: mimetype,
      ContentLength: size,
    })
    .promise();

  promise
    .then(() => {
      console.log("image made it to Amazon!");
      next();

      fs.unlink(path, () => {});
    })
    .catch((err) => {
      console.log("error in putObject of s3.js:", err);
      res.sendStatus(500);
    });
};
