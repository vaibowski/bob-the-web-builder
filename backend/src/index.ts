require("dotenv").config();

import {AzureOpenAI} from "openai";



async function main() {
    const apiKey = process.env.AZURE_OPENAI_API_KEY
    const endpoint = process.env.AZURE_OPENAI_ENDPOINT
    const apiVersion = "2024-05-01-preview";
    const deployment = "gpt-35-turbo";

    const client = new AzureOpenAI({ endpoint, apiKey, apiVersion, deployment });

    const result = await client.chat.completions.create({
        messages: [
            { role: "user", content: "Who is Virat Kohli?" }
        ],
        model: "gpt-35-turbo",
        max_tokens: 1000,
    });

    console.log(result.choices[0].message.content)
}

main();




