import * as v from "valibot";

export const createSchema = v.object({
  headcount: v.pipe(v.number(), v.minValue(1, "최소 1명 이상이어야 합니다.")),
  storeId: v.number(),
  phoneMiddle: v.pipe(v.string(), v.length(4)),
  phoneLast: v.pipe(v.string(), v.length(4)),
});

export const editSchema = v.object({
  id: v.number(),
  ...createSchema.entries,
});
