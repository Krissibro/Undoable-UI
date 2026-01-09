import { describe, expect, it } from "vitest";
import { activateHistoryReplayProtection, isHistoryReplaying } from "../src/historyReplayProtection.js";

describe("historyReplayProtection", () => {
    it("is true only during callback", () => {
        expect(isHistoryReplaying()).toBe(false);

        activateHistoryReplayProtection(() => {
            expect(isHistoryReplaying()).toBe(true);
        });

        expect(isHistoryReplaying()).toBe(false);
    });

    it("supports nesting", () => {
        activateHistoryReplayProtection(() => {
            expect(isHistoryReplaying()).toBe(true);
            activateHistoryReplayProtection(() => {
                expect(isHistoryReplaying()).toBe(true);
            });
            expect(isHistoryReplaying()).toBe(true);
        });
        expect(isHistoryReplaying()).toBe(false);
    });
});
