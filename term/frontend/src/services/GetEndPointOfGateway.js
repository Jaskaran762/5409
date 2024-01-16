/* const ssm = new AWS.SSM({
  region: 'us-east-1',
  accessKeyId: process.env.REACT_APP_aws_access_key_id,
  secretAccessKey: process.env.REACT_APP_aws_secret_access_key,
  sessionToken: process.env.REACT_APP_aws_session_token
}); */

/* 
const params = {
  Name: '/MyApp/ApiGatewayUrl',
  WithDecryption: false
}; */

const getEndPointOfGatewayData = async () => {
  return process.env.REACT_APP_API_GATEWAY_URL;
};

export { getEndPointOfGatewayData };
