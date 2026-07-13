export function buildWishTemplate(
  name: string,
  occasion: string,
  imageUrl: string,
  customMessage?: string,
) {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">

<style>

body{
font-family:Arial,sans-serif;
background:#f3f5f8;
padding:40px;
}

.container{
max-width:700px;
margin:auto;
background:white;
padding:30px;
border-radius:12px;
box-shadow:0 10px 30px rgba(0,0,0,.1);
}

img{
width:100%;
border-radius:12px;
margin-top:25px;
}

.footer{
margin-top:30px;
color:#777;
font-size:14px;
}

</style>

</head>

<body>

<div class="container">

<h2>🎉 Happy ${occasion} ${name}!</h2>

<p>
${customMessage || "Wishing you success, happiness and wonderful memories."}
</p>

<img src="${imageUrl}" />

<div class="footer">

Regards,
<br>

AI Wishes Team
<br>

DIAN Technology Solutions

</div>

</div>

</body>

</html>
`;
}
