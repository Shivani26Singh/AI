const fs = require("fs");
const path = require("path");

const inputDir = path.join(__dirname, "Input");

function readSkill(name) {
  return fs.readFileSync(path.join(inputDir, name), "utf8");
}

function escapeJSON(str) {
  return str
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, "\\n")
    .replace(/\r/g, "")
    .replace(/\t/g, "\\t");
}

const tpSkill = readSkill("TestPlan_From_PRD_WithTemplate_Skill.md");
const tcSkill = readSkill("TC_Only_SKILL.md");
const pwSkill = readSkill("playwright-e2e.SKILL.md");

const tpSystemPrompt = `${tpSkill}`;
const tcSystemPrompt = `${tcSkill}`;
const pwSystemPrompt = `${pwSkill}`;

const tpText =
  "=Generate a complete Test Plan from the PRD below.\\n\\nPRD:\\n\\n{{ $json.text }}";
const tcText =
  '=Generate exhaustive test cases from this Test Plan.\\n\\n{{ $node["Generate Test Plan"].json.output }}';
const pwText =
  '=Generate Playwright TypeScript scripts.\\n\\n{{ $node["Generate Test Cases"].json.output }}';

const codeJS = `const items = $input.all();

return [{
  json: {},
  binary: {
    testPlanFile: items.find(i => i.binary?.testPlanFile)?.binary?.testPlanFile,
    testCasesFile: items.find(i => i.binary?.testCasesFile)?.binary?.testCasesFile,
    playwrightFile: items.find(i => i.binary?.playwrightFile)?.binary?.playwrightFile
  }
}];`;

