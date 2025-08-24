import { type NextRequest, NextResponse } from "next/server"

interface WhatsAppMessage {
  from: string
  to: string
  body: string
  timestamp: number
  isGroup: boolean
  groupId?: string
  participantId?: string
}

interface GroupActivity {
  groupId: string
  userId: string
  messageCount: number
  lastActivity: Date
}

export async function GET(request: NextRequest) {
  console.log("[v0] Webhook GET called - returning usage info")

  return NextResponse.json(
    {
      status: "webhook_active",
      method: "POST",
      endpoint: "/api/webhook",
      usage: "Send POST requests with WhatsApp message data",
      example: {
        from: "5511999999999",
        to: "5511888888888",
        body: "!fogo",
        timestamp: Date.now(),
        isGroup: true,
        groupId: "group123",
        participantId: "5511999999999",
      },
      availableCommands: ["!fogo", "!restaurar", "!nivel", "!ranking"],
    },
    {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    },
  )
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Webhook POST called")
    console.log("[v0] Request URL:", request.url)
    console.log("[v0] Request method:", request.method)

    const message: WhatsAppMessage = await request.json()
    console.log("[v0] Received message:", {
      from: message.from,
      isGroup: message.isGroup,
      body: message.body?.substring(0, 50),
    })

    // Verificar se é mensagem de grupo
    if (!message.isGroup || !message.groupId) {
      return NextResponse.json({ status: "ignored", reason: "not a group message" })
    }

    const groupId = message.groupId
    const userId = message.participantId || message.from
    const messageBody = message.body?.toLowerCase().trim() || ""

    // Processar comandos especiais
    if (messageBody.startsWith("!")) {
      return await handleCommand(messageBody, groupId, userId)
    }

    // Registrar atividade do usuário
    await registerUserActivity(groupId, userId)

    // Verificar e atualizar streak do grupo
    const streakStatus = await updateGroupStreak(groupId)

    return NextResponse.json({
      status: "processed",
      groupId,
      userId,
      streakStatus,
    })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json(
      {
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    )
  }
}

async function handleCommand(command: string, groupId: string, userId: string) {
  const cmd = command.substring(1) // Remove o !

  switch (cmd) {
    case "fogo":
    case "streak":
      return await getFireStatus(groupId)

    case "restaurar":
    case "restore":
      return await restoreFire(groupId, userId)

    case "nivel":
    case "level":
      return await getFireLevel(groupId)

    case "ranking":
      return await getGroupRanking(groupId)

    default:
      return NextResponse.json({
        status: "unknown_command",
        availableCommands: ["!fogo", "!restaurar", "!nivel", "!ranking"],
      })
  }
}

async function registerUserActivity(groupId: string, userId: string) {
  // Simular conexão com banco de dados
  console.log("[v0] Registering activity:", { groupId, userId, timestamp: new Date() })

  // Aqui você conectaria com seu banco de dados para:
  // 1. Inserir/atualizar atividade diária do usuário
  // 2. Verificar se é a primeira mensagem do dia
  // 3. Contar usuários únicos ativos hoje

  return {
    registered: true,
    isFirstMessageToday: true,
    activeUsersToday: 2,
  }
}

async function updateGroupStreak(groupId: string) {
  console.log("[v0] Updating group streak:", groupId)

  // Simular lógica do streak:
  // 1. Verificar quantos usuários únicos mandaram mensagem hoje
  // 2. Se >= 2 usuários, manter/incrementar streak
  // 3. Se < 2 usuários e passou da meia-noite, quebrar streak

  const activeUsersToday = 2 // Simulado
  const currentStreak = 15 // Simulado
  const fireLevel = getFireLevelByStreak(currentStreak)

  return {
    groupId,
    currentStreak,
    fireLevel,
    activeUsersToday,
    requiredUsers: 2,
    status: activeUsersToday >= 2 ? "active" : "at_risk",
  }
}

