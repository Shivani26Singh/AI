import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  HeadingLevel,
  BorderStyle,
  convertInchesToTwip,
  WidthType,
} from "docx";

const HEADING_MAP = {
  "#": HeadingLevel.HEADING_1,
  "##": HeadingLevel.HEADING_2,
  "###": HeadingLevel.HEADING_3,
  "####": HeadingLevel.HEADING_4,
};

const TABLE_BORDERS = {
  top: { style: BorderStyle.SINGLE, size: 1 },
  bottom: { style: BorderStyle.SINGLE, size: 1 },
  left: { style: BorderStyle.SINGLE, size: 1 },
  right: { style: BorderStyle.SINGLE, size: 1 },
};

function parseInlineFormatting(text) {
  const runs = [];
  let remaining = text;

  const patterns = [
    { regex: /\*\*\*(.+?)\*\*\*/, handler: (m) => createRun(m[1], true, true) },
    { regex: /\*\*(.+?)\*\*/, handler: (m) => createRun(m[1], true, false) },
    { regex: /___(.+?)___/, handler: (m) => createRun(m[1], true, true) },
    { regex: /__(.+?)__/, handler: (m) => createRun(m[1], true, false) },
    { regex: /\*(.+?)\*/, handler: (m) => createRun(m[1], false, true) },
    { regex: /_(.+?)_/, handler: (m) => createRun(m[1], false, true) },
    { regex: /`([^`]+)`/, handler: (m) => new TextRun({ text: m[1], font: "Courier New", size: 20 }) },
  ];

  while (remaining.length > 0) {
    let earliest = null;

    for (const p of patterns) {
      p.regex.lastIndex = 0;
      const match = p.regex.exec(remaining);
      if (match && (!earliest || match.index < earliest.index)) {
        earliest = { ...match, handler: p.handler };
      }
    }

    if (!earliest) {
      runs.push(new TextRun({ text: remaining, size: 22 }));
      break;
    }

    if (earliest.index > 0) {
      runs.push(new TextRun({ text: remaining.slice(0, earliest.index), size: 22 }));
    }

    runs.push(earliest.handler(earliest));
    remaining = remaining.slice(earliest.index + earliest[0].length);
  }

  return runs.length > 0 ? runs : [new TextRun({ text, size: 22 })];
}

function createRun(text, bold = false, italic = false) {
  return new TextRun({ text, bold, italics: italic, size: 22 });
}

function isTableRow(line) {
  return /^\|.+\|$/.test(line.trim());
}

function isTableSeparator(line) {
  return /^\|[\s\-:]+\|[\s\-:|]+\|$/.test(line.trim());
}

function parseTableHeader(line) {
  return line
    .trim()
    .split("|")
    .filter(Boolean)
    .map((cell) => cell.trim());
}

function parseTableRow(line) {
  return line
    .trim()
    .split("|")
    .filter(Boolean)
    .map((cell) => cell.trim());
}

function createTable(headers, rows) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: h, bold: true, size: 20 })] })],
          borders: TABLE_BORDERS,
        })
    ),
  });

  const dataRows = rows.map(
    (row) =>
      new TableRow({
        children: row.map(
          (cell) =>
            new TableCell({
              children: [new Paragraph({ children: parseInlineFormatting(cell) })],
              borders: TABLE_BORDERS,
            })
        ),
      })
  );

  return new Table({
    rows: [headerRow, ...dataRows],
    width: { size: 100, type: WidthType.PERCENTAGE },
  });
}

function createHeadingBlock(text, level) {
  return new Paragraph({
    text,
    heading: level,
    spacing: { before: 240, after: 120 },
  });
}

function createParagraphBlock(text) {
  if (!text.trim()) {
    return new Paragraph({ spacing: { after: 60 } });
  }
  return new Paragraph({
    children: parseInlineFormatting(text),
    spacing: { after: 60 },
  });
}

function createListItemBlock(text) {
  const cleaned = text.replace(/^(\d+\.\s+|[-*+]\s+)/, "");
  return new Paragraph({
    children: parseInlineFormatting(cleaned),
    bullet: { level: 0 },
    spacing: { after: 40 },
  });
}

function isListItem(line) {
  return /^\s*(\d+\.\s+|[-*+]\s+)/.test(line);
}

function isHorizontalRule(line) {
  return /^[-\s*_]{3,}$/.test(line.trim()) && !line.includes("|");
}

export async function markdownToDocx(markdown) {
  if (!markdown || typeof markdown !== "string" || !markdown.trim()) {
    throw new Error("No content to export.");
  }

  const lines = markdown.split("\n");
  const children = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (!trimmed) {
      i++;
      continue;
    }

    // Horizontal rule
    if (isHorizontalRule(trimmed)) {
      children.push(
        new Paragraph({
          children: [],
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, space: 1 } },
          spacing: { before: 120, after: 120 },
        })
      );
      i++;
      continue;
    }

    // Heading
    const headingMatch = trimmed.match(/^(#{1,4})\s+(.+)/);
    if (headingMatch) {
      const level = HEADING_MAP[headingMatch[1]];
      if (level) {
        children.push(createHeadingBlock(headingMatch[2], level));
      }
      i++;
      continue;
    }

    // Table
    if (isTableRow(trimmed)) {
      const tableLines = [];
      while (i < lines.length && isTableRow(lines[i].trim())) {
        tableLines.push(lines[i].trim());
        i++;
      }

      const headerRow = tableLines[0];
      const separatorIdx = tableLines.findIndex((l) => isTableSeparator(l));
      const headers = parseTableHeader(headerRow);
      const dataRows = tableLines
        .slice(separatorIdx >= 0 ? separatorIdx + 1 : 1)
        .map(parseTableRow)
        .filter((r) => r.length > 0);

      children.push(createTable(headers, dataRows));
      continue;
    }

    // Blockquote
    if (trimmed.startsWith(">")) {
      const quoteLines = [];
      while (i < lines.length && (lines[i].trim().startsWith(">") || lines[i].trim() === "")) {
        const qLine = lines[i].trim();
        if (qLine) {
          quoteLines.push(qLine.replace(/^>\s?/, ""));
        } else if (i + 1 < lines.length && lines[i + 1].trim().startsWith(">")) {
          quoteLines.push("");
        } else {
          break;
        }
        i++;
      }

      children.push(
        new Paragraph({
          children: parseInlineFormatting(quoteLines.join(" ")),
          indent: { left: convertInchesToTwip(0.5) },
          border: { left: { style: BorderStyle.SINGLE, size: 6, space: 8 } },
          italics: true,
          spacing: { before: 80, after: 80 },
        })
      );
      continue;
    }

    // List item
    if (isListItem(trimmed)) {
      children.push(createListItemBlock(trimmed));
      i++;
      continue;
    }

    // Regular paragraph
    children.push(createParagraphBlock(trimmed));
    i++;
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
            },
          },
        },
        children,
      },
    ],
  });

  return await Packer.toBlob(doc);
}

export function downloadDocx(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
