import { ChromaClient } from '@chromadb/core';
import { OpenAIEmbeddingFunction } from '@chromadb/openai';
(async () => {
    const client = new ChromaClient();
    client.heartbeat().then(console.log);
    const openaiEmbeddingFunction = new OpenAIEmbeddingFunction({
        openai_api_key: "API_KEY",
    });
    const collection = await client.createCollection({
        name: "node-esm",
        embeddingFunction: openaiEmbeddingFunction,
    });
    await collection.add({
        ids: ["doc1", "doc2"],
        documents: ["doc1", "doc2"],
    });
    let count = await collection.count();
    console.log("count", count);
    const result = await collection.query({
        queryTexts: ["doc1"],
        nResults: 1,
    });
    console.log("query result", result);
})();
//# sourceMappingURL=index.js.map