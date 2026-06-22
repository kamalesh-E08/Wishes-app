import dotenv from "dotenv";

dotenv.config();

async function test() {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/ai/models/search`,
    {
      headers: {
        Authorization: `Bearer ${process.env.CF_API_TOKEN}`,
      },
    },
  );

  console.log("Status:", response.status);

  const text = await response.text();

  console.log(text);
}

test();
