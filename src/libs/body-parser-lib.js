import * as uuid from "uuid";

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
    };
  }

  if (event.pathParameters && event.pathParameters.id) {
    body.noteId = event.pathParameters.id;
  }

  if (headers && !headers["Authorize"]) {
    body.userId = uuid.v1();
  } else {
    body.userId = headers["Authorize"];
  }

  if (body && !body.noteId) {
    body.noteId = uuid.v1();
  }

  body.userId = 'b4ed466c-7fee-11ea-bc55-0242ac130003'; //todo for test purposes only

  return { now, headers, body };
};

export const createData = (event) => {
  const result = getData(event);

  if (result.body && !result.body.timeToLive) {
    result.body.timeToLive = 1; // 15 minutes
    // data.timeToLive= 15; // 15 minutes
    // data.timeToLive= 24 * 60; // one day
  }

  if (result.body && !result.body.telomer) {
    result.body.telomer = 3;
    // data.timeToLive= 10;
  }

  if (result.body && !result.body.type) {
    result.body.type = 'text';
  }

  return result;
};
