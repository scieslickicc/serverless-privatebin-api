import * as uuid from "uuid";
import * as shortid from "shortid";

export const getData = (event) => {
  const now = Math.ceil(Date.now()/1000);
  const headers = event.headers;
  let body = JSON.parse(event.body);

  if (!body) {
    body = {
      noteId: '',
      userId: '',
      telomer: 3,
      timeToLive: 0,
      size: 0,
    };
  }

  if (event.pathParameters && event.pathParameters.id) {
    body.noteId = event.pathParameters.id;
  }

  if (!body.userId) {
    if (!headers["userid"]) {
      body.userId = uuid.v1();
    } else {
      body.userId = headers["userid"];
    }
  }

  // console.log(headers);
  console.log("userid: ",body.userId);

  if (body && !body.noteId) {
    // body.noteId = uuid.v1();
    body.noteId = shortid.generate();
  }

  return { now, headers, body };
};

export const createData = (event) => {
  const result = getData(event);

  if (result.body && !result.body.timeToLive) {
    result.body.timeToLive = 24 * 60; // 1 day
  }

  if (result.body && !result.body.telomer) {
    result.body.telomer = 3;
    // data.timeToLive= 10;
  }

  if (result.body && !result.body.type) {
    result.body.type = 'text/plain';
  }

  return result;
};
