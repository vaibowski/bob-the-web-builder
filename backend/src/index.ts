require("dotenv").config();

import {AzureOpenAI} from "openai";



async function main() {
    const apiKey = process.env.AZURE_OPENAI_API_KEY;
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
    const apiVersion = "2024-08-01-preview";
    const deployment = "gpt-4o";

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const responseStream = await client.chat.completions.create({
        messages: [
            { role: "user", content: "Write code for tree dfs" }
        ],
        model: deployment,
        max_tokens: 1000,
        stream: true,
    });

    for await (const chunk of responseStream) {
        const content = chunk.choices?.[0]?.delta?.content || "";
        if (content) process.stdout.write(content.toString());
    }

    console.log("\nStreaming complete.");
}

main().catch(err => {
    console.error("Error:", err);
});





