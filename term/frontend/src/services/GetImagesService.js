import axios from "axios";
import { getEndPointOfGatewayData } from "./GetEndPointOfGateway";

const getImagesResponseData = async (data, text) => {
  try {
    const infoEndpoint = await getEndPointOfGatewayData();
    console.log("API Gateway URL:", infoEndpoint);

    const getImagesEndpoint = infoEndpoint.concat('/getImage');
    console.log("Get Images Endpoint:", getImagesEndpoint);

    const response = await axios.post(getImagesEndpoint, {
        id: data, text: text
    });
    return response;
  } catch (error) {
    console.error("Error in getImagesResponseData:", error);
    throw error; // rethrow the error for the calling code to handle
  }
};

export { getImagesResponseData };

