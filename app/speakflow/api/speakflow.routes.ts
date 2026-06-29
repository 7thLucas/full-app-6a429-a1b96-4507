import { Router } from "express";
import { requireAuth } from "~/modules/authentication/authentication.middleware";
import { SpeakflowController } from "./speakflow.controller";

const router = Router();

// Progress
router.get("/speakflow/progress", requireAuth, SpeakflowController.getProgress);
router.post("/speakflow/badges/earn", requireAuth, SpeakflowController.earnBadge);

// Sessions
router.post("/speakflow/sessions", requireAuth, SpeakflowController.startSession);
router.get("/speakflow/sessions/history", requireAuth, SpeakflowController.getHistory);
router.get("/speakflow/sessions/:sessionId", requireAuth, SpeakflowController.getSession);
router.post("/speakflow/sessions/:sessionId/turns", requireAuth, SpeakflowController.addTurn);
router.post("/speakflow/sessions/:sessionId/complete", requireAuth, SpeakflowController.completeSession);

export default router;
