const https = require('https');
https.get('https://frontend-eta-three-38.vercel.app', res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const match = body.match(/<script type="module" crossorigin src="(.*?)">/);
    if (match) {
      https.get('https://frontend-eta-three-38.vercel.app' + match[1], jsRes => {
        let jsBody = '';
        jsRes.on('data', d => jsBody += d);
        jsRes.on('end', () => {
          if (jsBody.includes('backend-two-chi-55.vercel.app')) console.log('Correct backend URL found!');
          else if (jsBody.includes('http://localhost:3001')) console.log('WRONG URL: localhost:3001 found!');
          else console.log('Could not find API URL');
        });
      });
    } else {
        console.log('No script tag found');
    }
  });
});
