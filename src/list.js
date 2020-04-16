import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import {getData} from "./libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  const params = {
    TableName: process.env.tableName,
    FilterExpression: "userId = :userId AND timeToLive > :now AND telomer > :telomer",
    ExpressionAttributeValues: {
      ":userId": item.body.userId,
      ":now": item.now,
      ":telomer": 0,
    }
  };

  const result = await dynamoDb.scan(params);

  return result.Items;
});