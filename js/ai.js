import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const defaultPrompt = "realistic portrait of a man";

export async function replace(file, prompt = defaultPrompt) {
  console.log("generating...");
  //   console.log(configuration.apiKey);
  //     const response = await openai.createImageEdit(
  //       file,
  //       file, // mask
  //       prompt,
  //       1,
  //       "512x512",
  //       "b64_json"
  //     );
  //     const { b64_json } = response.data.data[0];
  //     return `data:image/png;base64,${b64_json}`;
}
