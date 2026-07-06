import axios from "axios";

/**
 * Send an SMS notification when a lost item finds a match.
 * Falls back to logging the SMS to the console if Twilio is not configured.
 * 
 * @param {string} toPhone The registered phone number of the reporter.
 * @param {string} messageText The notification message.
 */
export async function sendSmsNotification(toPhone, messageText) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromPhone = process.env.TWILIO_PHONE_NUMBER;

  // Visual text formatting for console log fallback
  const divider = "==================================================";
  const formattedConsoleLog = `
${divider}
📱 [SIMULATED SMS DISPATCHED]
To: ${toPhone}
Message: ${messageText}
${divider}
  `;

  if (!accountSid || !authToken || !fromPhone) {
    console.log("Twilio credentials not configured. Falling back to local logging:");
    console.log(formattedConsoleLog);
    return { success: true, simulated: true };
  }

  try {
    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const auth = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
    const data = new URLSearchParams({
      To: toPhone,
      From: fromPhone,
      Body: messageText,
    });

    const response = await axios.post(url, data, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    console.log(`Twilio SMS sent successfully. Message SID: ${response.data.sid}`);
    return { success: true, sid: response.data.sid };
  } catch (error) {
    console.error("Failed to send Twilio SMS:", error.response?.data || error.message);
    // Return success: false but log it
    return { success: false, error: error.message };
  }
}
