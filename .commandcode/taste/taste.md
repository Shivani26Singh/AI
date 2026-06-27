# Taste (Continuously Learned by [CommandCode][cmd])

[cmd]: https://commandcode.ai/

# n8n-workflows
See [n8n-workflows/taste.md](n8n-workflows/taste.md)

# git
- Never commit/push using bot credentials — always use "Shivani Singh" as the author name for all git operations across all projects. Confidence: 0.85

# project-structure
- Initialize new projects with B.L.A.S.T. protocol memory files: Objective.md (North Star), LLM.md (Project Constitution with data schemas, behavioral rules, architectural invariants), findings.md (research, architecture, constraints), task_plan.md (phases, goals, checklists), and progress.md (what was done, errors, results). Confidence: 0.70
- Keep framework reference files (B.L.A.S.T.md, RICE_POT.md, prompt.md) in an Input/ directory within each project as reference materials. Confidence: 0.60

# ui
- For Kanban board status columns: use yellow/amber for Follow-up, green/emerald for Offer, and a visually distinct meaningful color for Interview (not teal since it blends with adjacent green). Adjacent columns should have clearly distinguishable colors. Confidence: 0.70

# interaction-style
- Prefer performing tasks directly (running commands, seeding data, fixing issues) rather than giving the user step-by-step instructions to do it themselves. The user expects the assistant to take action, not delegate back. Confidence: 0.75

# documentation
- For Rovo agent docs: list skills as exact Rovo UI checkbox names in a plain numbered list per agent, not buried in prose-heavy tables with explanations. Users need to quickly see what to tick without parsing narrative text. Confidence: 0.70

# rovo-agents
- For sprint summary agents: if a story is in the current sprint but its task was completed in the previous sprint (assigned to the same user), count that task in the previous sprint only — do not double-count it in the current sprint. Confidence: 0.70
