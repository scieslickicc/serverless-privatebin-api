import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import { getData } from "./libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  const params = {
    TableName: process.env.tableName,
    Key: {
      noteId: item.body.noteId
    },
    FilterExpression: "userId = :userId AND timeToLive > :now AND telomer > :telomer",
    UpdateExpression: "SET content = :content",
    ExpressionAttributeValues: {
      ":userId": item.body.userId,
      ":now": item.now,
      ":telomer": 0,
      ":content": item.body.content || null,
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});