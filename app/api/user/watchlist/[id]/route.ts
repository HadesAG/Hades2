import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params

    await prisma.watchlistToken.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Token removed from watchlist",
    })
  } catch (error) {
    console.error("Remove watchlist token error:", error)
    return NextResponse.json({ error: "Failed to remove token" }, { status: 500 })
  }
}
