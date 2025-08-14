import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    const userId = "mock-user-id"

    const alerts = await prisma.alert.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({
      success: true,
      data: {
        alerts,
      },
    })
  } catch (error) {
    console.error("Alerts API Error:", error)

    // Return mock data as fallback
    const mockAlerts = [
      {
        id: "alert-1",
        symbol: "SOL",
        type: "PRICE",
        operator: "ABOVE",
        targetValue: 200,
        status: "ACTIVE",
        triggeredAt: null,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
      {
        id: "alert-2",
        symbol: "BONK",
        type: "PERCENT_CHANGE",
        operator: "ABOVE",
        targetValue: 10,
        status: "TRIGGERED",
        triggeredAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
      },
    ]

    return NextResponse.json({
      success: true,
      data: {
        alerts: mockAlerts,
      },
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { symbol, type, operator, targetValue } = await request.json()
    const userId = "mock-user-id"

    if (!symbol || !type || !operator || targetValue === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const newAlert = await prisma.alert.create({
      data: {
        symbol: symbol.toUpperCase(),
        type,
        operator,
        targetValue,
        userId,
      },
    })

    return NextResponse.json({
      success: true,
      data: {
        alert: newAlert,
      },
    })
  } catch (error) {
    console.error("Create alert error:", error)
    return NextResponse.json({ error: "Failed to create alert" }, { status: 500 })
  }
}
