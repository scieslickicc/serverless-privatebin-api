import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async(event, context) => {
  let userId = '';

  const now = Math.ceil(Date.now()/1000);

  if (event.pathParameters && event.pathParameters.id) {
    userId = event.pathParameters.id;
  }

  const params = {
    TableName: process.env.userAccountTable,
    Key: {
      userId: userId
    },
    FilterExpression: "timeToLive > :now",
    ExpressionAttributeValues: {
      ":now": now,
      }
    };

  let result;

  result = await dynamoDb.get(params);

  return result.Item;
});