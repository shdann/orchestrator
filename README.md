# OpenClaw — Local Multi-Agent AI Team

A production-ready multi-agent system using opencode CLI as the execution backbone.

## Quick Start

```bash
# Install opencode
npm install -g opencode-ai

# Clone / navigate to openclaw
cd /home/shdann/openclaw

# Run a task
./claw "research the best local vector databases"
./claw "write a Python script to parse JSON logs"
./claw "schedule daily backup of /var/data at 2am"
./claw "draft a README for my project"

# Force a specific agent
./claw "find all TODO comments in the codebase" --agent research

# Debug mode
./claw "build a REST API in FastAPI" --debug
```

## Agents

| Agent | Role | Tools |
|-------|------|-------|
| `orchestrator` | Routes tasks, merges results | queue, memory, spawn |
| `research` | Search, summarize, extract | web_search, url_fetch, vectors |
| `builder` | Code, infra, debug | opencode, shell, git, files |
| `ops` | Schedule, organize, automate | cron, shell, files, notify |
| `comms` | Draft, document, format | templates, files |

## Subagents

Spawned by primary agents for narrow tasks:

- `code_reviewer` — spawned by builder for review passes
- `doc_formatter` — spawned by comms for structured docs
- `file_indexer` — spawned by ops for directory scanning

## Folder Structure

```
openclaw/
├── claw                          # CLI entry point
├── ARCHITECTURE.md               # System diagram + flow
├── agents/
│   ├── orchestrator.md/.yaml     # Identity + capabilities
│   ├── research.md/.yaml
│   ├── builder.md/.yaml
│   ├── ops.md/.yaml
│   └── comms.md/.yaml
├── orchestrator/
│   ├── orchestrator.py           # Main loop
│   ├── rules.yaml                # Intent routing rules
│   └── registry.yaml            # Agent registry
├── config/
│   ├── tool_permissions.yaml     # Per-agent tool access
│   └── token_optimization.yaml  # Token budget rules
├── templates/
│   ├── prompts/
│   │   ├── orchestrator.txt      # System prompts (minimal)
│   │   ├── research.txt
│   │   ├── builder.txt
│   │   ├── ops.txt
│   │   ├── comms.txt
│   │   └── subagents/
│   │       ├── code_reviewer.txt
│   │       ├── doc_formatter.txt
│   │       └── file_indexer.txt
│   └── schemas/
├── memory/
│   ├── scratchpad/               # Session-scoped temp memory
│   ├── vectors/                  # ChromaDB long-term store
│   └── projects/                 # Per-project structured memory
├── workflows/
│   └── example_workflow.yaml     # Multi-step workflow example
└── logs/                         # JSONL execution logs (daily rotation)
```

## Memory Strategy

| Store | Backend | TTL | Purpose |
|-------|---------|-----|---------|
| scratchpad | files | session | Intermediate state |
| vectors | ChromaDB | permanent | Distilled knowledge |
| project | JSON files | permanent | Goals, decisions, artifacts |
| logs | JSONL | 30 days | Execution audit trail |

**Never stored:** raw conversation turns, full web pages, complete file dumps.

## opencode Integration

The builder and ops agents call opencode CLI directly:

```bash
# How the orchestrator calls opencode per agent task
opencode run --prompt-file /path/to/task_prompt.txt --output json --no-verbose
```

The prompt file contains:
1. Agent system prompt (from `templates/prompts/<agent>.txt`)
2. Memory context (distilled refs, ≤1024 tokens)
3. Task packet (JSON)

## Requirements

- Python 3.10+
- opencode CLI (`npm install -g opencode-ai`)
- ChromaDB (`pip install chromadb`) — for long-term vector memory
- Ollama with `nomic-embed-text` — for local embeddings (optional)

## Environment Variables

```bash
CLAW_ROOT          # auto-set by claw script
CLAW_DEBUG         # true | false
CLAW_AGENT_OVERRIDE # force specific agent
CLAW_SESSION_ID    # set session ID explicitly
```
