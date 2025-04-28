import { NextRequest } from "next/server";
import { ilike, or } from "drizzle-orm";

import { Advocate } from "@/lib/types";
import db from "@/db";
import { advocates } from "@/db/schema";
import { parseNumericQueryParameterOrDefault } from "@/lib/request";

const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 500;

export async function GET(req: NextRequest) {
  const parsedUrl = new URL(req.url);

  const searchText = parsedUrl.searchParams.get('search') ?? '';

  // There are definitely pros and cons to a limit / offset based pagination approach especially if
  // the data is constantly changing - if that was the case, I might pick a different approach.
  const page = parseNumericQueryParameterOrDefault(parsedUrl.searchParams.get('page'), 1);
  const pageSize = parseNumericQueryParameterOrDefault(parsedUrl.searchParams.get('pageSize'), DEFAULT_PAGE_SIZE);
  if (pageSize > MAX_PAGE_SIZE) {
    return Response.json({ error: `Page size greater than 500 not permitted, received ${pageSize}` }, { status: 400 });
  }

  const data: Array<Advocate> = await db.select()
    .from(advocates)
    .where(
      or(
        // NOTE: there's probably a more robust way to do this using some sort of postgres full
        // text search api, but this is definitely an improvement over the previous state of affairs
        ilike(advocates.firstName, `%${searchText}%`),
        ilike(advocates.lastName, `%${searchText}%`),
        // TODO: apply search to more columns with more complex datatypes like `specialties`
      )
    )
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  return Response.json({ data });
}
