import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import { createData } from "../libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = createData(event);

  const params = {
    TableName: process.env.tableName,
    Item: {
      userId: item.body.userId,
      noteId: item.body.noteId,
      timeToLive: item.now + item.body.ttl * 60, //, ttl in minutes valid date in epoch
      telomer: item.body.telomer, //max readCounter
      type: item.body.type, // test, json, etc, from rich editor
      content: item.body.content,
      iv: item.body.iv,
      tag: item.body.tag,
      compression: item.body.compression,
      createdAt: item.now,
      size: item.body.size,
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});