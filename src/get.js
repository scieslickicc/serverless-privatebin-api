import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import { getData } from "./libs/body-parser-lib";

export const main = handler(async(event, context) => {
  const item = getData(event);

  const params = {
    TableName: process.env.tableName,
    Key: {
      noteId: item.body.noteId
    },
    FilterExpression: "timeToLive > :now AND telomer > :telomer",
    ExpressionAttributeValues: {
      ":now": item.now,
      ":telomer": 0,
      }
    };

  let result;

  result = await dynamoDb.get(params);
  if (!result.Item || result.Item.telomer === 0) {
    throw new Error("Item not found.");
  }

  const updateParams = {
    ...params,
    UpdateExpression: "set telomer = :telomer, readAt = :readAt",
    ExpressionAttributeValues: {
      ":telomer": result.Item.telomer - 1,
      ":readAt": item.now,
    },
    ReturnValues: "ALL_NEW"
  };

  const resultUpdated = await dynamoDb.update(updateParams);

  return resultUpdated.Attributes;
});