"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, ExternalLink, Flame, MessageCircle, Settings, TrendingUp } from "lucide-react"

export default function IntegrationPage() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
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