const workflow = {
  name: "STLC Agent v2",
  nodes: [
    {
      parameters: {
        formTitle: "STLC Agent",
        formDescription:
          "Upload a PRD PDF to generate Test Plan, Test Cases, and Playwright scripts.",
        formFields: {
          values: [
            {
              fieldLabel: "Upload PRD PDF",
              fieldType: "file",
              fieldName: "prd_pdf",
              multipleFiles: false,
              acceptFileTypes: ".pdf",
              requiredField: true,
            },
          ],
        },
        options: {
          buttonLabel: "Generate QA Artifacts",
        },
      },
      type: "n8n-nodes-base.formTrigger",
      typeVersion: 2.5,
      position: [-1240, 520],
      id: "n-form",
      name: "STLC Agent Form",
      webhookId: "stlc-agent-prd-v2",
    },
    {
      parameters: {
        operation: "pdf",
        binaryPropertyName: "prd_pdf",
        options: {
          maxPages: -1,
        },
      },
      type: "n8n-nodes-base.extractFromFile",
      typeVersion: 1.1,
      position: [-980, 520],
      id: "n-extract",
      name: "Extract PRD Content",
    },
    {
      parameters: {
        promptType: "define",
        text: tpText,
        options: {
          systemMessage: tpSystemPrompt,
        },
      },
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 3.1,
      position: [-720, 520],
      id: "n-tp",
      name: "Generate Test Plan",
    },
    {
      parameters: {
        sourceProperty: "output",
        fileName: "test_plan.md",
        options: {
          encoding: "utf8",
          dataPropertyName: "testPlanFile",
        },
      },
      type: "n8n-nodes-base.convertToFile",
      typeVersion: 1.2,
      position: [-460, 400],
      id: "n-save-tp",
      name: "Save Test Plan",
    },
    {
      parameters: {
        resume: "timeInterval",
        waitAmount: 2,
        unit: "seconds",
      },
      type: "n8n-nodes-base.wait",
      typeVersion: 1.1,
      position: [-460, 640],
      id: "n-wait1",
      name: "Wait 2s (TP→TC)",
    },
    {
      parameters: {
        promptType: "define",
        text: tcText,
        options: {
          systemMessage: tcSystemPrompt,
        },
      },
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 3.1,
      position: [-200, 640],
      id: "n-tc",
      name: "Generate Test Cases",
    },
    {
      parameters: {
        sourceProperty: "output",
        fileName: "test_cases.csv",
        options: {
          encoding: "utf8",
          dataPropertyName: "testCasesFile",
        },
      },
      type: "n8n-nodes-base.convertToFile",
      typeVersion: 1.2,
      position: [60, 520],
      id: "n-save-tc",
      name: "Save Test Cases",
    },
    {
      parameters: {
        resume: "timeInterval",
        waitAmount: 2,
        unit: "seconds",
      },
      type: "n8n-nodes-base.wait",
      typeVersion: 1.1,
      position: [60, 760],
      id: "n-wait2",
      name: "Wait 2s (TC→PW)",
    },
    {
      parameters: {
        promptType: "define",
        text: pwText,
        options: {
          systemMessage: pwSystemPrompt,
        },
      },
      type: "@n8n/n8n-nodes-langchain.agent",
      typeVersion: 3.1,
      position: [320, 760],
      id: "n-pw",
      name: "Generate Playwright Tests",
    },
    {
      parameters: {
        sourceProperty: "output",
        fileName: "playwright_test_cases.md",
        options: {
          encoding: "utf8",
          dataPropertyName: "playwrightFile",
        },
      },
      type: "n8n-nodes-base.convertToFile",
      typeVersion: 1.2,
      position: [580, 640],
      id: "n-save-pw",
      name: "Save Playwright Tests",
    },
    {
      parameters: {
        model: "gemma2-9b-it",
        options: {},
      },
      type: "@n8n/n8n-nodes-langchain.lmChatGroq",
      typeVersion: 1,
      position: [-720, 920],
      id: "n-brain",
      name: "Brain (Groq)",
      credentials: {
        groqApi: {
          id: "oqcm7gVLkXAkbujO",
          name: "Groq account",
        },
      },
    },
    {
      parameters: {
        mode: "append",
        options: {},
      },
      type: "n8n-nodes-base.merge",
      typeVersion: 3.2,
      position: [840, 400],
      id: "n-merge",
      name: "Merge Outputs",
    },
    {
      parameters: {
        jsCode: codeJS,
      },
      type: "n8n-nodes-base.code",
      typeVersion: 2,
      position: [1120, 400],
      id: "n-code",
      name: "Combine Outputs",
    },
    {
      parameters: {
        operation: "completion",
        respondWith: "returnBinary",
        completionTitle: "QA Artifacts Generated!",
        completionMessage: "Download your files below:",
        inputDataFieldName: "testPlanFile",
        options: {},
      },
      type: "n8n-nodes-base.form",
      typeVersion: 1,
      position: [1400, 400],
      id: "n-download",
      name: "Download Files",
      webhookId: "download-files-form-v2",
    },
  ],
  pinData: {},
  connections: {
    "STLC Agent Form": {
      main: [[{ node: "Extract PRD Content", type: "main", index: 0 }]],
    },
    "Extract PRD Content": {
      main: [[{ node: "Generate Test Plan", type: "main", index: 0 }]],
    },
    "Generate Test Plan": {
      main: [
        [
          { node: "Save Test Plan", type: "main", index: 0 },
          { node: "Wait 2s (TP→TC)", type: "main", index: 0 },
        ],
      ],
    },
    "Save Test Plan": {
      main: [[{ node: "Merge Outputs", type: "main", index: 0 }]],
    },
    "Wait 2s (TP→TC)": {
      main: [[{ node: "Generate Test Cases", type: "main", index: 0 }]],
    },
    "Generate Test Cases": {
      main: [
        [
          { node: "Save Test Cases", type: "main", index: 0 },
          { node: "Wait 2s (TC→PW)", type: "main", index: 0 },
        ],
      ],
    },
    "Save Test Cases": {
      main: [[{ node: "Merge Outputs", type: "main", index: 1 }]],
    },
    "Wait 2s (TC→PW)": {
      main: [[{ node: "Generate Playwright Tests", type: "main", index: 0 }]],
    },
    "Generate Playwright Tests": {
      main: [[{ node: "Save Playwright Tests", type: "main", index: 0 }]],
    },
    "Save Playwright Tests": {
      main: [[{ node: "Merge Outputs", type: "main", index: 2 }]],
    },
    "Merge Outputs": {
      main: [[{ node: "Combine Outputs", type: "main", index: 0 }]],
    },
    "Combine Outputs": {
      main: [[{ node: "Download Files", type: "main", index: 0 }]],
    },
    "Brain (Groq)": {
      ai_languageModel: [
        [
          { node: "Generate Test Plan", type: "ai_languageModel", index: 0 },
          { node: "Generate Test Cases", type: "ai_languageModel", index: 0 },
          { node: "Generate Playwright Tests", type: "ai_languageModel", index: 0 },
        ],
      ],
    },
  },
  active: false,
  settings: {
    executionOrder: "v1",
    binaryMode: "separate",
  },
  versionId: "v2-1",
  meta: {
    instanceId: "e65714bb45e0242a961bbebec312e3fb4dd665cbe5cad23c529ade2be9c3c435",
  },
  nodeGroups: [],
  id: "STLC-Agent-v2",
  tags: [{ name: "AI" }],
};

const outputPath = path.join(__dirname, "STLC_Agent_v2.json");
fs.writeFileSync(outputPath, JSON.stringify(workflow, null, 2), "utf8");

console.log(`Wrote ${outputPath}`);
console.log(`Nodes: ${workflow.nodes.length}`);
console.log(`TP prompt length: ${tpSystemPrompt.length} chars`);
console.log(`TC prompt length: ${tcSystemPrompt.length} chars`);
console.log(`PW prompt length: ${pwSystemPrompt.length} chars`);
