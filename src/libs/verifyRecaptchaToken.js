export default async function verifyRecaptchaToken(token, expectedAction) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  const isActionValid = data.action === expectedAction;
  const isScoreValid = data.score >= 0.5;
  const success = data.success && isScoreValid && isActionValid;

  return {
    success,
    raw: data,
    reason: {
      success: data.success,
      score: data.score,
      action: data.action,
      expected: expectedAction,
      match: isActionValid,
    },
  };
}
