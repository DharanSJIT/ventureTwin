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
            description: "The type of UI change. Must be one of: 'ADD_SKILL', 'RENDER_CHART', 'CHANGE_THEME', 'SHOW_ALERT'"
          },
          payload: {
            type: Type.OBJECT,
            description: "The data required for the action. For ADD_SKILL, it should be { skills: ['skill1'] }. For RENDER_CHART, it should be { chartType: 'pie', data: [...] }. For SHOW_ALERT, it should be { title: '...', message: '...' }",
            properties: {
              skills: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
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
