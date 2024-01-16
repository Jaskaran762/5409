// loginService.js
import axios from "axios";
import { getEndPointOfGatewayData } from "./GetEndPointOfGateway";

const loginResponseData = async (email, password) => {
  let infoEndpoint = ""; 
  let loginResponse = null;
  try {
    await getEndPointOfGatewayData().then(apiGatewayPath => {
      // This block will be executed when the promise is fulfilled
      console.log("API Gateway URL:", apiGatewayPath);
      infoEndpoint = apiGatewayPath;
    });

    const loginEndpoint = infoEndpoint.concat('/userLogin');
    console.log("Login Endpoint:", loginEndpoint);

    console.log(email);

    await axios.post(loginEndpoint, {
      email: email,
      password: password
    })
      .then(response => {
        console.log(response);
        loginResponse = response;
      });

    return loginResponse;
  } catch (error) {
    console.error("Error in loginResponseData:", error);
    throw error; // rethrow the error for the calling code to handle
  }
};

export { loginResponseData };
