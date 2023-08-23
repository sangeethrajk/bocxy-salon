const axois = require("axios");

exports.axiosGetRequest = async (caller, url, params, config) => {
  try {
    return await axois.get(url, {
      params: params,
      headers: config,
    });
  } catch (error) {
    console.log("Failed api get call - " + caller + " - " + error);
    throw Error(error);
  }
};
exports.axiosPostRequest = async (caller, url, data, config) => {
  try {
    const response = await axois.post(url, data, config);
    return response;
  } catch (error) {
    console.log("Failed api post call - " + caller + " - " + error);
    throw Error(error);
  }
};
exports.generateOtp = () => {
  var digits = "0123456789";
  var otpLength = 4;
  var otp = "";
  for (let i = 1; i <= otpLength; i++) {
    var index = Math.floor(Math.random() * digits.length);
    if (index == 0 && otp === "") index = 1;
    otp = otp + digits[index];
  }
  return otp;
};

exports.newAwsS3 = () => {
  const AWS = require("aws-sdk");
  // Configuring AWS with access and secret key.
  const { ACCESS_KEY_ID, SECRET_ACCESS_KEY, AWS_REGION } = process.env;

  // Configuring AWS to use promise
  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    accessKeyId: ACCESS_KEY_ID,
    secretAccessKey: SECRET_ACCESS_KEY,
    region: AWS_REGION,
  });

  // Create an s3 instance
  return new AWS.S3();
};

exports.parseBase64 = (base64, name, basePath) => {
  const base64Data = new Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Getting the file type, ie: jpeg, png or gif
  const fileType = base64.split(";")[0].split("/")[1];
  // generating 18 char unique ID - ex: KA76ABOYOCJDMTN56Q
  const uniqueId = (
    Date.now().toString(36) + Math.random().toString(36).substr(2, 10)
  ).toUpperCase();

  return {
    base64Data,
    fileType,
    fileName: `${basePath}/${uniqueId}-${name}`,
  };
};

exports.createThumbnail = async (base64Obj) => {
  let obj = {
    base64Data: base64Obj.base64Data,
    fileType: base64Obj.fileType,
    fileName: base64Obj.fileName,
  };
  const sharp = require("sharp");
  const thumbnailBuffer = await sharp(obj.base64Data).resize(150).toBuffer();
  obj.base64Data = thumbnailBuffer;
  const splitString = obj.fileName.split("/");
  obj.fileName = `${splitString[0]}/thumbnails/${splitString[1]}`;
  return obj;
};

exports.uploadToS3 = async (s3, img) => {
  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: `${img.fileName}.${img.fileType}`, // type is not required
    Body: img.base64Data,
    ACL: "private",
    ContentEncoding: "base64", // required
    ContentType: `image/${img.fileType}`, // required. Notice the back ticks
  };
  let location = null,
    key = null;
  try {
    const { Location, Key } = await s3.upload(params).promise();
    location = Location;
    key = Key;
  } catch (error) {
    console.log("Error while uploading to S3: ", error);
  }
  return location;
};

exports.getSignedUrl = async (s3, url) => {
  if (url) {
    let arr = url.split("/");
    arr.splice(0, 3);
    arr = arr.join("/");
    const finalUrl = s3.getSignedUrl("getObject", {
      Bucket: process.env.S3_BUCKET, // the name of your bucket
      Key: arr, // name of object in S3
      Expires: 20, // how long the URL is good, in seconds
    });
    return finalUrl;
  } else return null;
};

exports.knexnest = async (arr, uniqueId = "") => {
  let arrayLevel1 = [];
  for (let obj of arr) {
    // check level 1
    let g = arrayLevel1.findIndex((x) => x[uniqueId] === obj["_" + uniqueId]);
    if (g < 0) {
      let newObject = {};

      for (var key in obj) {
        if (!key.split("__")[1]) {
          newObject[key.substr(1)] = obj[key];
        } else {
          if (!newObject.hasOwnProperty(key.split("__")[0].substr(1))) {
            newObject[key.split("__")[0].substr(1)] = new Array();
          }
        }
      }

      g = arrayLevel1.push(newObject) - 1;
    }
    let subObject = {};

    for (var key in obj) {
      if (key.split("__")[1]) {
        if (!subObject.hasOwnProperty(key.split("__")[0].substr(1))) {
          subObject[key.split("__")[0].substr(1)] = {};
        }

        subObject[key.split("__")[0].substr(1)][key.split("__")[1]] = obj[key];
      }
    }

    for (var key in subObject) {
      let counter = 0;
      for (var x in subObject[key]) {
        if (subObject[key][x] != null) {
          counter = counter + 1;
        }
      }
      if (counter > 0) {
        arrayLevel1[g][key].push(subObject[key]);
      }
    }
  }
  return arrayLevel1;
};
