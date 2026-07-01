import { createClient } from "redis";

const client = createClient({ url: 'redis://localhost:6379' });

async function processSubmission(submission: string) {
    const { problemId, code, language } = JSON.parse(submission);
    console.log(`Processing submission for ${problemId}.`);
    console.log(`Code: ${code}.`);
    console.log(`Language: ${language}.`);

    await new Promise((resolve) => { setTimeout(resolve, 1000); });
    console.log('Finished processing this nigga - ', problemId);
}

async function startWorker() {
    try {
        await client.connect();
        console.log('Worker connected to redis.');
        
        while(true) {
            try {
                const submission = await client.brPop("problems", 0);

                await processSubmission(submission.element);
            } catch(err) { console.log('Error processing the submission.'); } 
        }
    } catch(err) {
        console.log('Failed to connect to redis.')
    }
}

startWorker();