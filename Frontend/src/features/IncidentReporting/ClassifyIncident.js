import axios from "axios";

const classifyIncident = async (description, image) => {
  const prompt = `Your task is to classify the incident based on the following factors:

- **Description**: ${description}
Classify the incident based on the description and provide a structured JSON response with the following fields:
- **description**: The description of the incident.
- **status**: The status of the incident (e.g., Open, Closed, Pending).
- **location**: The location where the incident occurred (if applicable).
- **severity**: The severity of the incident (e.g., High, Medium, Low).
- **incidentType**: The type of incident (e.g., Fire, Theft, Accident).

The response should be in JSON format with the following structure:
\`\`\`json
{
  "description": "<incident_description>",
  "status": "<incident_status>",
  "location": "<incident_location>",
  "severity": "<incident_severity>",
  "incidentType": "<incident_type>"
}
\`\`\`

**Task**: Analyze the description and classify the incident into the relevant categories. Provide a JSON object containing the classifications.`;

  try {
    const requestBody = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
    };

    if (image) {
      // Assuming 'image' is a File object, convert it to base64
      const base64Image = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(",")[1]);
        reader.onerror = reject;
        reader.readAsDataURL(image);
      });

      requestBody.contents[0].parts.push({
        inline_data: {
          mime_type: image.type, // e.g., 'image/jpeg'
          data: base64Image,
        },
      });

      // Adjust the prompt to instruct the model to analyze the image as well
      requestBody.contents[0].parts[0].text += " Analyze the provided image as well.";
    }

    // Send the request to the Google Gemini API
    console.log("Using API Key:", "AIzaSyCZnlsv63A_5hO1NSXS6-KQWZEZFd35Aok");
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCZnlsv63A_5hO1NSXS6-KQWZEZFd35Aok`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // console.log("Raw API Response:", response.data); // Log the raw response for debugging

    // Check if the response has valid structure and parts
    if (
      response.status === 200 &&
      response.data.candidates &&
      response.data.candidates.length > 0 &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      const classifiedIncident = response.data.candidates[0].content.parts[0].text;

      // // Log the classified incident text before parsing
      // console.log("Classified Incident Text:", classifiedIncident);

      // Remove the Markdown formatting (the triple backticks and any non-JSON text)
      const cleanedResponse = classifiedIncident.replace(/```json|```/g, "").trim();

      try {
        // Parse and return the cleaned JSON response
        return JSON.parse(cleanedResponse);
      } catch (error) {
        console.error("Error parsing the response:", error);
        console.error("Raw response text:", cleanedResponse); // Log the raw cleaned response
        return null;
      }
    } else {
      console.error("Failed to classify incident. Response structure is incorrect.");
      return "Failed to classify incident.";
    }
  } catch (error) {
    console.error("Error classifying the incident:", error);
    return null;
  }
};

export { classifyIncident };
