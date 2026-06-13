import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

function parseSection(text, heading) {
  const lines = text.split('\n');
  const content = [];
  let inSection = false;
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.toLowerCase().includes(heading.toLowerCase())) {
      inSection = true;
      continue;
    }
    if (inSection) {
      if (/^\d+\.\s/.test(trimmed) || /^#/.test(trimmed)) break;
      content.push(trimmed.replace(/^[-\u2022*]\s*/, '').trim());
    }
  }
  return content;
}

function extractAllSections(text) {
  const sections = {};
  const patterns = [
    { key: 'objective', heading: 'Objective' },
    { key: 'inScope', heading: 'In Scope' },
    { key: 'outScope', heading: 'Out of Scope' },
    { key: 'focusAreas', heading: 'Focus Areas' },
    { key: 'testApproach', heading: 'Test Approach' },
    { key: 'testDeliverables', heading: 'Test Deliverables' },
    { key: 'teamSchedule', heading: 'Team & Schedule' },
    { key: 'entryCriteria', heading: 'Entry Criteria' },
    { key: 'exitCriteria', heading: 'Exit Criteria' },
    { key: 'dependencies', heading: 'Dependencies' },
    { key: 'risks', heading: 'Risks' },
    { key: 'assumptions', heading: 'Assumptions' },
    { key: 'openQuestions', heading: 'Open Questions' },
  ];

  for (const { key, heading } of patterns) {
    const items = parseSection(text, heading);
    if (items.length > 0) {
      sections[key] = items;
    }
  }
  return sections;
}

function heading(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, size: 28, font: 'Calibri' })],
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 300, after: 120 },
  });
}

function bodyItem(text) {
  return new Paragraph({
    children: [new TextRun({ text: `\u2022 ${text}`, size: 22, font: 'Calibri' })],
    spacing: { before: 40, after: 40 },
    indent: { left: 360 },
  });
}

function bodyParagraph(text) {
  return new Paragraph({
    children: [new TextRun({ text, size: 22, font: 'Calibri' })],
    spacing: { before: 40, after: 40 },
  });
}

export async function generateDocx(text, issueId) {
  const sections = extractAllSections(text);

  const children = [
    new Paragraph({
      children: [new TextRun({ text: 'Feature Test Strategy', bold: true, size: 36, font: 'Calibri' })],
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `For: ${issueId}`, size: 24, font: 'Calibri', italics: true })],
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
    }),
  ];

  if (sections.objective) {
    children.push(heading('1. Objective'));
    sections.objective.forEach(item => children.push(bodyParagraph(item)));
  }

  children.push(heading('2. Scope'));
  if (sections.inScope && sections.inScope.length > 0) {
    children.push(heading('In Scope'));
    sections.inScope.forEach(item => children.push(bodyItem(item)));
  }
  if (sections.outScope && sections.outScope.length > 0) {
    children.push(heading('Out of Scope'));
    sections.outScope.forEach(item => children.push(bodyItem(item)));
  }
  if ((!sections.inScope || sections.inScope.length === 0) && (!sections.outScope || sections.outScope.length === 0)) {
    children.push(bodyParagraph('Insufficient information to determine.'));
  }

  if (sections.focusAreas && sections.focusAreas.length > 0) {
    children.push(heading('3. Focus Areas'));
    sections.focusAreas.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.testApproach && sections.testApproach.length > 0) {
    children.push(heading('4. Test Approach'));
    sections.testApproach.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.testDeliverables && sections.testDeliverables.length > 0) {
    children.push(heading('5. Test Deliverables'));
    sections.testDeliverables.forEach(item => children.push(bodyItem(item)));
  }

  children.push(heading('6. Team & Schedule'));
  if (sections.teamSchedule && sections.teamSchedule.length > 0) {
    sections.teamSchedule.forEach(item => children.push(bodyParagraph(item)));
  } else {
    children.push(bodyParagraph('Insufficient information to determine.'));
  }

  if (sections.entryCriteria && sections.entryCriteria.length > 0) {
    children.push(heading('7. Entry Criteria'));
    sections.entryCriteria.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.exitCriteria && sections.exitCriteria.length > 0) {
    children.push(heading('8. Exit Criteria'));
    sections.exitCriteria.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.dependencies && sections.dependencies.length > 0) {
    children.push(heading('9. Dependencies'));
    sections.dependencies.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.risks && sections.risks.length > 0) {
    children.push(heading('10. Risks'));
    sections.risks.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.assumptions && sections.assumptions.length > 0) {
    children.push(heading('11. Assumptions'));
    sections.assumptions.forEach(item => children.push(bodyItem(item)));
  }

  if (sections.openQuestions && sections.openQuestions.length > 0) {
    children.push(heading('12. Open Questions / Requirement Gaps'));
    sections.openQuestions.forEach(item => children.push(bodyItem(item)));
  }

  const doc = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, `TestStrategy-${issueId}.docx`);
}
