import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const groupId = params.id

    // Simular dados do grupo
    const groupStatus = {
      id: groupId,
      name: "Amigos da Escola",
      streak: 47,
      level: "🟣 Roxo Lendário",
      activeUsersToday: 8,
      requiredUsers: 2,
      totalUsers: 10,
      status: "active",
      lastActivity: new Date().toISOString(),
      restorationsUsed: 1,
      maxRestorations: 5,
      createdAt: "2024-01-01T00:00:00.000Z",
      history: [
        { date: "2024-01-20", streak: 47, activeUsers: 8 },
        { date: "2024-01-19", streak: 46, activeUsers: 6 },
        { date: "2024-01-18", streak: 45, activeUsers: 4 },
      ],
      topUsers: [
        { name: "João", messages: 145, streak: 47 },
        { name: "Maria", messages: 132, streak: 47 },
        { name: "Pedro", messages: 98, streak: 45 },
      ],
    }

    return NextResponse.json(groupStatus)
  } catch (error) {
    console.error("[v0] Group status API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
