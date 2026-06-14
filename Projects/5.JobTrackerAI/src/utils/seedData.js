import { getAllJobs, saveJobs, getJobCount } from "../db";

export async function seedIfEmpty() {
  const count = await getJobCount();
  if (count > 0) return false;

  const now = new Date();
  const fmt = (d) => d.toISOString().slice(0, 10);
  const ago = (d) => fmt(new Date(now - d * 86400000));
  const ahead = (d) => fmt(new Date(now.getTime() + d * 86400000));

  // Guaranteed "this week": next weekday still in the current week (Mon-Sat, not today)
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = dayOfWeek === 0 ? -1 : 6 - dayOfWeek;
  const safeThisWeek = daysUntilSaturday >= 2 ? ahead(2) : ahead(14);

  // Guaranteed "this month": offset that stays within current month, past this week
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysLeftInMonth = lastDay - now.getDate();
  const safeThisMonth = daysLeftInMonth >= 12 ? ahead(10) : ahead(45);

  // Due today
  const safeDueToday = fmt(now);

  const ts = () => new Date().toISOString();
  const uid = () => crypto.randomUUID?.() ?? `job_${Date.now()}_${Math.random().toString(16).slice(2)}`;

  const raw = [
    { companyName: "Stripe", role: "Senior QA Engineer", jobUrl: "https://www.linkedin.com/jobs/view/stripe-senior-qa", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(3), salaryRange: "$180-220K", notes: "Referral via Alex. Hiring manager is Sarah Chen.", status: "applied", priority: "critical", followUpDate: ago(1) },
    { companyName: "Google", role: "Software Engineer in Test", jobUrl: "https://www.linkedin.com/jobs/view/google-set", resumeUsed: "SDE_Resume_v3", appliedDate: ago(12), salaryRange: "", notes: "", status: "rejected", priority: "high", followUpDate: "" },
    { companyName: "Netflix", role: "QA Architect", jobUrl: "https://www.linkedin.com/jobs/view/netflix-qa", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(45), salaryRange: "$220-280K", notes: "Applied via careers page. No referral yet.", status: "wishlist", priority: "high", followUpDate: safeThisMonth },
    { companyName: "Atlassian", role: "Test Automation Lead", jobUrl: "https://www.linkedin.com/jobs/view/atlassian-automation", resumeUsed: "SDE_Resume_v3", appliedDate: ago(7), salaryRange: "₹45-60 LPA", notes: "Recruiter: Priya Sharma. Followed up on phone.", status: "follow-up", priority: "critical", followUpDate: ago(2) },
    { companyName: "Microsoft", role: "SDET II", jobUrl: "https://www.linkedin.com/jobs/view/ms-sdet", resumeUsed: "SDE_Resume_v3", appliedDate: ago(21), salaryRange: "$150-180K", notes: "Round 1 scheduled for next week. Preparing system design.", status: "interview", priority: "high", followUpDate: safeThisWeek },
    { companyName: "Amazon", role: "Quality Assurance Engineer", jobUrl: "https://www.linkedin.com/jobs/view/amazon-qae", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(30), salaryRange: "", notes: "", status: "rejected", priority: "medium", followUpDate: "" },
    { companyName: "Meta", role: "Test Engineering Manager", jobUrl: "https://www.linkedin.com/jobs/view/meta-tem", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(14), salaryRange: "$200-250K", notes: "Reached out to hiring manager on LinkedIn.", status: "applied", priority: "high", followUpDate: safeDueToday },
    { companyName: "Spotify", role: "Senior Automation Engineer", jobUrl: "https://www.linkedin.com/jobs/view/spotify-senior", resumeUsed: "SDE_Resume_v3", appliedDate: ago(60), salaryRange: "", notes: "Position filled. Keeping for reference.", status: "rejected", priority: "low", followUpDate: "", archived: true },
    { companyName: "Canva", role: "QA Lead", jobUrl: "https://www.linkedin.com/jobs/view/canva-qa-lead", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(5), salaryRange: "₹50-70 LPA", notes: "Rounds completed. Verbal offer received!", status: "offer", priority: "critical", followUpDate: safeThisWeek },
    { companyName: "Zomato", role: "SDET", jobUrl: "https://www.linkedin.com/jobs/view/zomato-sdet", resumeUsed: "SDE_Resume_v2", appliedDate: ago(90), salaryRange: "₹30-40 LPA", notes: "Ghosted after HR round.", status: "rejected", priority: "low", followUpDate: "", archived: true },
    { companyName: "HubSpot", role: "QA Engineer II", jobUrl: "https://www.linkedin.com/jobs/view/hubspot-qa2", resumeUsed: "QA_Resume_v1", appliedDate: ago(10), salaryRange: "$110-140K", notes: "Take-home submitted. Awaiting feedback.", status: "interview", priority: "medium", followUpDate: safeDueToday },
    { companyName: "Vercel", role: "Platform QA Engineer", jobUrl: "https://www.linkedin.com/jobs/view/vercel-platform", resumeUsed: "SDE_Resume_v3", appliedDate: ago(2), salaryRange: "", notes: "Quick apply. No cover letter.", status: "applied", priority: "medium", followUpDate: safeThisMonth },
    { companyName: "Notion", role: "Test Infrastructure Engineer", jobUrl: "https://www.linkedin.com/jobs/view/notion-test", resumeUsed: "SDE_Resume_v3", appliedDate: ago(1), salaryRange: "$160-200K", notes: "Emailed recruiter - no response yet.", status: "applied", priority: "high", followUpDate: ahead(2) },
    { companyName: "Figma", role: "Quality Specialist", jobUrl: "https://www.linkedin.com/jobs/view/figma-qs", resumeUsed: "QA_Resume_v1", appliedDate: ago(18), salaryRange: "$130-160K", notes: "Phone screen done. Technical round next.", status: "interview", priority: "medium", followUpDate: ahead(7) },
    { companyName: "Razorpay", role: "Lead SDET", jobUrl: "https://www.linkedin.com/jobs/view/razorpay-lead", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(4), salaryRange: "₹55-75 LPA", notes: "Referral from Rohan. Fast-track.", status: "interview", priority: "critical", followUpDate: ahead(1) },
    { companyName: "Postman", role: "API Test Engineer", jobUrl: "https://www.linkedin.com/jobs/view/postman-api", resumeUsed: "SDE_Resume_v2", appliedDate: ago(25), salaryRange: "", notes: "Dream company! Preparing scenarios.", status: "wishlist", priority: "high", followUpDate: "" },
    { companyName: "Cred", role: "QA Automation Lead", jobUrl: "https://www.linkedin.com/jobs/view/cred-automation", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(8), salaryRange: "₹60-80 LPA", notes: "Offered! Base: 65L + 15L ESOPs.", status: "offer", priority: "critical", followUpDate: ahead(2) },
    { companyName: "Swiggy", role: "QA Engineer", jobUrl: "https://www.linkedin.com/jobs/view/swiggy-qa", resumeUsed: "QA_Resume_v1", appliedDate: ago(40), salaryRange: "₹25-35 LPA", notes: "", status: "rejected", priority: "low", followUpDate: "" },
    { companyName: "Linear", role: "Test Engineer", jobUrl: "https://www.linkedin.com/jobs/view/linear-test", resumeUsed: "SDE_Resume_v3", appliedDate: ago(0), salaryRange: "$140-180K", notes: "Just applied today!", status: "applied", priority: "high", followUpDate: ahead(14) },
    { companyName: "BrowserStack", role: "Product QA Manager", jobUrl: "https://www.linkedin.com/jobs/view/browserstack-pm", resumeUsed: "QA_Lead_Resume_v3", appliedDate: ago(15), salaryRange: "₹40-55 LPA", notes: "Followed up twice. HR says position on hold.", status: "follow-up", priority: "medium", followUpDate: ago(3) },
  ];

  const seeded = raw.map((j, i) => {
    const createdAt = new Date(Date.now() - (20 - i) * 3600000).toISOString();
    const log = [];
    log.push({ type: "created", timestamp: createdAt, detail: "Job created" });
    if (j.status !== "wishlist") log.push({ type: "status_change", timestamp: ts(), detail: `Status changed to ${j.status}` });
    if (j.resumeUsed?.includes("v3")) log.push({ type: "resume_change", timestamp: ts(), detail: `Resume changed to ${j.resumeUsed}` });
    if (j.priority === "critical") log.push({ type: "priority_change", timestamp: ts(), detail: "Priority set to critical" });
    if (j.notes) log.push({ type: "notes_update", timestamp: ts(), detail: "Notes updated" });
    return { ...j, id: uid(), createdAt, updatedAt: ts(), activityLog: log, archived: j.archived || false };
  });

  await saveJobs(seeded);
  return true;
}
