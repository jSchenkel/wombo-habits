// Docs:
// https://docs.meteor.com/packages/browser-policy.html

// Mixpanel
BrowserPolicy.content.allowOriginForAll('https://cdn.mxpnl.com:*');

// Fontawesome
BrowserPolicy.content.allowOriginForAll('https://use.fontawesome.com:*');
BrowserPolicy.content.allowOriginForAll('netdna.bootstrapcdn.com:*');

// Google Fonts
BrowserPolicy.content.allowOriginForAll('https://fonts.googleapis.com:*');
BrowserPolicy.content.allowOriginForAll('https://fonts.gstatic.com:*');

// Bulma
BrowserPolicy.content.allowOriginForAll('https://cdn.jsdelivr.net/npm/bulma@0.9.0/css/bulma.min.css');
BrowserPolicy.content.allowOriginForAll('https://bulma.io:*');

// AWS S3 Music Bucket
BrowserPolicy.content.allowOriginForAll('https://s3.amazonaws.com:*');

// Stripe
BrowserPolicy.content.allowOriginForAll('https://js.stripe.com/');

// app will never render inside a frame or iframe
BrowserPolicy.framing.disallow();


// BrowserPolicy.content.disallowInlineScripts()

// //Allow inline styles for Google fonts
BrowserPolicy.content.allowInlineStyles();
// BrowserPolicy.content.allowInlineStyles()
