// import { NextApiRequest, NextApiResponse } from 'next';

import { NextApiRequest, NextApiResponse } from 'next';

// import Groq from 'groq-sdk';

// const groq = new Groq({
//   apiKey: process.env.groq_key,
// });

// export async function getGroqChatCompletion(context: any) {
//   return groq.chat.completions.create({
//     messages: [
//       {
//         role: 'user',
//         content: `Hey, I'm building a domain-based model for learners where my platform shows the path using nodes and edges for learning certain skills.
//         Please generate appropriate successive nodes for the current input node with the following details:
//         - Name: ${context.name}
//         - Description: ${context.description}
//         - Tags: ${context.tags.join(', ')}
//         - Resources: ${context.resources.join(', ')}
//         Generate the id for every node with using crypto.randomUUID()
//         Generate the output strictly in the form of an array of objects of size 3, where each object has the following properties:
//         - "id" : crypto.randomUUID()
//         - "name"
//         - "description"
//         - "tags"
//         - "resources"
//         Please provide the output in JSON format without any additional text.`,
//       },
//     ],
//     model: 'llama-3.3-70b-versatile',
//   });
// }

// function extractContent(jsonString : any) {
//   try {
//     const data = JSON.parse(jsonString);
//     return data.map((item : any) => ({
//       id : item.id,
//       name: item.name,
//       description: item.description,
//       tags: item.tags,
//       resources: item.resources,
//     }));
//   } catch (error) {
//     console.error('Invalid JSON format:', error);
//     return [];
//   }
// }
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   const b = req.body;
//   const context = {
//     name: b.name,
//     description: b.description,
//     tags: [],
//     resources: [],
//   };
//   const response = await getGroqChatCompletion(context);
//   return res.json(extractContent(response.choices[0].message.content));
// }
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function extractJsonData(text: string) {
  const jsonRegex = /```json\n([\s\S]*?)\n```/;
  const match = text.match(jsonRegex);

  if (match && match[1]) {
    return extractContent(match[1]);
  }

  console.error('No valid JSON found in the input text.');
  return [];
}

function extractContent(jsonString: string) {
  try {
    const data = JSON.parse(jsonString);
    return data.map(
      (item: {
        id: string;
        name: string;
        description: string;
        tags: string[];
        resources: string[];
      }) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        tags: item.tags || [],
        resources: item.resources || [],
      })
    );
  } catch (error) {
    console.error('Invalid JSON format:', error);
    return [];
  }
}

async function executePrompt(context: {
  name: string;
  description: string;
  tags: string[];
  resources: string[];
}) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'developer',
        content: `Hey, I'm building a domain-based model for learners where my platform shows the path using nodes and edges for learning certain skills.
            Please generate appropriate successive nodes for the current input with the following details:
            - Name: ${context.name}
            - Description: ${context.description}
            - Tags: ${context.tags.join(', ')}
            - Resources: ${context.resources.join(
              ', '
            )} every resource is a object, with the following properties:
            - "title" : string,
            -"url" : string, correct url of any documentation or youtube channel/playlist or github repo
            -"description" : string,
            Generate the id for every object using this function :  crypto.randomUUID()
            Generate the output strictly in the form of an array of objects of size 3, where each object has the following properties:
            - "id"
            - "name"
            - "description"
            - "tags"
            - "resources"
            Please provide the output in JSON format without any additional text.`,
      },
    ],
    max_tokens: 700,
  });

  return response.choices[0]?.message?.content;
}

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { name, description, tags = [], resources = [] } = req.body;
    const context = { name, description, tags, resources };
    const response = await executePrompt(context);
    const extractedData = extractJsonData(response as string);

    return res.status(200).json(extractedData);
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
