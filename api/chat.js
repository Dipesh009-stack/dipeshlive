const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const DEFAULT_MODEL = "gpt-6-astra";

const portfolioContext = `
Dipesh Wosti is based in Sunnyvale, CA. Contact: wostid48@gmail.com, +1 (760) 716-2149, LinkedIn: linkedin.com/in/dipeshwosti, website: dipeshwosti.com.

Education:
- Master's in Artificial Intelligence, San Jose State University, ongoing.
- Bachelor of Science in Computer Science and Information Technology, Tribhuvan University, 2020.
- Year Up United, Career Track Information Technology, San Jose, 2025.

Current role:
- Test Specialist, Contract, Hyve Solutions, Fremont, CA, Aug 2025 to Present.
- Performs Server-Level Testing (SLT) and Rack-Level Testing (RLT) to validate high-density server systems for production readiness and quality standards.
- Diagnoses hardware failures by analyzing BMC/IPMI logs, system event logs, and diagnostic outputs to isolate root causes.
- Conducts rack-level diagnostics across compute nodes, networking components, NICs, storage devices, power distribution, cabling, and supporting infrastructure.
- Partners with hardware, firmware, manufacturing, and quality engineers to investigate failures, validate fixes, and improve product reliability.
- Executes hardware validation, system bring-up, and functional testing using Linux CLI, manufacturing test tools, and SOPs.
- Maintains test reports, inspection records, and quality documentation aligned with manufacturing, ISO, and organizational standards.

Previous role:
- DevOps Engineer, Apprenticeship, Apple Inc., Sunnyvale, CA, Feb 2025 to Aug 2025.
- Built and managed scalable data processing pipelines on AWS using Python and cloud-native services for data ingestion and transformation.
- Designed and automated ETL workflows with Jenkins CI/CD pipelines to improve deployment efficiency and consistency.
- Developed and optimized SQL queries for extracting, transforming, and analyzing structured data across relational databases.
- Deployed and managed distributed systems on Kubernetes and EKS for scalable data workloads and high-availability services.
- Implemented Infrastructure as Code with Terraform to provision reproducible data infrastructure environments.
- Built monitoring and observability systems with Grafana, Splunk, and Dynatrace to track data pipeline performance and detect anomalies.
- Collaborated with cross-functional teams to support data-driven decisions and reliability improvements.

Projects:
- AI-Powered Data Query System: natural-language database interaction using LLMs and MCP tools so users can query data and trigger backend workflows through an AI-assisted interface. Technologies include Python, OpenAI, MCP, LLMs, and PostgreSQL.
- Kubernetes-Based Data Pipeline Deployment: containerized applications for data workflows on AWS EKS, focused on scalable infrastructure, cloud networking, Docker, Kubernetes, AWS, and deployment reliability.
- AI Email Assistant: n8n workflow that reads incoming emails, generates AI-powered responses with an LLM, and drafts replies automatically.
- Face Recognition Attendance System: Python and OpenCV machine learning system using PostgreSQL.

Skills:
- Languages: Python, Shell Scripting, SQL, HTML/CSS.
- Systems: Linux CLI, Ubuntu, Windows, macOS.
- AI / ML: OpenAI, LLMs, MCP, OpenCV, n8n.
- Cloud / Infra: AWS, Google Cloud, Kubernetes, EKS, Docker, Terraform, Jenkins, Git, Jira.
- Networking: TCP/IP, DHCP, DNS, VLAN, Routing, Switching, Ethernet, SSH.
- Hardware: Server Hardware, PCB, Electronic Components, PDU, Switches, SSD/HDD, Firmware Validation, BIOS Configuration.

Certifications:
- AWS Cloud Practitioner.
- Data Analyst with Python from freeCodeCamp.
- Data Analyst with Python from DataCamp.
- Google IT Support from Coursera.
- Claude 101 from Anthropic.
- AI Fluency from Anthropic.
`;

function sendJson(response, statusCode, payload) {
  response.statusCode = statusCode;
  response.setHeader("Content-Type", "application/json");
  response.end(JSON.stringify(payload));
}

function extractOutputText(payload) {
  if (typeof payload.output_text === "string" && payload.output_text.trim()) {
    return payload.output_text.trim();
  }

  const textParts = [];

  for (const item of payload.output || []) {
    for (const content of item.content || []) {
      if (typeof content.text === "string") {
        textParts.push(content.text);
      }
    }
  }

  return textParts.join("\n").trim();
}

module.exports = async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return sendJson(response, 405, { error: "Use POST to ask the assistant a question." });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return sendJson(response, 500, {
      error: "The assistant is not configured yet. Add OPENAI_API_KEY to the deployment environment.",
    });
  }

  const message = typeof request.body?.message === "string" ? request.body.message.trim() : "";

  if (!message) {
    return sendJson(response, 400, { error: "Please enter a question first." });
  }

  if (message.length > 500) {
    return sendJson(response, 400, { error: "Please keep the question under 500 characters." });
  }

  try {
    const openAIResponse = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || DEFAULT_MODEL,
        instructions:
          "You are Dipesh Wosti's portfolio assistant. Answer only using the provided portfolio context. Be concise, recruiter-friendly, and specific. If the answer is not in the context, say you do not have that detail and suggest contacting Dipesh directly. Do not invent employers, dates, metrics, degrees, certifications, or project details.",
        input: [
          {
            role: "user",
            content: `Portfolio context:\n${portfolioContext}\n\nQuestion: ${message}`,
          },
        ],
        max_output_tokens: 450,
      }),
    });

    const payload = await openAIResponse.json();

    if (!openAIResponse.ok) {
      return sendJson(response, openAIResponse.status, {
        error: payload.error?.message || "The assistant could not answer right now.",
      });
    }

    const answer = extractOutputText(payload);

    return sendJson(response, 200, {
      answer: answer || "I don't have that detail in Dipesh's portfolio context yet.",
    });
  } catch (_error) {
    return sendJson(response, 500, {
      error: "The assistant is unavailable right now. Please try again later.",
    });
  }
};
