import { Router } from "express";
import { db } from "../db/db.js";
import { desc, eq } from "drizzle-orm";
import { commentary } from "../db/schema.js";
import { matchIdParamSchema } from "../validation/matches.js";
import {
    createCommentarySchema,
    listCommentaryQuerySchema,
} from "../validation/commentary.js";

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

commentaryRouter.get("/", async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({
            error: "Invalid match ID",
            details: paramsResult.error.issues,
        });
    }

    const queryResult = listCommentaryQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
        return res.status(400).json({
            error: "Invalid query parameters",
            details: queryResult.error.issues,
        });
    }

    try {
        const { id: matchId } = paramsResult.data;
        const { limit = 10 } = queryResult.data;
        const safeLimit = Math.min(limit, MAX_LIMIT);

        const results = await db
            .select()
            .from(commentary)
            .where(eq(commentary.matchId, matchId))
            .orderBy(desc(commentary.createdAt))
            .limit(safeLimit);

        res.status(200).json({ data: results });
    } catch (error) {
        console.error("Error retrieving commentary:", error);
        res.status(500).json({ error: "Failed to retrieve commentary" });
    }
});

commentaryRouter.post("/", async (req, res) => {
    const paramsResult = matchIdParamSchema.safeParse(req.params);

    if (!paramsResult.success) {
        return res.status(400).json({
            error: "Invalid match ID",
            details: paramsResult.error.issues,
        });
    }

    const bodyResult = createCommentarySchema.safeParse(req.body);

    if (!bodyResult.success) {
        return res.status(400).json({
            error: "Invalid commentary data",
            details: bodyResult.error.issues,
        });
    }

    try {
        const { id: matchId } = paramsResult.data;
        const { minute, ...rest } = bodyResult.data;

        const [result] = await db
            .insert(commentary)
            .values({
                matchId,
                ...rest,
                minute,
            })
            .returning();

        if (res.app.locals.broadcastCommentary) {
            res.app.locals.broadcastCommentary(result.matchId, result);
        }

        res.status(201).json({ data: result });
    } catch (error) {
        console.error("Error creating commentary:", error);
        res.status(500).json({ error: "Failed to create commentary" });
    }
});
