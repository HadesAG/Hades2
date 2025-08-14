import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function GET() {
  try {
    // In a real app, you'd get the user ID from the session/auth
    // For now, we'll use a mock user ID
    const userId = "mock-user-id"

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        user,
      },
    })
  } catch (error) {
    console.error("Settings API Error:", error)

    // Return mock data as fallback
    const mockUser = {
      id: "mock-user-id",
      email: "user@example.com",
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      username: "trader123",
      createdAt: new Date().toISOString(),
      settings: {
        theme: "light",
        notifications: true,
        emailAlerts: false,
        privyId: "privy-mock-id",
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        user: mockUser,
      },
    })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const updates = await request.json()

    // In a real app, you'd update the actual user in the database
    // For now, we'll just return the mock user with the updates
    const mockUser = {
      id: "mock-user-id",
      email: "user@example.com",
      wallet: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      username: updates.username || "trader123",
      createdAt: new Date().toISOString(),
      settings: {
        theme: updates.settings?.theme || "light",
        notifications: updates.settings?.notifications !== undefined ? updates.settings.notifications : true,
        emailAlerts: updates.settings?.emailAlerts !== undefined ? updates.settings.emailAlerts : false,
        privyId: "privy-mock-id",
      },
    }

    return NextResponse.json({
      success: true,
      data: {
        user: mockUser,
      },
    })
  } catch (error) {
    console.error("Update settings error:", error)
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
