import { agents } from "../config/agents.js";

const workflows = [
  {
    id: "lead-discovery",
    name: "Lead Discovery → Follow-up",
    description: "Search new prospects, summarise intent, and create follow-up tasks automatically.",
    steps: ["Search", "Summarise", "Create Task"],
    lastRun: "2 min ago",
    status: "Success",
  },
  {
    id: "insight-brief",
    name: "Insight Brief Generator",
    description: "Turn raw business events into clean summaries for founders and operators.",
    steps: ["Ingest", "Analyse", "Report"],
    lastRun: "15 min ago",
    status: "Success",
  },
  {
    id: "alert-escalation",
    name: "Alert + Escalation",
    description: "Route critical events to the right agent, create task, and notify owner in real time.",
    steps: ["Trigger", "Route", "Notify"],
    lastRun: "1 hr ago",
    status: "Success",
  },
];

export const getHomePage = (req, res) => {
  const agentId = req.query.agent;
  if (agentId && !agents[agentId]) {
    return res.redirect("/");
  }
  const agent = agentId ? agents[agentId] : null;
  res.render("index", {
    appName: "AgentAI",
    agent: agent ? { ...agent, id: agentId } : null,
  });
};

export const getAgentsPage = (req, res) => {
  res.render("agents", { appName: "AgentAI", agents });
};

export const getWorkflowsPage = (req, res) => {
  res.render("workflows", { appName: "AgentAI", workflows });
};

export const getWorkflowDetailPage = (req, res) => {
  const workflowId = req.params.id;
  const workflow = workflows.find((w) => w.id === workflowId);
  if (!workflow) {
    return res.redirect("/workflows");
  }
  res.render("workflow-detail", { appName: "AgentAI", workflow });
};

export const getAnalyticsPage = (req, res) => {
  res.render("analytics", { appName: "AgentAI" });
};

export const getSettingsPage = (req, res) => {
  res.render("settings", { appName: "AgentAI" });
};

  