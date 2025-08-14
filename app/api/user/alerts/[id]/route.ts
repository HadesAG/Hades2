import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/database"

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params
    const { status } = await request.json()

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      success: true,
      data: {
        alert: updatedAlert,
      },
    })
  } catch (error) {
    console.error("Update alert error:", error)
    return NextResponse.json({ error: "Failed to update alert" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params

    await prisma.alert.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Alert deleted",
    })
  } catch (error) {
    console.error("Delete alert error:", error)
    return NextResponse.json({ error: "Failed to delete alert" }, { status: 500 })
  }
}
