# OpenClaw — Architecture

## System Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        USER / CLI                           │
│                     ./claw "<task>"                         │
└──────────────────────────┬──────────────────────────────────┘
                           │ user_input
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     ORCHESTRATOR                            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ Route Intent│→ │ Decompose    │→ │ Build Task Packets │  │
│  └─────────────┘  └──────────────┘  └─────────┬─────────┘  │
│                                               │             │
│  ┌─────────────────────────────────────────  ▼  ─────────┐ │
│  │                  TASK QUEUE                            │ │
│  │  { id, goal, agent, priority, tools, depends_on }     │ │
│  └──────────┬───────────┬───────────┬──────────┬─────────┘ │
│             │           │           │          │            │
└─────────────┼───────────┼───────────┼──────────┼────────────┘
              │           │           │          │
              ▼           ▼           ▼          ▼
    ┌──────────────┐ ┌─────────┐ ┌───────┐ ┌────────┐
    │   RESEARCH   │ │ BUILDER │ │  OPS  │ │ COMMS  │
    │              │ │         │ │       │ │        │
    │ web_search   │ │opencode │ │ cron  │ │ draft  │
    │ url_fetch    │ │file_edit│ │ files │ │ format │
    │ summarize    │ │shell    │ │ notify│ │ docs   │
    │ vector_query │ │git_ops  │ │monitor│ │ email  │
    └──────┬───────┘ └────┬────┘ └───┬───┘ └───┬────┘
           │              │          │          │
           │         ┌────┴─────┐    │          │
           │         │ SUBAGENTS│    │          │
           │         │ reviewer │    │          │
           │         │ indexer  │    │          │
           │         └──────────┘    │          │
           │                         │          │
           └──────────────┬──────────┘          │
                          │◄────────────────────┘
                          ▼
            ┌─────────────────────────┐
            │      MERGE LAYER        │
            │  sequential | parallel  │
            │  conditional            │
            └────────────┬────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │      MEMORY STORE       │
            │  scratchpad (session)   │
            │  vectors (long-term)    │
            │  project (structured)   │
            │  logs (append-only)     │
            └─────────────────────────┘
                         │
                         ▼
            ┌─────────────────────────┐
            │     FINAL RESPONSE      │
            │   JSON → CLI output     │
            └─────────────────────────┘
```

## Component Roles

| Component | Purpose |
|-----------|---------|
| `./claw` | Shell entry point. Parses args, invokes orchestrator |
| `orchestrator.py` | Intent routing, task decomposition, result merging |
| `rules.yaml` | Keyword→agent routing rules |
| `registry.yaml` | Agent inventory, capabilities, requirements |
| `tool_permissions.yaml` | Per-agent tool access matrix |
| `agents/*.yaml` | Agent capability declarations |
| `agents/*.md` | Agent identity and output schemas |
| `templates/prompts/` | Minimal system prompts per agent |
| `memory/` | scratchpad, vectors, project, logs |
| `workflows/` | Declarative multi-step workflow definitions |

## Data Flow

```
user_input
  → orchestrator: classify intent
  → route_intent(): match rules.yaml → agent list
  → make_task(): build JSON task packets
  → run_agent_via_opencode(): write prompt, call opencode CLI
  → opencode: executes model call, returns JSON
  → save_to_memory(): distill result to memory store
  → merge_results(): combine all agent outputs
  → print JSON to stdout
```

## Task Packet Format

```json
{
  "id": "uuid",
  "goal": "one sentence task description",
  "agent": "research|builder|ops|comms",
  "priority": 1,
  "tools_allowed": ["web_search", "file_write"],
  "depends_on": [],
  "expected_output": "research_result|builder_result|ops_result|comms_result",
  "created_at": "ISO8601"
}
```

## Failure Modes

| Failure | Response |
|---------|----------|
| opencode not installed | Falls to manual prompt-output mode |
| Agent returns invalid JSON | Logged, retry once with error injected |
| Dependency task failed | Skip dependent, log warning |
| Timeout (>120s) | Mark failed, log, continue with remaining tasks |
| Ambiguous intent | Route to orchestrator, emit clarify_intent action |
| Memory write failure | Log only, non-fatal |

## Performance Tips

1. **Parallel tasks first** — tasks with no `depends_on` run simultaneously
2. **Cap context injection** — never exceed per-agent limits in `token_optimization.yaml`
3. **Cache search results** — web_search cached by query hash for 1hr
4. **Scratchpad not vectors** — write to scratchpad during session, promote to vectors only on explicit save
5. **Short prompts win** — all system prompts stay under 512 tokens
6. **opencode `--no-verbose`** — suppress opencode reasoning output, capture JSON only
7. **Run ops agent last** — scheduling/file ops after artifacts are confirmed complete
