import { Type, Schema } from '@google/genai';

export const updateUiStateTool = {
  functionDeclarations: [
    {
      name: "update_ui_state",
      description: "Dynamically alters the frontend interface based on user requests. Call this when the user asks for a UI change, a chart, or agrees to add a skill.",
      parameters: {
        type: Type.OBJECT,
        properties: {
          action: {
            type: Type.STRING,
            description: "The type of UI change. Must be one of: 'ADD_SKILL', 'ADD_PROJECT', 'ADD_CERTIFICATION', 'ADD_ACHIEVEMENT', 'RENDER_CHART', 'CHANGE_THEME', 'SHOW_ALERT'"
          },
          payload: {
            type: Type.OBJECT,
            description: "The data required for the action. For ADD_SKILL: { skills: ['skill1'] }. For ADD_PROJECT: { project: { title: '...', description: '...', technologies: ['...'] } }. For ADD_CERTIFICATION: { certification: { name: '...', issuer: '...', date: '...' } }. For ADD_ACHIEVEMENT: { achievement: { title: '...', description: '...' } }",
            properties: {
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              project: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  technologies: { type: Type.ARRAY, items: { type: Type.STRING } }
                }
              },
              certification: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  issuer: { type: Type.STRING },
                  date: { type: Type.STRING }
                }
              },
              achievement: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING }
                }
              },
              chartType: {
                type: Type.STRING
              },
              data: {
                type: Type.ARRAY,
                items: { type: Type.OBJECT }
              },
              title: {
                type: Type.STRING
              },
              message: {
                type: Type.STRING
              }
            }
          }
        },
        required: ["action", "payload"]
      } as Schema
    }
  ]
};
