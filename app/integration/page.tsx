"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Flame, MessageCircle, Settings, TrendingUp, Download, Bot } from "lucide-react"

export default function IntegrationPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadDialogflowFiles = () => {
    // Intents para Dialogflow
    const intents = {
      "fogo-status": {
        name: "fogo-status",
        displayName: "Fogo Status",
        trainingPhrases: [
          { parts: [{ text: "!fogo" }] },
          { parts: [{ text: "fogo" }] },
          { parts: [{ text: "status do fogo" }] },
          { parts: [{ text: "como está o fogo" }] },
        ],
        messages: [
          {
            text: {
              text: [
                "🔥 Status do Foguinho:\n\nStreak atual: {{streak}} dias\nNível: {{level}}\nUsuários ativos hoje: {{activeUsers}}/{{totalUsers}}\n\nMantenha o grupo ativo para não perder o fogo! 💪",
              ],
            },
          },
        ],
        webhookState: "WEBHOOK_STATE_ENABLED",
      },
      "fogo-restaurar": {
        name: "fogo-restaurar",
        displayName: "Restaurar Fogo",
        trainingPhrases: [
          { parts: [{ text: "!restaurar" }] },
          { parts: [{ text: "restaurar fogo" }] },
          { parts: [{ text: "reacender fogo" }] },
          { parts: [{ text: "restaurar" }] },
        ],
        messages: [
          {
            text: {
              text: [
                "🔥 Foguinho restaurado com sucesso!\n\nO fogo foi reaceso e o streak reiniciou.\nRestaurações restantes este mês: {{restorationsLeft}}/5\n\nVamos manter o fogo aceso! 🚀",
              ],
            },
          },
        ],
        webhookState: "WEBHOOK_STATE_ENABLED",
      },
      "fogo-nivel": {
        name: "fogo-nivel",
        displayName: "Nível do Fogo",
        trainingPhrases: [
          { parts: [{ text: "!nivel" }] },
          { parts: [{ text: "nível" }] },
          { parts: [{ text: "que nível estamos" }] },
          { parts: [{ text: "progresso" }] },
        ],
        messages: [
          {
            text: {
              text: [
                "🎯 Nível do Foguinho:\n\n{{levelIcon}} {{levelName}}\nStreak: {{streak}} dias\nProgresso para próximo nível: {{progress}}%\n\nFaltam {{daysToNext}} dias para o próximo nível! 🔥",
              ],
            },
          },
        ],
        webhookState: "WEBHOOK_STATE_ENABLED",
      },
      "fogo-ranking": {
        name: "fogo-ranking",
        displayName: "Ranking dos Grupos",
        trainingPhrases: [
          { parts: [{ text: "!ranking" }] },
          { parts: [{ text: "ranking" }] },
          { parts: [{ text: "top grupos" }] },
          { parts: [{ text: "melhores grupos" }] },
        ],
        messages: [
          {
            text: {
              text: [
                "🏆 Ranking dos Grupos:\n\n1º {{group1}} - {{streak1}} dias 🥇\n2º {{group2}} - {{streak2}} dias 🥈\n3º {{group3}} - {{streak3}} dias 🥉\n\nSeu grupo está em {{position}}º lugar! 🔥",
              ],
            },
          },
        ],
        webhookState: "WEBHOOK_STATE_ENABLED",
      },
    }

    // Entities para Dialogflow
    const entities = {
      "fire-commands": {
        name: "fire-commands",
        displayName: "Comandos do Fogo",
        entities: [
          { value: "fogo", synonyms: ["fogo", "!fogo", "status"] },
          { value: "restaurar", synonyms: ["restaurar", "!restaurar", "reacender"] },
          { value: "nivel", synonyms: ["nivel", "!nivel", "nível", "progresso"] },
          { value: "ranking", synonyms: ["ranking", "!ranking", "top", "melhores"] },
        ],
      },
    }

    // Fulfillment webhook
    const fulfillment = {
      webhook: {
        url: `${window.location.origin}/api/webhook`,
        headers: {
          "Content-Type": "application/json",
        },
      },
    }

    // Criar e baixar arquivos
    const files = [
      { name: "intents.json", content: JSON.stringify(intents, null, 2) },
      { name: "entities.json", content: JSON.stringify(entities, null, 2) },
      { name: "fulfillment.json", content: JSON.stringify(fulfillment, null, 2) },
    ]

    files.forEach((file) => {
      const blob = new Blob([file.content], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Flame className="h-8 w-8 text-orange-500" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              Integração WhatsApp
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Configure seu bot do WhatsApp para usar o sistema de foguinho. Siga os passos abaixo para integrar.
          </p>
        </div>

        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-500" />
              Exportar para Dialogflow
            </CardTitle>
            <CardDescription>Baixe os arquivos de configuração para importar no Google Dialogflow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">O que será exportado:</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>
                  • <strong>Intents:</strong> !fogo, !restaurar, !nivel, !ranking
                </li>
                <li>
                  • <strong>Entities:</strong> Comandos e sinônimos
                </li>
                <li>
                  • <strong>Fulfillment:</strong> Configuração do webhook
                </li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button onClick={downloadDialogflowFiles} className="bg-blue-600 hover:bg-blue-700">
                <Download className="h-4 w-4 mr-2" />
                Baixar Arquivos Dialogflow
              </Button>
              <Button variant="outline" onClick={() => window.open("https://dialogflow.cloud.google.com/", "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Abrir Dialogflow Console
              </Button>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
              <h4 className="font-semibold mb-2 text-yellow-800">Como importar no Dialogflow:</h4>
              <ol className="text-sm space-y-1 text-yellow-700 list-decimal list-inside">
                <li>Acesse o Google Dialogflow Console</li>
                <li>Crie um novo agente ou selecione um existente</li>
                <li>Vá em Settings → Export and Import</li>
                <li>Clique em "Import From ZIP" e faça upload dos arquivos</li>
                <li>Configure o webhook URL nas configurações de Fulfillment</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Quick Setup */}
        <Card className="border-orange-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-orange-500" />
              Configuração Rápida
            </CardTitle>
            <CardDescription>URL do webhook para configurar no seu bot</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono">https://seu-dominio.com/api/webhook</code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard("https://seu-dominio.com/api/webhook")}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Badge variant="secondary">Método</Badge>
                <p className="text-sm text-gray-600 mt-1">POST</p>
              </div>
              <div>
                <Badge variant="secondary">Content-Type</Badge>
                <p className="text-sm text-gray-600 mt-1">application/json</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Commands */}
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Comandos Disponíveis
            </CardTitle>
            <CardDescription>Comandos que os usuários podem usar nos grupos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <code className="font-mono text-sm">!fogo</code>
                  <span className="text-xs text-gray-600">Status atual</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <code className="font-mono text-sm">!nivel</code>
                  <span className="text-xs text-gray-600">Nível e progresso</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <code className="font-mono text-sm">!restaurar</code>
                  <span className="text-xs text-gray-600">Reacender fogo</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <code className="font-mono text-sm">!ranking</code>
                  <span className="text-xs text-gray-600">Top grupos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Fire Levels */}
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              Níveis do Fogo
            </CardTitle>
            <CardDescription>Progressão dos níveis baseada na atividade do grupo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {[
                { level: 1, color: "🔥", name: "Laranja", days: "0-6 dias" },
                { level: 2, color: "🟡", name: "Amarelo", days: "7-13 dias" },
                { level: 3, color: "🔵", name: "Azul", days: "14-20 dias" },
                { level: 4, color: "🟢", name: "Verde", days: "21-27 dias" },
                { level: 5, color: "🟣", name: "Roxo", days: "28+ dias" },
              ].map((level) => (
                <div key={level.level} className="text-center p-4 bg-white rounded-lg border">
                  <div className="text-2xl mb-2">{level.color}</div>
                  <div className="font-semibold text-sm">{level.name}</div>
                  <div className="text-xs text-gray-500 mt-1">{level.days}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Integration Example */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-green-500" />
              Exemplo de Integração
            </CardTitle>
            <CardDescription>Código para integrar com seu bot do WhatsApp</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre className="text-sm">
                {`// Exemplo para bot em Node.js
client.on('message', async (message) => {
  if (message.from.includes('@g.us')) {
    try {
      const response = await axios.post('/api/webhook', {
        groupId: message.from,
        groupName: (await message.getChat()).name,
        userId: message.author || message.from,
        userName: (await message.getContact()).pushname,
        message: message.body,
        timestamp: new Date().toISOString()
      });
      
      if (response.data.reply) {
        await message.reply(response.data.reply);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
});`}
              </pre>
            </div>
            <Button
              className="mt-4 bg-transparent"
              variant="outline"
              size="sm"
              onClick={() =>
                copyToClipboard(`client.on('message', async (message) => {
  if (message.from.includes('@g.us')) {
    try {
      const response = await axios.post('/api/webhook', {
        groupId: message.from,
        groupName: (await message.getChat()).name,
        userId: message.author || message.from,
        userName: (await message.getContact()).pushname,
        message: message.body,
        timestamp: new Date().toISOString()
      });
      
      if (response.data.reply) {
        await message.reply(response.data.reply);
      }
    } catch (error) {
      console.error('Erro:', error);
    }
  }
});`)
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copiar Código
            </Button>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-600">Próximos Passos</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Configure o webhook no seu bot do WhatsApp</li>
              <li>Adicione os grupos no dashboard principal</li>
              <li>Teste enviando mensagens nos grupos</li>
              <li>Monitore a atividade pelo dashboard</li>
              <li>Ajuste as configurações conforme necessário</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
