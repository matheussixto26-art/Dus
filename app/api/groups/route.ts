import { NextResponse } from "next/server"

export async function GET() {
  console.log("[v0] Groups API - Starting request")

  try {
    const groups = [
      {
        id: "group_1",
        name: "Amigos da Escola",
        streak: 47,
        level: "fogo roxo",
        activeUsers: 8,
        totalUsers: 10,
        status: "active" as const,
        lastActivity: new Date().toISOString(),
        restorationsUsed: 1,
        maxRestorations: 5,
      },
      {
        id: "group_2",
        name: "Família Silva",
        streak: 12,
        level: "fogo azul",
        activeUsers: 1,
        totalUsers: 8,
        status: "at_risk" as const,
        lastActivity: new Date().toISOString(),
        restorationsUsed: 2,
        maxRestorations: 5,
      },
    ]

    const stats = {
      totalGroups: groups.length,
      activeGroups: groups.filter((g) => g.status === "active").length,
      atRiskGroups: groups.filter((g) => g.status === "at_risk").length,
      maxStreak: Math.max(...groups.map((g) => g.streak)),
      totalRestorations: groups.reduce((sum, g) => sum + g.restorationsUsed, 0),
    }

    console.log("[v0] Groups API - Returning data")

    return NextResponse.json({
      groups,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Groups API - Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
