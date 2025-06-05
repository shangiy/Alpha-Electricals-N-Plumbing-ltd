const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

const PORT = 3000;

// SAFARICOM CREDENTIALS
const consumerKey = "obnYOb05TJuiPavbi52A8bC3QZnjFcDBhTysR4DA52cfPdTA";
const consumerSecret = "26vnmAGz6HbUdsQBU5bLEjyTyE4SSOokFvmPYO9iLHdaCmieGYCd3XJRUd1rNqeC";
const shortCode = "174379";
const passkey = "bfb279f9aa9bdbcf158e97dd71a467cd2c2c3fd3";

// ✅ 1. Get Access Token
async function getAccessToken() {
  const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    { headers: { Authorization: `Basic ${auth}` } }
  );

  return response.data.access_token;
}

// ✅ 2. STK PUSH Route
app.post("/stk-push", async (req, res) => {
  const { phone, amount } = req.body;

  try {
    const token = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, "").slice(0, 14);
    const password = Buffer.from(shortCode + passkey + timestamp).toString("base64");

    const stkPushPayload = {
      BusinessShortCode: shortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: "CustomerPayBillOnline",
      Amount: amount,
      PartyA: phone,
      PartyB: shortCode,
      PhoneNumber: phone,
      CallBackURL: "https://mydomain.com/callback", // Replace with ngrok when testing
      AccountReference: "Alpha Plumbing",
      TransactionDesc: "Payment from customer",
    };

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      stkPushPayload,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    res.json({ success: true, message: "STK Push sent", data: response.data });
  } catch (error) {
    console.error("STK Push Error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: "Payment failed" });
  }
});
