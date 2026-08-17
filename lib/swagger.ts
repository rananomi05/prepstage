export const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "PrepStage API",
    version: "1.0.0",
    description:
      "API documentation for PrepStage — an AI interview rehearsal coach.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development server",
    },
  ],
  tags: [
    {
      name: "Questions",
      description: "AI-generated interview questions",
    },
    {
      name: "Feedback",
      description: "AI interview answer feedback",
    },
  ],
  paths: {
    "/api/questions": {
      post: {
        tags: ["Questions"],
        summary: "Generate interview questions",
        description:
          "Generates role-specific interview questions from a job description.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["jobDescription"],
                properties: {
                  jobDescription: {
                    type: "string",
                    example:
                      "We are looking for a Full Stack Developer with experience in React, Next.js, Node.js and MongoDB.",
                  },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Interview questions generated successfully",
          },
          "400": {
            description: "Invalid request",
          },
          "500": {
            description: "Internal server error",
          },
        },
      },
    },
  },
};