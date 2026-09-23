export interface DetectedSignal {
  type: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  evidence: string;
  weight: number;
}

export interface RiskAnalysisResult {
  riskScore: number;
  riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH';
  category: string;
  categoryLabel: string;
  signals: DetectedSignal[];
  summary: string;
  recommendedActions: string[];
}

interface PatternRule {
  type: string;
  label: string;
  severity: 'low' | 'medium' | 'high';
  weight: number;
  regex: RegExp;
  categoryHint?: string;
  recommendation?: string;
}

const RULES: PatternRule[] = [
  // OTP & Credential Harvesting
  {
    type: 'credential_theft',
    label: 'Requests sensitive OTP or Password',
    severity: 'high',
    weight: 25,
    regex: /\b((share|send|provide|tell|give|enter)\s+(your\s+|the\s+)?otp|enter\s+(your\s+)?pin|verify\s+(your\s+)?password|cvv\s+number|one[\s-]time\s+password|netbanking\s+password)\b/i,
    recommendation: 'NEVER share your OTP, PIN, or netbanking passwords with anyone. Banks never ask for this.'
  },
  // Threats & Digital Arrest / Legal Coercion
  {
    type: 'threat_coercion',
    label: 'Intimidation or fake legal/police threats',
    severity: 'high',
    weight: 25,
    regex: /\b(arrest\s+warrant|digital\s+arrest|cbi(\s+investigation|\s+police)?|police(\s+officer|\s+case|\s+department)?|court\s+notice|customs\s+seizure|illegal\s+parcel|narcotics|immediate\s+imprisonment|legal\s+action)\b/i,
    categoryHint: 'GOVERNMENT_IMPERSONATION',
    recommendation: 'Law enforcement and government agencies NEVER arrest people via video call or demand money to clear cases.'
  },
  // Bank KYC / Account Suspension Urgency
  {
    type: 'urgency_suspension',
    label: 'Urgent deadline threatening account blocking',
    severity: 'high',
    weight: 20,
    regex: /\b(account\s+will\s+be\s+(blocked|suspended|deactivated|closed)|within\s+\d+\s+hours|kyc\s+(expired|pending|mandatory|suspended)|update\s+kyc\s+immediately|pan\s+card\s+not\s+updated|deactivated\s+today|act\s+now)\b/i,
    categoryHint: 'BANK_KYC',
    recommendation: 'Banks never block your account via SMS links. Visit your branch or call the number printed on your debit card.'
  },
  // Remote Access Software
  {
    type: 'remote_access',
    label: 'Urges installation of remote access screen-sharing app',
    severity: 'high',
    weight: 30,
    regex: /\b(anydesk|teamviewer|quicksupport|rustdesk|screen\s+share|remote\s+support\s+app|install\s+support\s+software)\b/i,
    categoryHint: 'TECH_SUPPORT',
    recommendation: 'DO NOT install screen sharing apps (AnyDesk, TeamViewer). Fraudsters use them to control your phone and empty bank accounts.'
  },
  // Courier / Delivery Scam
  {
    type: 'courier_delivery',
    label: 'Unsolicited parcel delivery fee or address update',
    severity: 'medium',
    weight: 15,
    regex: /\b(parcel\s+cannot\s+be\s+delivered|package\s+held|delivery\s+address\s+wrong|pay\s+(small\s+)?(shipping|delivery|customs)\s+fee|fedex\s+tracking|dhl\s+notice|india\s+post\s+delivery)\b/i,
    categoryHint: 'COURIER',
    recommendation: 'Postal and courier services do not ask for card details via SMS to redeliver packages.'
  },
  // Utility / Electricity Bill scam
  {
    type: 'utility_disconnection',
    label: 'Fake electricity or power disconnection warning',
    severity: 'high',
    weight: 20,
    regex: /\b(electricity\s+will\s+be\s+disconnected|power\s+cut\s+at\s+\d+|electricity\s+bill\s+unpaid|contact\s+electricity\s+officer|disconnection\s+notice)\b/i,
    categoryHint: 'ELECTRICITY_UTILITY',
    recommendation: 'Electricity boards never dispatch power cutoff SMS from private mobile numbers.'
  },
  // Job Offer / Task Scam
  {
    type: 'job_scam',
    label: 'Unrealistic work-from-home or YouTube like-task offer',
    severity: 'medium',
    weight: 15,
    regex: /\b(work\s+from\s+home\s+daily\s+earning|earn\s+₹?\d+[\s-]₹?\d+\s+daily|like\s+youtube\s+videos\s+and\s+earn|part[\s-]time\s+job\s+offer|hotel\s+rating\s+task|telegram\s+job\s+task)\b/i,
    categoryHint: 'JOB_SCAM',
    recommendation: 'High-paying task jobs that ask for prepaid deposit schemes are guaranteed frauds.'
  },
  // Lottery / Prize / Reward
  {
    type: 'lottery_prize',
    label: 'Unsolicited lottery winnings or prize claim',
    severity: 'medium',
    weight: 15,
    regex: /\b(won\s+(a\s+)?lottery|lucky\s+draw\s+winner|congratulations\s+you\s+have\s+won|claim\s+cash\s+prize|kbc\s+lottery|spin\s+and\s+win)\b/i,
    categoryHint: 'LOTTERY_PRIZE',
    recommendation: 'You cannot win a lottery you never entered. Never pay tax or processing fees to claim a prize.'
  },
  // Financial Demands / Money Transfer
  {
    type: 'financial_demand',
    label: 'Prompting immediate fund transfer or payment',
    severity: 'medium',
    weight: 15,
    regex: /\b(transfer\s+amount|send\s+money\s+to|pay\s+refundable\s+deposit|gift\s+cards|crypto\s+payment|urgent\s+fee)\b/i,
    recommendation: 'Never send money or buy gift cards for unknown callers or contacts.'
  },
  // Suspicious External Links
  {
    type: 'suspicious_link',
    label: 'Contains unverified or shortened link',
    severity: 'medium',
    weight: 15,
    regex: /(https?:\/\/[^\s]+|bit\.ly|tinyurl\.com|t\.co|is\.gd|goo\.gl|wa\.me|cutt\.ly)/i,
    recommendation: 'Do not click unknown links in text messages. Type the official URL yourself in the browser.'
  },
  // Bank Impersonation Claims
  {
    type: 'bank_impersonation',
    label: 'Claims to represent a recognized financial institution',
    severity: 'medium',
    weight: 10,
    regex: /\b(sbi|hdfc|icici|axis\s+bank|punjab\s+national|bank\s+of\s+baroda|canara\s+bank|rbi|reserve\s+bank)\b/i,
    categoryHint: 'BANK_KYC'
  },
  // Personal Emergency / Grandchild Impersonation
  {
    type: 'family_emergency',
    label: 'Claims a family member is in hospital or legal trouble',
    severity: 'high',
    weight: 20,
    regex: /\b(grandson|granddaughter|in\s+hospital|road\s+accident|bail\s+money|please\s+help\s+grandma|don'?t\s+tell\s+mom)\b/i,
    categoryHint: 'FAMILY_EMERGENCY',
    recommendation: 'Always call your grandchild or family member back on their known saved phone number before sending money.'
  }
];

export function analyzeScamRisk(text: string, scanType: 'MESSAGE' | 'LINK' | 'CALL'): RiskAnalysisResult {
  const normalizedText = text.trim();
  const detectedSignals: DetectedSignal[] = [];
  const recommendedActionsSet = new Set<string>();
  const categoryCounts: Record<string, number> = {};

  let totalScore = 0;

  for (const rule of RULES) {
    const match = normalizedText.match(rule.regex);
    if (match) {
      const evidence = match[0];
      detectedSignals.push({
        type: rule.type,
        label: rule.label,
        severity: rule.severity,
        evidence: `Found: "${evidence}"`,
        weight: rule.weight
      });

      totalScore += rule.weight;

      if (rule.categoryHint) {
        categoryCounts[rule.categoryHint] = (categoryCounts[rule.categoryHint] || 0) + 1;
      }

      if (rule.recommendation) {
        recommendedActionsSet.add(rule.recommendation);
      }
    }
  }

  // Adjust score based on combination of multiple high severity signals
  const highSeverityCount = detectedSignals.filter(s => s.severity === 'high').length;
  if (highSeverityCount >= 2) {
    totalScore += 15;
  }

  // Cap between 0 and 100
  const finalScore = Math.min(100, Math.max(5, totalScore));

  // Determine Risk Level
  let riskLevel: 'LOW' | 'SUSPICIOUS' | 'HIGH';
  if (finalScore >= 61) {
    riskLevel = 'HIGH';
  } else if (finalScore >= 31) {
    riskLevel = 'SUSPICIOUS';
  } else {
    riskLevel = 'LOW';
  }

  // Determine top category
  let topCategory = 'OTHER';
  let maxCount = 0;
  for (const [cat, count] of Object.entries(categoryCounts)) {
    if (count > maxCount) {
      maxCount = count;
      topCategory = cat;
    }
  }

  if (topCategory === 'OTHER' && riskLevel !== 'LOW') {
    if (scanType === 'LINK') topCategory = 'PHISHING_SITE';
    else if (scanType === 'CALL') topCategory = 'IMPERSONATION_CALL';
    else topCategory = 'UNVERIFIED_MESSAGE';
  }

  const categoryLabels: Record<string, string> = {
    BANK_KYC: 'Bank & KYC Verification Impersonation',
    GOVERNMENT_IMPERSONATION: 'Government & Police Intimidation Scam',
    COURIER: 'Courier & Package Delivery Scam',
    ELECTRICITY_UTILITY: 'Electricity Bill Disconnection Fraud',
    JOB_SCAM: 'Deceptive Job & Task Offer',
    INVESTMENT: 'High-Yield Investment Scheme',
    TECH_SUPPORT: 'Tech Support & Remote Access Scam',
    FAMILY_EMERGENCY: 'Family Emergency & Relative Impersonation',
    LOTTERY_PRIZE: 'Lottery & Prize Claim Scam',
    LOAN: 'Fake Instant Loan Offer',
    PHISHING_SITE: 'Deceptive Phishing Website',
    IMPERSONATION_CALL: 'Fraudulent Caller Impersonation',
    UNVERIFIED_MESSAGE: 'Unverified Suspicious Message',
    OTHER: 'General Communication'
  };

  // Default recommendations based on risk level
  if (riskLevel === 'HIGH') {
    recommendedActionsSet.add('DO NOT click any link or call back phone numbers provided in the message.');
    recommendedActionsSet.add('DO NOT share one-time passwords (OTP), banking credentials, or personal identity numbers.');
    recommendedActionsSet.add('Alert your trusted contact or call the national cybercrime helpline (1930) if you shared any details.');
  } else if (riskLevel === 'SUSPICIOUS') {
    recommendedActionsSet.add('Exercise caution: verify the communication independently through official contact channels.');
    recommendedActionsSet.add('Do not rush into payments or identity verification without confirming with family.');
  } else {
    recommendedActionsSet.add('No typical scam indicators were detected, but always remain vigilant before sharing financial info.');
    recommendedActionsSet.add('Ensure you know the sender before clicking links or downloading attachments.');
  }

  // Concise elder-friendly summary
  let summary = '';
  if (riskLevel === 'HIGH') {
    summary = `High risk detected. This communication contains ${detectedSignals.length} strong indicators characteristic of ${categoryLabels[topCategory] || topCategory}.`;
  } else if (riskLevel === 'SUSPICIOUS') {
    summary = `Suspicious elements found. This contains warning signs that require independent verification before taking action.`;
  } else {
    summary = `Low risk. Standard scam markers were not detected in this communication.`;
  }

  return {
    riskScore: finalScore,
    riskLevel,
    category: topCategory,
    categoryLabel: categoryLabels[topCategory] || topCategory,
    signals: detectedSignals,
    summary,
    recommendedActions: Array.from(recommendedActionsSet)
  };
}
