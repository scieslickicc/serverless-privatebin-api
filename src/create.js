import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import { createData } from "./libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = createData(event);

  // required data: content (encrypted), hash (from content before encrypted)

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: item.body.userId,
      noteId: item.body.noteId,
      timeToLive: item.now + item.body.ttl * 60, //, ttl in minutes valid date in epoch
      telomer: item.body.telomer, //max readCounter
      type: item.body.type, // test, json, etc, from rich editor
      passwordHash: item.body.hash, //todo create hash from password, or hash from password generated in front...
      //todo or hash from content - before encrypt?
      content: item.body.content, //todo: consider maybe in base64
      iv: item.body.iv,
      tag: item.body.tag,
      createdAt: item.now,
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});