import type { Request, Response } from "express";
import { SpeakflowService } from "./speakflow.service";

function ok(res: Response, data: unknown, status = 200) {
  return res.status(status).json({ success: true, data });
}
function fail(res: Response, message: string, status = 400) {
  return res.status(status).json({ success: false, message });
}

export class SpeakflowController {
  static async getProgress(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const progress = await SpeakflowService.getProgress(userId);
      return ok(res, progress);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to get progress", 500);
    }
  }

  static async startSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const { scenarioId, scenarioTitle } = req.body;
      if (!scenarioId || !scenarioTitle) return fail(res, "scenarioId and scenarioTitle required", 400);
      const session = await SpeakflowService.startSession(userId, scenarioId, scenarioTitle);
      return ok(res, session, 201);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to start session", 500);
    }
  }

  static async getSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const { sessionId } = req.params;
      const session = await SpeakflowService.getSession(sessionId, userId);
      if (!session) return fail(res, "Session not found", 404);
      return ok(res, session);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to get session", 500);
    }
  }

  static async addTurn(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const { sessionId } = req.params;
      const { role, content } = req.body;
      if (!role || !content) return fail(res, "role and content required", 400);
      const session = await SpeakflowService.addTurn(sessionId, userId, role, content);
      return ok(res, session);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to add turn", 500);
    }
  }

  static async completeSession(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const { sessionId } = req.params;
      const session = await SpeakflowService.completeSession(sessionId, userId, req.body);
      if (!session) return fail(res, "Session not found", 404);
      return ok(res, session);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to complete session", 500);
    }
  }

  static async getHistory(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const limit = Number(req.query.limit) || 10;
      const history = await SpeakflowService.getSessionHistory(userId, limit);
      return ok(res, history);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to get history", 500);
    }
  }

  static async earnBadge(req: Request, res: Response) {
    try {
      const userId = (req as any).user?.id;
      if (!userId) return fail(res, "Unauthorized", 401);
      const { badgeId } = req.body;
      if (!badgeId) return fail(res, "badgeId required", 400);
      const progress = await SpeakflowService.earnBadge(userId, badgeId);
      return ok(res, progress);
    } catch (err: any) {
      return fail(res, err.message ?? "Failed to earn badge", 500);
    }
  }
}
