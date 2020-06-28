import React, { Component } from 'react';
import axios from 'axios';
import { Button, Container, Row, Col, Table, Alert } from 'react-bootstrap';
import CustomAlert from './Alert'

class App extends Component {

  state = {
    success: false,
    error: false,
    url: "",
    errorMessage: "",
    files: [],
    bucket: ""
  }


  handleChange = (e) => {
    this.setState({ success: false, url: "" });

  }
  handleUpload = e => {
    e.preventDefault();
    // e.target.value = null;

    let file = this.uploadInput.files[0];
    // Split the filename to get the name and type
    let fileParts = this.uploadInput.files[0].name.split('.');
    let fileName = fileParts[0];
    let fileType = fileParts[1];
    console.log("Preparing the upload", fileName, fileType);

    axios.post("http://localhost:3001/api/signed-url", {
      fileName: `${new Date().getTime()}_${file.name}`,
      fileType: file.type
    })
      .then(response => {
        console.log("Recieved a signed request ", response.data);
        var options = { headers: { 'Content-Type': file.type } };
        var signedURL = response.data.url
        return axios.put(signedURL, file, options);
      }).then(function (response) {
        console.log('88888888888888 ', response)
        alert("Uploaded Successfully");
      }.bind(this))
      .catch(error => {
        // this.setState({ error: true });
        console.log(error)
        alert(JSON.stringify(error));
      })
  }

  componentDidMount() {
    axios.get("http://localhost:3001/api/get-files", {
    }).then(function (response) {
      var data = response.data.data
      console.log(data)
      this.setState({ files: data, bucket: response.data.bucket })
      console.log("response ", response)
    }.bind(this)).catch(console.error)
  }

  render() {
    return (
      <Container>
        <Row>
          <Col sm={4}>
            <h1>Upload a File</h1>
            {/* {this.state.success ? <CustomAlert variant= "success" heading="File Upload" message="Successfully Upload" /> : null} */}
            {/* {this.state.error ? <ErrorMessage /> : null} */}
            <input id="contained-button-file" onChange={this.handleChange} ref={(ref) => { this.uploadInput = ref; }} type="file" />
            <br />
            <Button className="mt-2" variant="primary" size="sm" onClick={this.handleUpload}>UPLOAD</Button>
          </Col>
          <Col sm={8}>
            <Table bordered>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Files</th>
                </tr>
              </thead>
              <tbody>
                {this.state.files.length === 0 ? <tr></tr> : this.state.files.map((listValue, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td><a href={`https://${this.state.bucket}.s3.amazonaws.com/${listValue.name}`}>{listValue.name}</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;