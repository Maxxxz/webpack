const https = require('https');

console.log('1');
https.get(
  'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2412383877,773783511&fm=26&gp=0.jpg',
  {
    headers: {
      'user-agent':
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36'
    }
  },
  res => {
    console.log('res', res);
  }
);
