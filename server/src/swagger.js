export const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "SafeSite API",
    version: "1.0.0",
    description: "API para gestão de segurança e análise de riscos em canteiros de obras usando IA.",
  },
  servers: [
    {
      url: "http://localhost:8787",
      description: "Servidor Local",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Insira o token JWT gerado na rota de login.",
      },
    },
  },
  paths: {
    "/api/login": {
      post: {
        summary: "Autenticar usuário",
        description: "Gera um token JWT para acesso a rotas protegidas.",
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  username: { type: "string", example: "João Silva" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Token gerado com sucesso." },
          400: { description: "Usuário é obrigatório." },
        },
      },
    },
    "/api/analyze": {
      post: {
        summary: "Criar novo relato com IA",
        description: "Envia uma descrição de risco para a IA classificar e gera um novo relato.",
        tags: ["Reports"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  description: { type: "string", example: "Trabalhador sem capacete no andaime." },
                  siteId: { type: "string", example: "obra-001" },
                  reportedBy: { type: "string", example: "Carlos Supervisor" },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Relato criado e analisado com sucesso." },
        },
      },
    },
    "/api/reports": {
      get: {
        summary: "Listar todos os relatos",
        tags: ["Reports"],
        responses: {
          200: { description: "Lista de relatos retornada com sucesso." },
        },
      },
    },
    "/api/reports/{id}": {
      patch: {
        summary: "Atualizar status de um relato",
        description: "Rota protegida. Exige token JWT.",
        tags: ["Reports"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: { type: "string", example: "resolved" },
                  comment: { type: "string", example: "Problema corrigido pela equipe." },
                },
              },
            },
          },
        },
        responses: {
          200: { description: "Relato atualizado." },
          401: { description: "Acesso negado. Token não fornecido." },
        },
      },
      delete: {
        summary: "Excluir um relato",
        description: "Rota protegida. Exige token JWT.",
        tags: ["Reports"],
        security: [{ bearerAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string" } },
        ],
        responses: {
          200: { description: "Relato excluído com sucesso." },
          401: { description: "Acesso negado." },
        },
      },
    },
  },
};