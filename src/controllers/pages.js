import { agents } from "../config/agents.js";

export const getHomePage = (req, res) => {
    const agentId = req.query.agent;
    // If agentId is invalid, redirect to the clean home page.
    if (agentId && !agents[agentId]) {
      return res.redirect("/");
    }
    const agent = agentId ? agents[agentId] : null;
    res.render("index", {
      appName: "AgentAI",
      agent: agent ? { ...agent, id: agentId } : null,
    });
  };
  
export  const getAgentsPage = (req, res) => {
    res.render("agents", { appName: "AgentAI", agents });
  };
  
export  const getWorkflowsPage = (req, res) => {
    res.render("workflows", { appName: "AgentAI" });
  };
  
export  const getAnalyticsPage = (req, res) => {
    res.render("analytics", { appName: "AgentAI" });
  };
  
export  const getSettingsPage = (req, res) => {
    res.render("settings", { appName: "AgentAI" });
  };
  