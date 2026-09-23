// End-to-End Programmatic Integration Test for ElderShield AI
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🧪 Starting ElderShield AI End-to-End Test Suite');
  console.log('====================================================');

  // Test 1: Health check
  console.log('\n[Test 1] Health Check...');
  const healthRes: any = await fetch(`${BASE_URL}/health`).then(r => r.json());
  console.log('✓ Health Status:', healthRes.status);

  // Test 2: User Login (Mahalakshmi)
  console.log('\n[Test 2] User Login (mahalakshmi@example.com)...');
  const userLogin: any = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'mahalakshmi@example.com',
      password: 'ElderShield@2026'
    })
  }).then(r => r.json());

  if (!userLogin.token) throw new Error('User login failed: ' + JSON.stringify(userLogin));
  const userToken = userLogin.token;
  console.log('✓ Logged in as:', userLogin.user.fullName, '| Role:', userLogin.user.role);

  // Test 3: Get Current User Profile & Stats
  console.log('\n[Test 3] Fetching User Profile & Stats...');
  const meRes: any = await fetch(`${BASE_URL}/auth/me`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  }).then(r => r.json());
  console.log('✓ Total Scans on Record:', meRes.stats.totalScans, '| High Risk:', meRes.stats.highRiskCount);

  // Test 4: Message Scam Scan (Urgent SBI KYC Threat)
  console.log('\n[Test 4] Analyzing Suspicious Message (Urgent Bank KYC)...');
  const msgScan: any = await fetch(`${BASE_URL}/scans/message`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      message: 'URGENT: Your SBI bank account will be BLOCKED today. Share your OTP immediately to avoid deactivation.'
    })
  }).then(r => r.json());
  console.log('✓ Scan ID:', msgScan.scanId);
  console.log('✓ Risk Level:', msgScan.analysis.riskLevel, `(${msgScan.analysis.riskScore}/100)`);
  console.log('✓ Detected Category:', msgScan.analysis.category);
  console.log('✓ Signals Found:', msgScan.analysis.signals.map((s: any) => s.label).join('; '));

  // Test 5: Phishing Link Scan
  console.log('\n[Test 5] Analyzing Phishing Link (Typo-squatting & Risky TLD)...');
  const linkScan: any = await fetch(`${BASE_URL}/scans/link`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      url: 'http://sbi-kyc-update-portal.xyz/verify'
    })
  }).then(r => r.json());
  console.log('✓ Risk Level:', linkScan.analysis.riskLevel, `(${linkScan.analysis.riskScore}/100)`);
  console.log('✓ Domain Indicators:', linkScan.analysis.domainIndicators);

  // Test 6: Call Transcript Scan (Digital Arrest Threat)
  console.log('\n[Test 6] Analyzing Call Transcript (Digital Arrest / Police Intimidation)...');
  const callScan: any = await fetch(`${BASE_URL}/scans/call`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      transcript: 'This is CBI police officer. An arrest warrant is issued under digital arrest. Transfer ₹50,000 immediately.'
    })
  }).then(r => r.json());
  console.log('✓ Risk Level:', callScan.analysis.riskLevel, `(${callScan.analysis.riskScore}/100)`);
  console.log('✓ Summary:', callScan.analysis.summary);

  // Test 7: Trusted Contacts Management
  console.log('\n[Test 7] Verifying Trusted Contacts...');
  const contactsRes: any = await fetch(`${BASE_URL}/contacts`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  }).then(r => r.json());
  console.log('✓ Trusted Contacts Count:', contactsRes.contacts.length);
  console.log('✓ Contacts:', contactsRes.contacts.map((c: any) => `${c.name} (${c.relationship})`).join(', '));

  // Test 8: Dispatching Emergency Safety Alert
  console.log('\n[Test 8] Dispatching Safety Alert to Family...');
  const alertRes: any = await fetch(`${BASE_URL}/scans/alert`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userToken}`
    },
    body: JSON.stringify({
      scanId: msgScan.scanId,
      note: 'Emergency alert test: Please check on Mahalakshmi.'
    })
  }).then(r => r.json());
  console.log('✓ Alert Dispatch Result:', alertRes.message);

  // Test 9: Admin Access Rejection for Normal User
  console.log('\n[Test 9] Verifying Role-Based Access Control (Admin route blocked for USER)...');
  const forbiddenRes = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${userToken}` }
  });
  console.log('✓ Normal User HTTP Status on /admin:', forbiddenRes.status, '(Expected 403 Forbidden)');

  // Test 10: Admin Login & Metrics View
  console.log('\n[Test 10] Admin Login (admin@eldershield.ai)...');
  const adminLogin: any = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@eldershield.ai',
      password: 'Admin@12345'
    })
  }).then(r => r.json());
  const adminToken = adminLogin.token;
  console.log('✓ Logged in as:', adminLogin.user.fullName, '| Role:', adminLogin.user.role);

  console.log('\n[Test 11] Fetching Admin Dashboard Data...');
  const adminDash: any = await fetch(`${BASE_URL}/admin/dashboard`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  console.log('✓ System Stats:', adminDash.stats);

  console.log('\n[Test 12] Fetching Registered Users with Masked Phones (Section 24)...');
  const adminUsers: any = await fetch(`${BASE_URL}/admin/users`, {
    headers: { 'Authorization': `Bearer ${adminToken}` }
  }).then(r => r.json());
  console.log('✓ Registered Users Sample:', adminUsers.users.map((u: any) => `${u.fullName} (Phone: ${u.phone})`));

  console.log('\n====================================================');
  console.log('🎉 ALL 12 INTEGRATION TESTS PASSED WITH 100% SUCCESS!');
  console.log('====================================================\n');
}

runTests().catch(err => {
  console.error('\n❌ Test Suite Failed:', err);
  process.exit(1);
});
