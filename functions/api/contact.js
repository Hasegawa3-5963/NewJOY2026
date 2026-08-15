import { EmailMessage } from "cloudflare:email";

function base64Utf8(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function encodedWord(str) {
  return `=?UTF-8?B?${base64Utf8(str)}?=`;
}

export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch (err) {
    return new Response(JSON.stringify({ error: "invalid json" }), { status: 400 });
  }

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const tel = (data.tel || "").trim();
  const mobile = (data.mobile || "").trim();
  const region = (data.region || "").trim();
  const message = (data.message || "").trim();
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!name || !emailOk || !tel || !region || !message) {
    return new Response(JSON.stringify({ error: "invalid input" }), { status: 400 });
  }

  const bodyText =
    "氏名: " + name + "\r\n" +
    "メールアドレス: " + email + "\r\n" +
    "お電話番号: " + tel + "\r\n" +
    "携帯番号: " + (mobile || "（未入力）") + "\r\n" +
    "お住まい地域: " + region + "\r\n\r\n" +
    "メッセージ:\r\n" + message;

  const raw =
    `From: ${env.CONTACT_FROM_ADDRESS}\r\n` +
    `To: ${env.CONTACT_TO_ADDRESS}\r\n` +
    `Subject: ${encodedWord("【noaa.jp】お問い合わせがありました")}\r\n` +
    `MIME-Version: 1.0\r\n` +
    `Content-Type: text/plain; charset="UTF-8"\r\n` +
    `Content-Transfer-Encoding: base64\r\n` +
    `\r\n` +
    base64Utf8(bodyText) + `\r\n`;

  const emailMessage = new EmailMessage(
    env.CONTACT_FROM_ADDRESS,
    env.CONTACT_TO_ADDRESS,
    raw
  );

  try {
    await env.SEND_EMAIL.send(emailMessage);
  } catch (err) {
    return new Response(JSON.stringify({ error: "send failed" }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
