import { chromium } from 'playwright';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    const rawHtml = fs.readFileSync('/tmp/test-plan-vwo.html', 'utf8');

    // Extract body content (strip html/head/body tags)
    const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    let bodyContent = bodyMatch ? bodyMatch[1] : rawHtml;

    // Replace emoji priority markers with styled spans
    bodyContent = bodyContent
        .replace(/🔴/g, '<span class="priority-high">🔴 High</span>')
        .replace(/🟡/g, '<span class="priority-med">🟡 Medium</span>')
        .replace(/🟢/g, '<span class="priority-low">🟢 Low</span>');

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>
  @page { margin: 0.8in; size: A4; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    font-size: 11pt;
    line-height: 1.6;
    color: #1a1a1a;
    padding: 0 10px;
  }
  h1 { font-size: 22pt; color: #1a3a5c; border-bottom: 3px solid #2563eb; padding-bottom: 8px; margin-top: 0; }
  h2 { font-size: 16pt; color: #1a3a5c; border-bottom: 2px solid #93c5fd; padding-bottom: 4px; margin-top: 28px; }
  h3 { font-size: 13pt; color: #1e40af; margin-top: 20px; }
  table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 9.5pt; page-break-inside: avoid; }
  th { background: #2563eb; color: white; padding: 8px 10px; text-align: left; font-weight: 600; }
  td { padding: 6px 10px; border: 1px solid #d1d5db; vertical-align: top; }
  tr:nth-child(even) { background: #f8fafc; }
  code { background: #f1f5f9; padding: 2px 5px; border-radius: 3px; font-size: 9.5pt; font-family: 'SF Mono', 'Fira Code', monospace; }
  pre { background: #1e293b; color: #e2e8f0; padding: 12px 16px; border-radius: 6px; font-size: 9pt; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  pre code { background: none; padding: 0; color: inherit; }
  ul, ol { padding-left: 24px; }
  li { margin: 4px 0; }
  blockquote { border-left: 4px solid #2563eb; margin: 12px 0; padding: 8px 16px; background: #eff6ff; }
  hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
  strong { color: #111827; }
  .page-break { page-break-before: always; }
  .priority-high { color: #dc2626; font-weight: 700; }
  .priority-med { color: #d97706; font-weight: 700; }
  .priority-low { color: #16a34a; font-weight: 700; }
  .footer { text-align: center; color: #9ca3af; font-size: 9pt; margin-top: 40px; border-top: 1px solid #e5e7eb; padding-top: 12px; }
  .wireframe { background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 8px; padding: 16px; font-family: 'SF Mono', monospace; font-size: 9pt; white-space: pre; line-height: 1.3; color: #475569; }
</style>
</head>
<body>
${bodyContent}
<div class="footer">
  <p>Test Plan: VWO App — Login & Dashboard Pages | Version 1.0 | 2026-06-26 | Confidential</p>
  <p>Author: Pramod Dutta | Company: TheTestingAcademy</p>
</div>
</body>
</html>`;

    await page.setContent(html, { waitUntil: 'networkidle' });
    await page.pdf({
        path: path.resolve(__dirname, '../../test-plan-vwo-login-dashboard.pdf'),
        format: 'A4',
        margin: { top: '0.7in', bottom: '0.7in', left: '0.7in', right: '0.7in' },
        printBackground: true,
        displayHeaderFooter: true,
        headerTemplate: '<div style="font-size:8pt;color:#9ca3af;text-align:right;width:100%;padding-right:20px;">Test Plan: VWO App — Login & Dashboard</div>',
        footerTemplate: '<div style="font-size:8pt;color:#9ca3af;text-align:center;width:100%;">Page <span class="pageNumber"></span> of <span class="totalPages"></span></div>',
    });

    console.log('✅ PDF generated: test-plan-vwo-login-dashboard.pdf');
    await browser.close();
})();
