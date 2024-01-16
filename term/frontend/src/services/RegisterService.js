import axios from "axios";
import { getEndPointOfGatewayData } from "./GetEndPointOfGateway";

const registerResponseData = async (name, email, password) => {
  let registerResponse = null;
  try {
    const infoEndpoint = await getEndPointOfGatewayData();
    console.log("API Gateway URL:", infoEndpoint);

    const registerEndpoint = infoEndpoint.concat('/userRegistration');
    console.log("Registration Endpoint:", registerEndpoint);

    await axios.post(registerEndpoint, {
        email: email, 
        name: name, 
        password: password
    }).then(response => {
      console.log(response);
      registerResponse = response;
    });
    return registerResponse;
  } catch (error) {
    console.error("Error in registerResponseData:", error);
    throw error; // rethrow the error for the calling code to handle
  }
};

export { registerResponseData };
