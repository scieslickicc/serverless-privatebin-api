import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import {getData} from "./libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  console.log("body: ", item.body);

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

  result.Items.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0));

  return result.Items;
});