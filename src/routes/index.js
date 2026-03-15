import express from "express";
import { getAnalyticsPage, getWorkflowsPage, getAgentsPage, getHomePage, getSettingsPage } from "../controllers/pages.js";
import { chat } from "../controllers/chat.js";

const router = express.Router();

// Page routes
router.get("/", getHomePage);
router.get("/agents", getAgentsPage);
router.get("/workflows", getWorkflowsPage);
router.get("/analytics", getAnalyticsPage);
router.get("/settings", getSettingsPage);

// API routes
router.post("/api/chat", chat);

export default router;