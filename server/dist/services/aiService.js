import { GoogleGenerativeAI } from '@google/generative-ai';
if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined. AI services will not work.");
}
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
export async function getProjectSummary(project, tasks) {
    const prompt = `
    Analyze this project and provide a comprehensive executive summary:
    
    Project: ${project.name}
    Description: ${project.description}
    
    Tasks (${tasks.length} total):
    ${tasks.map(task => `- ${task.title} (${task.status}): ${task.description}`).join('\n')}
    
    Please provide:
    1. Project overview and current status
    2. Task distribution across statuses
    3. Key insights and recommendations
    4. Potential risks or blockers
    5. Next steps and priorities
    
    Format as a professional executive summary.
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('AI Summary Error:', error);
        return 'Unable to generate AI summary at this time.';
    }
}
export async function getTaskAnswer(question, task, contextType) {
    const prompt = `
    Context: ${contextType}
    Task: ${task.title}
    Description: ${task.description}
    Status: ${task.status}
    
    Question: ${question}
    
    Please provide a helpful, specific answer based on the task context.
    `;
    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    }
    catch (error) {
        console.error('AI Q&A Error:', error);
        return 'Unable to get AI answer at this time.';
    }
}
//# sourceMappingURL=aiService.js.map