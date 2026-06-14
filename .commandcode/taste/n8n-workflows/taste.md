# n8n-workflows
- Use Groq as the LLM provider for n8n AI Agent nodes. Confidence: 0.65
- Embed skill/prompt instructions directly as inline system prompts within AI Agent nodes rather than using separate Skill nodes. Confidence: 0.65
- For AI Agent nodes with promptType "define", always include a static text prefix in the text parameter (e.g., "=Generate from: {{ $json.data }}") rather than a bare expression like "={{ $json.data }}". Confidence: 0.70
- For ConvertToFile nodes (typeVersion 1.2), use operation: "toText" with sourceProperty pointing to the AI Agent's output field (e.g., "output") for text/markdown/CSV output; do NOT omit the operation parameter as it defaults to CSV mode. Confidence: 0.60
- Prefer gemma2-9b-it over qwen/qwen3-32b on Groq for sequential multi-agent workflows to avoid TPM rate limit errors (6000 vs higher limit). Confidence: 0.60
- For formTrigger typeVersion 2.5, responseMode is NOT a valid parameter — keep options minimal (just buttonLabel). Confidence: 0.50
- In n8n multi-agent sequential workflows, AI Agent output must fork to BOTH the ConvertToFile save node AND the next AI Agent node in a single main output array (e.g., TP Generator → [Save TP, TC Generator]), never route through the Save node to reach the next agent. Confidence: 0.70
- When connecting a single Groq LM Chat node to multiple AI Agents via ai_languageModel, place ALL agent connection entries in a SINGLE flat inner array (not separate arrays per agent) to match n8n's expected format. Confidence: 0.70
