import { ChangeEvent, MouseEvent, useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import { UploadFileResponse } from "../@types";

type PlayerCredentials = {
  name: string;
  overall: string;
  position: string;
  pace: string;
  shooting: string;
  passing: string;
  dribbling: string;
  defense: string;
  physicality: string;
  image: string;
};

function Administrator() {
  const [selectedFile, setSelectedFile] = useState<File | string>("");
  const [playerCredentials, setPlayerCredentials] = useState<
    PlayerCredentials | string
  >("");

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    console.log("e.target", e.target);
    setSelectedFile(e.target.files?.[0] || "");
  };

  const handleInputCredentialsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPlayerCredentials({
      ...(playerCredentials as PlayerCredentials),
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitImage = async (e: MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append("image", selectedFile);

    const requestOptions = {
      method: "POST",
      body: formdata,
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/players/pictureUpload",
        requestOptions
      );
      if (!response.ok) {
        console.log("Something Happend!");
      }
      if (response.ok) {
        const result = (await response.json()) as UploadFileResponse;
        console.log("result :>> ", result);
        setPlayerCredentials({
          ...(playerCredentials as PlayerCredentials),
          image: result.data.image,
        });
        console.log("result.data.imageUrl :>> ", result.data.image);
      }
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  const handleSubmitAddPlayer = async () => {
    const headers = new Headers();
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    const body = new URLSearchParams();
    body.append("name", playerCredentials?.name);
    body.append("overall", playerCredentials?.overall);
    body.append("position", playerCredentials?.position);
    body.append("pace", playerCredentials?.pace);
    body.append("shooting", playerCredentials?.shooting);
    body.append("passing", playerCredentials?.passing);
    body.append("dribbling", playerCredentials?.dribbling);
    body.append("defense", playerCredentials?.defense);
    body.append("physicality", playerCredentials?.physicality);
    body.append(
      "image",
      playerCredentials?.image
        ? playerCredentials?.image
        : "https://as1.ftcdn.net/v2/jpg/03/39/45/96/1000_F_339459697_XAFacNQmwnvJRqe1Fe9VOptPWMUxlZP8.jpg"
    );

    const requestOptions = {
      method: "POST",
      headers,
      body,
    };
    try {
      const response = await fetch(
        "http://localhost:5000/api/players/createPlayer",
        requestOptions
      );
      const result = await response.json();
      console.log("result :>> ", result);
    } catch (error) {
      console.log("error :>> ", error);
    }
  };

  return (
    <div className="content-container">
      <div className="theForm">
        <Form onSubmit={handleSubmitImage}>
          <Form.Control type="file" onChange={handleFileChange} />
          <Button className="imageButton" type="submit">
            Upload Image
          </Button>
        </Form>
        <Form>
          <Form.Control
            className="nameInput"
            name="name"
            type="text"
            placeholder="Name"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="overall"
            type="text"
            placeholder="Overall"
            onChange={handleInputCredentialsChange}
          />

          <Form.Select
            style={{
              width: "49%",
              height: "9%",
              border: "2px solid black",
              marginTop: "19px",
              marginLeft: "4px",
            }}
            name="position"
            onChange={handleInputCredentialsChange}
            aria-label="Default select example"
          >
            <option>Position</option>
            <option value="ST">ST</option>
            <option value="CF">CF</option>
            <option value="SS">SS</option>
            <option value="LW">LW</option>
            <option value="RW">RW</option>
            <option value="CM">CM</option>
            <option value="CMD">CMD</option>
            <option value="CAM">CAM</option>
            <option value="AMF">AMF</option>
            <option value="RM">RM</option>
            <option value="DM">DM</option>
            <option value="LM">LM</option>
            <option value="CB">CB</option>
          </Form.Select>
          <Form.Control
            className="input"
            name="pace"
            type="text"
            placeholder="Pace"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="shooting"
            type="text"
            placeholder="Shooting"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="passing"
            type="text"
            placeholder="Passing"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="dribbling"
            type="text"
            placeholder="Dribbling"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="defense"
            type="text"
            placeholder="Defense"
            onChange={handleInputCredentialsChange}
          />
          <Form.Control
            className="input"
            name="physicality"
            type="text"
            placeholder="Physicality"
            onChange={handleInputCredentialsChange}
          />
          <Button className="playerButton" onClick={handleSubmitAddPlayer}>
            Add a Player
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Administrator;