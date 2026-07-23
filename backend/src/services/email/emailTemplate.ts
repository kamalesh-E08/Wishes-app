export interface EmailTemplateOptions {
  headerTitle?: string;
  accentColor?: string;
  signature?: string;
  companyFooter?: string;
}

export function buildWishTemplate(
  name: string,
  occasion: string,
  imageUrl: string,
  customMessage?: string,
  options?: EmailTemplateOptions,
) {
  const accentColor = options?.accentColor || "#0d9488";
  const headerText = options?.headerTitle
    ? options.headerTitle.replace("{name}", name).replace("{occasion}", occasion)
    : `🎉 Happy ${occasion} ${name}!`;

  const signature = options?.signature || "Regards,\nAI Wishes Team";
  const companyFooter = options?.companyFooter || "DIAN Technology Solutions";

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<style>
body {
  font-family: Arial, sans-serif;
  background: #f3f5f8;
  padding: 40px;
}
.container {
  max-width: 700px;
  margin: auto;
  background: white;
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0,0,0,.08);
  border-top: 6px solid ${accentColor};
}
h2 {
  color: ${accentColor};
  margin-top: 0;
}
img {
  width: 100%;
  border-radius: 12px;
  margin-top: 25px;
}
.footer {
  margin-top: 30px;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-line;
  border-top: 1px solid #eee;
  padding-top: 20px;
}
.company {
  font-weight: bold;
  color: #333;
  margin-top: 4px;
}
</style>
</head>
<body>
<div class="container">
  <h2>${headerText}</h2>
  <p>${customMessage || "Wishing you success, happiness and wonderful memories."}</p>
  <img src="${imageUrl}" />
  <div class="footer">
    ${signature}
    <div class="company">${companyFooter}</div>
  </div>
</div>
</body>
</html>
`;
}
