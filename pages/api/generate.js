import { Configuration, OpenAIApi } from "openai";
import { prompts} from "@/pages"
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

// using the secret key for authentication
const openai = new OpenAIApi(configuration);

// the function is called from index.js when it fetch(api/generate)
export default async function(req, res) {
    if (!configuration.apiKey) {
        res.status(500).json({
          error: {
            message: "OpenAI API key not configured, please follow instructions in README.md",
          }
        });
        return;
    }

    // Get input and currentPrompt
    const { input}  = req.body;

    const APIrequest = generateAPIrequest(input);

    try {
        const response = await openai.createCompletion(APIrequest); 
        res.status(200).json({openAI:response.data.choices[0].text})
    } catch(error) {
        // Consider adjusting the error handling logic for your use case
        if(error.response){
            console.error(error.response.data, error.response.status);
            res.status(error.response.status).json(error.response.data);
        } else {
            console.log(`Error with OpenAI API request: ${error.message}`);
            res.status(500).json({
                error: {
                    message: 'An error occurred during your request.',
                }
            });
        }
    }
}

// Selecting which request to send based on current prompt and injecting user input into the request
function generateAPIrequest(input) {
    let request = {};
    prompts.request.prompt = input;
    request = prompts.request;
    return request;
}