import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAthleteContext } from "../hooks/useAthleteContext";
import { useAuthContext } from "../hooks/useAuthContext";

import axios from "axios";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";

const GamelogForm = ({ athlete, athleteId }) => {
  // Funcationality for modal
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { dispatch } = useAthleteContext();
  const { user } = useAuthContext();

  const [date, setDate] = useState("");
  const [opponent, setOpponent] = useState("");
  const [result, setResult] = useState("");
  const [score, setScore] = useState("");
  const [opponentScore, setOpponentScore] = useState("");
  const [points, setPoints] = useState("");
  const [fieldGoalsMade, setFieldGoalsMade] = useState("");
  const [fieldGoalsAttempted, setFieldGoalsAttempted] = useState("");
  const [fieldGoalsPercentage, setFieldGoalsPercentage] = useState("");
  const [threePointFieldGoalsMade, setThreePointFieldGoalsMade] = useState("");
  const [threePointFieldGoalsAttempted, setThreePointFieldGoalsAttempted] =
    useState("");
  const [threePointFieldGoalsPercentage, setThreePointFieldGoalsPercentage] =
    useState("");
  const [freethrowsMade, setFreethrowsMade] = useState("");
  const [freethrowsAttempted, setFreethrowsAttempted] = useState("");
  const [freethrowsPercentage, setFreethrowsPercentage] = useState("");
  const [rebounds, setRebounds] = useState("");
  const [assists, setAssists] = useState("");
  const [blocks, setBlocks] = useState("");
  const [steals, setSteals] = useState("");
  const [turnovers, setTurnovers] = useState("");

  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (!user) {
      setError("You must be logged in");
      return;
    }

    axios
      .put(
        `http://localhost:8000/api/athlete/gamelog/${athleteId}`,
        {
          date,
          opponent,
          result,
          score,
          opponentScore,
          points,
          fieldGoalsMade,
          fieldGoalsAttempted,
          fieldGoalsPercentage,
          threePointFieldGoalsMade,
          threePointFieldGoalsAttempted,
          threePointFieldGoalsPercentage,
          freethrowsMade,
          freethrowsAttempted,
          freethrowsPercentage,
          rebounds,
          assists,
          blocks,
          steals,
          turnovers,
        },
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      )
      .then((res) => {
        console.log(res.data);
        dispatch({ type: "UPDATE_ATHLETE", payload: res.data });
        clearForm();
      })
      .catch((err) => console.log(err));
  };

  const clearForm = () => {
    setDate("");
    setOpponent("");
    setResult("");
    setScore("");
    setOpponentScore("");
    setPoints(0);
    setFieldGoalsMade("");
    setFieldGoalsAttempted("");
    setFieldGoalsPercentage("");
    setThreePointFieldGoalsMade("");
    setThreePointFieldGoalsAttempted("");
    setThreePointFieldGoalsPercentage("");
    setFreethrowsMade("");
    setFreethrowsAttempted("");
    setFreethrowsPercentage("");
    setRebounds("");
    setAssists("");
    setBlocks("");
    setSteals("");
    setTurnovers("");
  };

  const determineResult = (teamScore, oppScore) => {
    if (
      parseInt(teamScore) > parseInt(oppScore) &&
      parseInt(teamScore, oppScore) !== null
    ) {
      return "W";
    } else if (
      parseInt(teamScore) < parseInt(oppScore) &&
      parseInt(teamScore, oppScore) !== null
    ) {
      return "L";
    } else {
      return "";
    }
  };

  const calcPercentage = (made, attempted) => {
    return parseFloat((made / attempted) * 100).toFixed(1);
  };

  const calcPoints = () => {
    return parseInt(
      fieldGoalsMade * 2 + threePointFieldGoalsMade * 3 + freethrowsMade * 1
    );
  };

  useEffect(() => {
    setPoints(calcPoints());
  }, [fieldGoalsMade, threePointFieldGoalsMade, freethrowsMade]);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add to Gamelog
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add to Gamelog Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form className="gamelog-form" onSubmit={onSubmitHandler}>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formDate">
                <Form.Label>DATE</Form.Label>
                <Form.Control
                  type="date"
                  onChange={(e) => setDate(e.target.value)}
                  value={date}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formOpponent">
                <Form.Label>OPP</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setOpponent(e.target.value)}
                  value={opponent}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formTeamScore">
                <Form.Label>TEAM SCORE</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setScore(e.target.value);
                    setResult(determineResult(e.target.value, opponentScore));
                  }}
                  value={score}
                  placeholder="Enter Team Score"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formOpponentScore">
                <Form.Label>OPP SCORE</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setOpponentScore(e.target.value);
                    setResult(determineResult(score, e.target.value));
                  }}
                  value={opponentScore}
                  placeholder="Enter Opp Score"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formResult" id="formquerytest">
                <Form.Label>RESULT</Form.Label>
                <Form.Control type="text" value={result} disabled readOnly />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formFieldGoalsMade">
                <Form.Label>2PM</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setFieldGoalsMade(e.target.value);
                    if (fieldGoalsAttempted !== "") {
                      setFieldGoalsPercentage(
                        calcPercentage(e.target.value, fieldGoalsAttempted)
                      );
                    }
                  }}
                  value={fieldGoalsMade}
                  placeholder="Enter 2PM"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formFieldGoalsAttempted">
                <Form.Label>2FGA</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setFieldGoalsAttempted(e.target.value);
                    setFieldGoalsPercentage(
                      calcPercentage(fieldGoalsMade, e.target.value)
                    );
                  }}
                  value={fieldGoalsAttempted}
                  placeholder="Enter 2FGA"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formFieldGoalsPercentage">
                <Form.Label>2FG%</Form.Label>
                <Form.Control
                  type="number"
                  value={fieldGoalsPercentage}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formThreePointFieldGoalsMade">
                <Form.Label>3PM</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setThreePointFieldGoalsMade(e.target.value);
                    if (threePointFieldGoalsAttempted !== "") {
                      setThreePointFieldGoalsPercentage(
                        calcPercentage(
                          e.target.value,
                          threePointFieldGoalsAttempted
                        )
                      );
                    }
                  }}
                  value={threePointFieldGoalsMade}
                  placeholder="Enter 3PM"
                />
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="formThreePointFieldGoalsAttempted"
              >
                <Form.Label>3FGA</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setThreePointFieldGoalsAttempted(e.target.value);
                    setThreePointFieldGoalsPercentage(
                      calcPercentage(threePointFieldGoalsMade, e.target.value)
                    );
                  }}
                  value={threePointFieldGoalsAttempted}
                  placeholder="Enter 3FGA"
                />
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="formThreePointFieldGoalsPercentage"
              >
                <Form.Label>3FG%</Form.Label>
                <Form.Control
                  type="number"
                  value={threePointFieldGoalsPercentage}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formFreethrowsMade">
                <Form.Label>FTM</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setFreethrowsMade(e.target.value);
                    if (freethrowsAttempted !== "") {
                      setFreethrowsPercentage(
                        calcPercentage(e.target.value, freethrowsAttempted)
                      );
                    }
                  }}
                  value={freethrowsMade}
                  placeholder="Enter FTM"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formFreethrowsAttempted">
                <Form.Label>FTA</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => {
                    setFreethrowsAttempted(e.target.value);
                    setFreethrowsPercentage(
                      calcPercentage(freethrowsMade, e.target.value)
                    );
                  }}
                  value={freethrowsAttempted}
                  placeholder="Enter FTA"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formFreethrowsPercentage">
                <Form.Label>FT%</Form.Label>
                <Form.Control
                  type="number"
                  value={freethrowsPercentage}
                  disabled
                  readOnly
                />
              </Form.Group>
              <Form.Group
                as={Col}
                controlId="formThreePointFieldGoalsPercentage"
              >
                <Form.Label>PTS</Form.Label>
                <Form.Control type="number" value={points} disabled readOnly />
              </Form.Group>
            </Row>
            <Row className="mb-3">
              <Form.Group as={Col} controlId="formRebounds">
                <Form.Label>REB</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setRebounds(e.target.value)}
                  value={rebounds}
                  placeholder="Enter REB"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formAssists">
                <Form.Label>AST</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setAssists(e.target.value)}
                  value={assists}
                  placeholder="Enter AST"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formBlocks">
                <Form.Label>BLK</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setBlocks(e.target.value)}
                  value={blocks}
                  placeholder="Enter BLK"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formSteals">
                <Form.Label>STL</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setSteals(e.target.value)}
                  value={steals}
                  placeholder="Enter STL"
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formSteals">
                <Form.Label>TOV</Form.Label>
                <Form.Control
                  type="number"
                  onChange={(e) => setTurnovers(e.target.value)}
                  value={turnovers}
                  placeholder="Enter TOV"
                />
              </Form.Group>
            </Row>
            <Button type="submit" className="gamelog-submit-button">
              Add Game
            </Button>{" "}
            <Button variant="secondary" onClick={clearForm}>
              Clear
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          {error && <div className="error">{error}</div>}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default GamelogForm;
