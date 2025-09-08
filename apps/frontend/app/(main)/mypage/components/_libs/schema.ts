import * as v from "valibot";

export const createSchema = v.object({
  organization: v.pipe(v.string(), v.minLength(1, "단체명은 필수입니다.")),
  phoneMiddle: v.pipe(v.string(), v.length(4)),
  phoneLast: v.pipe(v.string(), v.length(4)),
});

export const editSchema = v.object({
  id: v.number(),
  ...createSchema.entries,
});
