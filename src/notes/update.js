import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import { getData } from "../libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  const params = {
    TableName: process.env.tableName,
    Key: {
      noteId: item.body.noteId
    },
    // FilterExpression: "userId = :userId AND timeToLive > :now AND telomer > :telomer",
    UpdateExpression: "SET content = :content, iv = :iv, tag = :tag, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      // ":userId": item.body.userId,
      // ":now": item.now,
      // ":telomer": 0,
      ":content": item.body.content,
      ":iv": item.body.iv,
      ":tag": item.body.tag,
      ":updatedAt": item.now,
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});