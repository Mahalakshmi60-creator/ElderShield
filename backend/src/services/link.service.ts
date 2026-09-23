import { analyzeScamRisk, RiskAnalysisResult, DetectedSignal } from './risk.service';

export interface LinkAnalysisResult extends RiskAnalysisResult {
  url: string;
  domain: string;
  protocol: string;
  isHttps: boolean;
  domainIndicators: {
    suspiciousTld: boolean;
    ipAddressHost: boolean;
    isShortener: boolean;
    brandSpoofDetected: string | null;
    excessiveHyphens: boolean;
  };
}

const SUSPICIOUS_TLDS = new Set([
  '.xyz', '.top', '.click', '.buzz', '.club', '.icu', '.tk', '.ml', '.ga', '.cf', '.gq', '.fit', '.rest', '.bar'
]);

const SHORTENERS = new Set([
  'bit.ly', 'tinyurl.com', 'is.gd', 't.co', 'goo.gl', 'cutt.ly', 'rb.gy', 'shorte.st', 'ow.ly'
]);

const KNOWN_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axisbank', 'pnb', 'rbi', 'fedex', 'dhl', 'bluedart',
  'indiapost', 'amazon', 'flipkart', 'netflix', 'paypal', 'apple', 'microsoft', 'google'
];

export function analyzeLink(rawUrl: string): LinkAnalysisResult {
  let targetUrl = rawUrl.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'http://' + targetUrl;
  }

  let parsed: URL;
  try {
    parsed = new URL(targetUrl);
  } catch (err) {
    // Return high risk on invalid/malformed URL
    return {
      url: rawUrl,
      domain: 'invalid-domain',
      protocol: 'unknown',
      isHttps: false,
      riskScore: 85,
      riskLevel: 'HIGH',
      category: 'PHISHING_SITE',
      categoryLabel: 'Malformed or Deceptive URL',
      summary: 'The URL format is malformed or intentionally disguised to bypass web safety checks.',
      signals: [{
        type: 'malformed_url',
        label: 'Malformed URL structure',
        severity: 'high',
        evidence: rawUrl,
        weight: 35
      }],
      recommendedActions: [
        'Do not open this link.',
        'Never paste malformed or obfuscated links into your browser.'
      ],
      domainIndicators: {
        suspiciousTld: false,
        ipAddressHost: false,
        isShortener: false,
        brandSpoofDetected: null,
        excessiveHyphens: false
      }
    };
  }

  const hostname = parsed.hostname.toLowerCase();
  const protocol = parsed.protocol.replace(':', '');
  const isHttps = protocol === 'https';

  const signals: DetectedSignal[] = [];
  let score = isHttps ? 5 : 20;

  if (!isHttps) {
    signals.push({
      type: 'insecure_protocol',
      label: 'Insecure Connection (HTTP instead of HTTPS)',
      severity: 'medium',
      evidence: 'Protocol is unencrypted HTTP',
      weight: 20
    });
  }

  // Check IP address hostname
  const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  if (isIp) {
    score += 40;
    signals.push({
      type: 'ip_hostname',
      label: 'Direct IP Address Hostname Used',
      severity: 'high',
      evidence: `Host is an IP address: ${hostname}`,
      weight: 40
    });
  }

  // Check URL shortener
  const isShortener = SHORTENERS.has(hostname);
  if (isShortener) {
    score += 25;
    signals.push({
      type: 'url_shortener',
      label: 'URL Shortening Service Masks Real Destination',
      severity: 'medium',
      evidence: `Shortener host: ${hostname}`,
      weight: 25
    });
  }

  // Check Suspicious TLD
  const hasSuspiciousTld = Array.from(SUSPICIOUS_TLDS).some(tld => hostname.endsWith(tld));
  if (hasSuspiciousTld) {
    score += 30;
    signals.push({
      type: 'suspicious_tld',
      label: 'High-Risk Top-Level Domain (TLD)',
      severity: 'high',
      evidence: `Hostname ends with risky extension: ${hostname}`,
      weight: 30
    });
  }

  // Check Brand Spoofing / Typo-squatting
  let brandSpoof: string | null = null;
  for (const brand of KNOWN_BRANDS) {
    if (hostname.includes(brand) && !hostname.endsWith(`.${brand}.com`) && !hostname.endsWith(`.${brand}.co.in`) && hostname !== `${brand}.com` && hostname !== `${brand}.co.in`) {
      brandSpoof = brand;
      score += 45;
      signals.push({
        type: 'brand_impersonation',
        label: `Impersonates trusted institution (${brand.toUpperCase()})`,
        severity: 'high',
        evidence: `Domain "${hostname}" uses brand name "${brand}" without official ownership`,
        weight: 45
      });
      break;
    }
  }

  // Check excessive hyphens in hostname
  const hyphenCount = (hostname.match(/-/g) || []).length;
  const excessiveHyphens = hyphenCount >= 2;
  if (excessiveHyphens) {
    score += 15;
    signals.push({
      type: 'excessive_hyphens',
      label: 'Multiple hyphens in domain name (common in scam domains)',
      severity: 'medium',
      evidence: `Found ${hyphenCount} hyphens in "${hostname}"`,
      weight: 15
    });
  }

  // Run general NLP text analysis on the URL path and query parameters
  const pathAndParams = parsed.pathname + parsed.search;
  const textSignals = analyzeScamRisk(pathAndParams.replace(/[/?&=_-]/g, ' '), 'LINK');
  
  for (const s of textSignals.signals) {
    signals.push(s);
    score += s.weight;
  }

  const finalScore = Math.min(100, Math.max(5, score));
  let riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH';
  if (finalScore >= 61) riskLevel = 'HIGH';
  else if (finalScore >= 31) riskLevel = 'SUSPICIOUS';
  else riskLevel = 'LOW';

  const category = brandSpoof ? 'BANK_KYC' : (riskLevel === 'HIGH' ? 'PHISHING_SITE' : 'WEBSITE_VERIFICATION');

  const actions = new Set<string>();
  if (riskLevel === 'HIGH') {
    actions.add('DO NOT visit this link or enter personal or bank details.');
    actions.add('If you have already entered passwords or OTPs, contact your bank immediately.');
    actions.add('Legitimate organizations have official .com or .in domains without strange hyphens or words.');
  } else if (riskLevel === 'SUSPICIOUS') {
    actions.add('Verify with the sender by a separate known phone call before clicking.');
    actions.add('Check for the lock icon and double-check spelling before logging in.');
  } else {
    actions.add('The domain exhibits standard security traits (HTTPS and recognized structure).');
    actions.add('Always ensure you intended to visit this specific organization.');
  }

  let summary = '';
  if (riskLevel === 'HIGH') {
    summary = `High risk phishing site detected. The domain "${hostname}" exhibits dangerous spoofing signals.`;
  } else if (riskLevel === 'SUSPICIOUS') {
    summary = `Suspicious link indicators detected on "${hostname}". Proceed with extreme caution.`;
  } else {
    summary = `Link appears consistent with standard secure domains. No phishing heuristics triggered.`;
  }

  return {
    url: rawUrl,
    domain: hostname,
    protocol,
    isHttps,
    riskScore: finalScore,
    riskLevel,
    category,
    categoryLabel: brandSpoof ? `Phishing Impersonation of ${brandSpoof.toUpperCase()}` : (riskLevel === 'HIGH' ? 'Phishing Website' : 'Standard Web Link'),
    summary,
    signals,
    recommendedActions: Array.from(actions),
    domainIndicators: {
      suspiciousTld: hasSuspiciousTld,
      ipAddressHost: isIp,
      isShortener,
      brandSpoofDetected: brandSpoof,
      excessiveHyphens
    }
  };
}
