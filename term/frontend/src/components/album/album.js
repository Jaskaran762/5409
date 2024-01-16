import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/userSlice";
import { Card, Button, Container, Row, Col } from "react-bootstrap";
const ImageService = require("../../services/UploadImageService");
const GetUserPhotos = require("../../services/GetImagesService");

const cardStyle = {
  height: "250px",
  width: "380px",
};

function Album() {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const user = useSelector(selectUser);
  const [userPhotos, setUserPhotos] = useState([]);
  const [inputText, setInputText] = useState('');

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    await GetUserPhotos.getImagesResponseData(user.user, inputText).then((response) => {
      setUserPhotos(response.data.message);
      console.log(response.data.message);
    });
  };
  const handleFileChange = async (e) => {
    try {
      setLoading(true);

      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async function (event) {
        try {
          const imageData = reader.result;
          const response = await ImageService.uploadImageData(
            imageData,
            user.user
          );
          setImage(response.data.message);
          await getPhotos();
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError);
        } finally {
          setLoading(false);
        }
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error handling file change:", error);
      setLoading(false);
    }
  };

  const handleButtonClick = () => {
    // Call your method or perform actions here with the inputText value
    console.log('Input Text:', inputText);
    getPhotos();
  }; 

  return (
    <main role="main">
      <section className="jumbotron text-center">
        <div className="container">
          <h1 className="jumbotron-heading">SnapSearch: Your Memories, Instantly Rediscovered.</h1>
          <p className="lead text-muted">
          Introducing SnapSearch, an innovative photo management app. Easily upload and organize your memories with a simple interface. Effortlessly search through your extensive photo collection using advanced image recognition technology, making moments instantly accessible.
          </p>
          <p>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload Image to cloud storage</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileChange}
                accept="image/"
              />
            </Form.Group>
            {/* Render the loader while the image is being uploaded */}
            {loading && (
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
            {/* Render the image if available */}
            {image && !loading && <p />}
          </p>
        </div>
      </section>


      <div className="album py-5 bg-light">
        {/* Input text element */}
        <Form.Control type="text" placeholder="Search photos" onChange={(e) => setInputText(e.target.value)}/>
        {/* Button element */}
        <Button variant="primary" type="button" onClick={handleButtonClick}>
              Search Photos
            </Button>
        <br/><br/>
        <Container>
          <h2>Your photos</h2>
          <Row>
            {userPhotos != null &&
              userPhotos.map((photoUrl, index) => (
                <Col md={3} key={index}>
                  <Card className="mb-4 box-shadow">
                    <Card.Img
                      variant="top"
                      src={photoUrl}
                      alt={`Card ${index + 1} image cap`}
                      className="img-fluid"
                      style={cardStyle}
                    />
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button variant="outline-secondary" size="sm">
                          Download
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
      </div>
    </main>
  );
}

export default Album;
