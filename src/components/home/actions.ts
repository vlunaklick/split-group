'use server'

import { db } from "@/lib/db"

export async function getMembersTotal () {
  const members = await db.user.count()

  console.log(members)

  return members
}