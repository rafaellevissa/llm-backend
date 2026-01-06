# Inbenta LLM Ticket Triage API

## Installation

### Prerequisites
- Node.js 20.x (or compatible LTS)
- npm

### Steps
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd inbenta-llm
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Copy and edit the `.env` file:
   ```sh
   cp .env.example .env
   # Edit .env with your API keys and settings
   ```

## Running Locally

Start the development server:
```sh
npm run start:dev
```

## Using Docker

### Build and run with Docker
```sh
docker build -t inbenta-llm .
docker run --env-file .env -p 3000:3000 inbenta-llm
```

### Using Docker Compose
```sh
docker compose up --build
```

## Configuration

All configuration is managed via the `.env` file and `src/config/llm.config.ts`.

### Required Environment Variables
- `LLM_PROVIDER` — LLM provider (e.g., `openai`, `gemini`, `grok`)
- `OPENAI_API_KEY` — Your OpenAI API key
- `OPENAI_TOKEN_COST_PER_1M_INPUT` — Cost per 1M input tokens (e.g., `1.750`)
- `OPENAI_TOKEN_COST_PER_1M_OUTPUT` — Cost per 1M output tokens (e.g., `14.000`)
- `AGENT_NAME` — Name for your agent
- `AGENT_INSTRUCTIONS_PATH` — Path to your agent instructions file (e.g., `src/config/agent-instructions.txt`)

### Example `.env`
```dotenv
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_INPUT_TOKEN_COST_PER_1M=1.750
OPENAI_OUTPUT_TOKEN_COST_PER_1M=14.000
AGENT_NAME=Ticket Triage Agent
AGENT_INSTRUCTIONS_PATH=src/config/agent-instructions.txt
```

### Customizing Prompts
Edit `src/config/agent-instructions.txt` to change the agent's behavior and instructions.

## Token Cost Calculation

Token pricing is based on [OpenAI API pricing](https://openai.com/api/pricing/).

**Current prices for GPT-5.2 (as of Jan 2026):**
- Input: $1.750 / 1M tokens
- Output: $14.000 / 1M tokens

**Formula:**

```
costUSD = (input_tokens / 1_000_000) * INPUT_COST + (output_tokens / 1_000_000) * OUTPUT_COST
```

Where:
- `input_tokens` and `output_tokens` are returned by the LLM usage object
- `INPUT_COST` and `OUTPUT_COST` are set in your `.env` file



## API Documentation (Swagger)

This project uses [Swagger](https://swagger.io/) for interactive API documentation.

Once the server is running, access the Swagger UI at:

```
http://localhost:3000/docs
```

You can explore all endpoints, view request/response schemas, and try out the API directly from your browser.

---

## API Usage

### Example Request
```
POST /triage-ticket
Content-Type: application/json

{
   "subject": "pc wont turn on",
   "body": "turn pc off yesterday and today it wont turn on"
}
```

### Example Response
```
{
   "category": "technical",
   "priority": "high",
   "flags": {
      "requires_human": true,
      "is_abusive": false,
      "missing_info": false,
      "is_vip_customer": false
   },
   "usage": {
      "inputTokens": 295,
      "outputTokens": 47,
      "costUSD": 0.0005985
   }
}
```

## Troubleshooting
- Ensure your API key and provider settings are correct in `.env`.
- For Docker, make sure `.env` is present and correctly configured.
- Check logs for error details.

---

## Assumptions

### Categories, Priority Levels, and Flags
- **Categories**: The ticket categories are assumed to be 'billing', 'technical', 'account', and 'sales', based on common support use cases. You can adjust these in the agent instructions and schema as needed.
- **Priority Levels**: The priorities are 'low', 'normal', 'medium', 'high', and 'urgent', chosen to cover typical support urgency levels.
- **Flags**: The flags returned are:
   - `requires_human`: Whether the ticket needs human intervention.
   - `is_abusive`: Whether the ticket contains abusive language/content.
   - `missing_info`: Whether the ticket lacks necessary information.
   - `is_vip_customer`: Whether the customer is a VIP (for special handling).
These flags are designed to help automate triage and escalation decisions.

### Token Counting / Cost Calculation
- Token usage is reported by the LLM provider (OpenAI) and returned in the API response.
- Cost calculation uses the official OpenAI pricing for GPT-5.2 as of January 2026:
   - Input: $1.750 / 1M tokens
   - Output: $14.000 / 1M tokens
- The formula is:
   ```
   costUSD = (input_tokens / 1_000_000) * INPUT_COST + (output_tokens / 1_000_000) * OUTPUT_COST
   ```
- You can adjust the costs in your `.env` file to match your provider/model.

### Provider and Model Choice
- The default provider is **OpenAI** using the GPT-5.2 model, chosen for its reliability and strong support for structured outputs and tool use.
- You can switch providers (e.g., Gemini, Grok) by changing the `LLM_PROVIDER` variable and updating the configuration and agent setup as needed.
- Model and provider selection should be based on your organization's requirements for accuracy, cost, and available features.


## Improvements (Future Work)

- **Observability & Grafana**: Integrate metrics collection (e.g., Prometheus) and Grafana dashboards to visualize LLM usage and cost over time.
- **Config Management UI**: Create a web page (admin route) to view and update config values (e.g., token costs, agent instructions) at runtime.
