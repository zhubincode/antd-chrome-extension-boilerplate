import JsSHA from "jssha";

const defaultOptions = {
  period: 30,
  algorithm: "SHA-1",
  digits: 6,
  timestamp: Date.now(),
};

function getToken(key, options) {
  const newOptions = { ...defaultOptions, ...options };
  const newKey = base32tohex(key);
  const epoch = Math.floor(newOptions.timestamp / 1000.0);
  const time = leftpad(dec2hex(Math.floor(epoch / newOptions.period)), 16, "0");
  const shaObj = new JsSHA(newOptions.algorithm, "HEX");
  shaObj.setHMACKey(newKey, "HEX");
  shaObj.update(time);
  const hmac = shaObj.getHMAC("HEX");
  const offset = hex2dec(hmac?.substring(hmac.length - 1));
  let otp = `${hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")}`;
  otp = otp.substr(
    Math.max(otp.length - newOptions.digits, 0),
    newOptions.digits
  );
  return otp;
}

function hex2dec(s) {
  return parseInt(s, 16);
}

function dec2hex(s) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
}

function base32tohex(base32) {
  const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  let hex = "";

  const newBase32 = base32?.replace(/=+$/, "") || "";

  for (let i = 0; i < newBase32.length; i++) {
    const val = base32chars?.indexOf(newBase32.charAt(i).toUpperCase());
    if (val === -1) throw new Error("Invalid base32 character in key");
    bits += leftpad(val.toString(2), 5, "0");
  }

  for (let i = 0; i + 8 <= bits.length; i += 8) {
    const chunk = bits.substr(i, 8);
    hex = hex + leftpad(parseInt(chunk, 2).toString(16), 2, "0");
  }
  return hex;
}

function leftpad(str, len, pad) {
  let newStr = str;
  if (len + 1 >= str.length) {
    newStr = Array(len + 1 - str.length).join(pad) + str;
  }
  return newStr;
}

export { getToken };
