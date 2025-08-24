# Sistema de Foguinho para WhatsApp 🔥

Sistema inspirado no foguinho do TikTok para grupos do WhatsApp, com níveis, restaurações e gamificação.

## Como Integrar com seu Bot do WhatsApp

### 1. Configuração do Webhook

Seu bot do WhatsApp precisa enviar as mensagens recebidas para nosso endpoint:

**URL do Webhook:** `https://seu-dominio.com/api/webhook`

**Método:** POST

**Formato da mensagem:**
\`\`\`json
{
  "groupId": "120363123456789@g.us",
  "groupName": "Amigos da Escola",
  "userId": "5511999999999@c.us",
  "userName": "João",
  "message": "Oi pessoal!",
  "timestamp": "2024-01-15T10:30:00Z"
}
\`\`\`

### 2. Comandos Disponíveis

O sistema responde aos seguintes comandos no grupo:

- **`!fogo`** - Consulta o status atual do fogo
- **`!nivel`** - Mostra o nível atual e próximo objetivo
- **`!restaurar`** - Restaura o fogo (máximo 5 por mês)
- **`!ranking`** - Mostra ranking dos grupos mais ativos

### 3. Configuração no seu Bot

Adicione esta lógica no seu autoresponder:

\`\`\`javascript
// Exemplo para bot em Node.js
const axios = require('axios');

// Quando receber uma mensagem de grupo
client.on('message', async (message) => {
  if (message.from.includes('@g.us')) { // É um grupo
    // Enviar para nosso webhook
    try {
      const response = await axios.post('https://seu-dominio.com/api/webhook', {
        groupId: message.from,
        groupName: (await message.getChat()).name,
        userId: message.author || message.from,
        userName: (await message.getContact()).pushname || 'Usuário',
        message: message.body,
        timestamp: new Date().toISOString()
      });
      
      // Se o sistema retornar uma resposta, enviar para o grupo
      if (response.data.reply) {
        await message.reply(response.data.reply);
      }
    } catch (error) {
      console.error('Erro ao processar foguinho:', error);
    }
  }
});
\`\`\`

### 4. Mecânica do Foguinho

#### Como Funciona:
- **Atividade Diária:** Pelo menos 2 pessoas diferentes devem mandar mensagem por dia
- **Níveis do Fogo:** 🔥 Laranja → 🟡 Amarelo → 🔵 Azul → 🟢 Verde → 🟣 Roxo
- **Progressão:** A cada 7 dias consecutivos, o fogo evolui de nível
- **Restaurações:** 5 por mês por grupo (reseta todo dia 1º)

#### Respostas Automáticas:
- Quando o fogo está em risco: "⚠️ O fogo está em risco! Alguém mais precisa falar hoje!"
- Quando o fogo apaga: "💔 O fogo apagou! Use !restaurar para reacender (restam X restaurações)"
- Quando sobe de nível: "🎉 Parabéns! O fogo evoluiu para nível [COR]!"

### 5. Interface Web

Acesse o dashboard em: `https://seu-dominio.com`

**Funcionalidades:**
- Monitorar todos os grupos em tempo real
- Ver estatísticas de atividade
- Restaurar fogo manualmente
- Configurar novos grupos
- Histórico de níveis e conquistas

### 6. Configuração de Grupos

Para adicionar um novo grupo ao sistema:

1. Acesse o dashboard web
2. Clique em "Adicionar Grupo"
3. Insira o ID do grupo (ex: `120363123456789@g.us`)
4. Defina o nome do grupo
5. O sistema começará a monitorar automaticamente

### 7. Comandos de Admin (Opcional)

Você pode adicionar comandos especiais para administradores:

- **`!fogo-admin reset`** - Reseta o fogo do grupo
- **`!fogo-admin nivel [cor]`** - Define nível específico
- **`!fogo-admin restauracoes [numero]`** - Define restaurações restantes

## Exemplo de Integração Completa

\`\`\`javascript
// webhook-handler.js
app.post('/webhook-whatsapp', async (req, res) => {
  const { groupId, message, userId, userName } = req.body;
  
  // Enviar para sistema de foguinho
  const foguinhoResponse = await fetch('http://localhost:3000/api/webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      groupId,
      groupName: 'Grupo Teste',
      userId,
      userName,
      message,
      timestamp: new Date().toISOString()
    })
  });
  
  const result = await foguinhoResponse.json();
  
  // Se há resposta, enviar para o WhatsApp
  if (result.reply) {
    await sendWhatsAppMessage(groupId, result.reply);
  }
  
  res.json({ success: true });
});
\`\`\`

## Próximos Passos

1. **Deploy:** Faça deploy do sistema em um servidor (Vercel, Railway, etc.)
2. **Configure:** Adicione seus grupos no dashboard
3. **Integre:** Conecte seu bot com o webhook
4. **Teste:** Envie mensagens e veja o sistema funcionando
5. **Monitore:** Use o dashboard para acompanhar a atividade

## Suporte

- Dashboard: Interface web para monitoramento
- Logs: Todas as atividades são registradas
- API: Endpoints para integração personalizada
