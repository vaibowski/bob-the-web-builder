require("dotenv").config();

import {AzureOpenAI} from "openai";
import express from "express";

import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import {basePrompt as nodeBasePrompt} from "./defaults/node";
import {basePrompt as reactBasePrompt} from "./defaults/react";

const apiKey = process.env.AZURE_OPENAI_API_KEY;
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiVersion = "2024-08-01-preview";
const deployment = "gpt-4o";

const app = express();
app.use(express.json())

const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    const response = await client.chat.completions.create({
        messages: [
            { role: "user", content: prompt },
            {role: "system", content: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra"}
        ],
        model: deployment,
        max_tokens: 200,
    })
    const answer = response.choices[0].message.content

    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({message: "You cant access this"})
    return;
})

app.listen(3000);

// async function main() {
//
//
//
//     const responseStream = await client.chat.completions.create({
//         messages: [
//             { role: "user", content: "Write code for tree dfs" }
//         ],
//         model: deployment,
//         max_tokens: 8000,
//         stream: true
//     });
//
//     for await (const chunk of responseStream) {
//         const content = chunk.choices?.[0]?.delta?.content || "";
//         if (content) process.stdout.write(content.toString());
//     }
//
//     console.log("\nStreaming complete.");
// }

// main().catch(err => {
//     console.error("Error:", err);
// });





