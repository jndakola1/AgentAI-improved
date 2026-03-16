import express from "express";
import { getAnalyticsPage, getWorkflowsPage, getWorkflowDetailPage, getAgentsPage, getHomePage, getSettingsPage } from "../controllers/pages.js";
import { chat, invokeLambda } from "../controllers/chat.js";

const router = express.Router();

// Page routes
router.get("/", getHomePage);
router.get("/agents", getAgentsPage);
router.get("/workflows", getWorkflowsPage);
router.get("/workflows/:id", getWorkflowDetailPage);
router.get("/analytics", getAnalyticsPage);
router.get("/settings", getSettingsPage);

// API routes
router.post("/api/chat", chat);
router.post("/api/lambda-invoke", invokeLambda);

export default router;