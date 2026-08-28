import { z } from "zod"; export const phoneSchema = z.string().regex(/^01[0-9]-?\d{3,4}-?\d{4}$/, "유효한 휴대전화번호를 입력해 주세요.");
