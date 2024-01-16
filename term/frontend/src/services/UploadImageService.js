import axios from "axios";
import { getEndPointOfGatewayData } from "./GetEndPointOfGateway";

const uploadImageData = async (data, id) => {
  try {
    const infoEndpoint = await getEndPointOfGatewayData();
    console.log("API Gateway URL:", infoEndpoint);

    const uploadImageEndpoint = infoEndpoint.concat('/uploadImage');
    console.log("Upload Endpoint:", uploadImageEndpoint);

    console.log(data);
    const response = await axios.post(uploadImageEndpoint, {
        image: data,
        id: id
    });
    return response;
  } catch (error) {
    console.error("Error in UPLOADiMAGESResponseData:", error);
    throw error; // rethrow the error for the calling code to handle
  }
};

export { uploadImageData };