async function getFireStatus(groupId: string) {
  const status = await updateGroupStreak(groupId)

  const response = {
    message:
      `🔥 *Status do Foguinho*\n\n` +
      `Streak atual: *${status.currentStreak} dias*\n` +
      `Nível: *${status.fireLevel}*\n` +
      `Usuários ativos hoje: *${status.activeUsersToday}/${status.requiredUsers}*\n` +
      `Status: ${status.status === "active" ? "✅ Ativo" : "⚠️ Em risco"}\n\n` +
      `${
        status.status === "at_risk"
          ? `⚠️ *Atenção!* Precisa de mais ${status.requiredUsers - status.activeUsersToday} pessoa(s) ativa(s) hoje!`
          : "🎉 Foguinho mantido hoje! Continue assim!"
      }`,
  }

  return NextResponse.json(response)
}

async function restoreFire(groupId: string, userId: string) {
  console.log("[v0] Attempting to restore fire:", { groupId, userId })

  // Verificar quantas restaurações o grupo já usou este mês
  const restorationsThisMonth = 2 // Simulado
  const maxRestorations = 5

  if (restorationsThisMonth >= maxRestorations) {
    return NextResponse.json({
      message:
        `❌ *Limite de restaurações atingido!*\n\n` +
        `Vocês já usaram ${restorationsThisMonth}/${maxRestorations} restaurações este mês.\n` +
        `Aguardem o próximo mês para mais restaurações! 🗓️`,
    })
  }

  // Simular restauração
  const newStreak = 1
  const fireLevel = getFireLevelByStreak(newStreak)

  return NextResponse.json({
    message:
      `🔥 *Foguinho Restaurado!*\n\n` +
      `O fogo foi reaceso! 🎉\n` +
      `Novo streak: *${newStreak} dia*\n` +
      `Nível: *${fireLevel}*\n\n` +
      `Restaurações restantes: *${maxRestorations - restorationsThisMonth - 1}/${maxRestorations}*\n` +
      `⚠️ Lembrem-se: precisam de pelo menos 2 pessoas ativas por dia!`,
  })
}

function getFireLevelByStreak(streak: number): string {
  if (streak >= 50) return "🟣 Roxo Lendário"
  if (streak >= 30) return "🟢 Verde Épico"
  if (streak >= 15) return "🔵 Azul Raro"
  if (streak >= 7) return "🟡 Amarelo Comum"
  return "🟠 Laranja Iniciante"
}

async function getFireLevel(groupId: string) {
  const currentStreak = 15 // Simulado
  const fireLevel = getFireLevelByStreak(currentStreak)

  let nextLevel = ""
  let daysToNext = 0

  if (currentStreak < 7) {
    nextLevel = "🟡 Amarelo Comum"
    daysToNext = 7 - currentStreak
  } else if (currentStreak < 15) {
    nextLevel = "🔵 Azul Raro"
    daysToNext = 15 - currentStreak
  } else if (currentStreak < 30) {
    nextLevel = "🟢 Verde Épico"
    daysToNext = 30 - currentStreak
  } else if (currentStreak < 50) {
    nextLevel = "🟣 Roxo Lendário"
    daysToNext = 50 - currentStreak
  }

  return NextResponse.json({
    message:
      `🔥 *Nível do Foguinho*\n\n` +
      `Nível atual: *${fireLevel}*\n` +
      `Streak: *${currentStreak} dias*\n\n` +
      `${
        nextLevel ? `Próximo nível: *${nextLevel}*\n` + `Faltam: *${daysToNext} dias*` : "🏆 *Nível máximo atingido!*"
      }`,
  })
}

async function getGroupRanking(groupId: string) {
  // Simular dados de ranking
  const ranking = [
    { name: "João", messages: 45, streak: 15 },
    { name: "Maria", messages: 38, streak: 15 },
    { name: "Pedro", messages: 22, streak: 12 },
    { name: "Ana", messages: 18, streak: 8 },
  ]

  let message = `🏆 *Ranking do Grupo*\n\n`
  ranking.forEach((user, index) => {
    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}º`
    message += `${medal} *${user.name}*\n`
    message += `   📱 ${user.messages} mensagens\n`
    message += `   🔥 ${user.streak} dias de streak\n\n`
  })

  return NextResponse.json({ message })
}
