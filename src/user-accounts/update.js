import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  let userId = '';
  let counter = 100;

  const now = Math.ceil(Date.now()/1000);

  if (event.pathParameters && event.pathParameters.id) {
    userId = event.pathParameters.id;
  }

  if (event.pathParameters && event.pathParameters.counter) {
    counter = event.pathParameters.counter;
  }

  const params = {
    TableName: process.env.userAccountTable,
    Key: {
      userId: userId,
    },
    UpdateExpression: "SET counter = :counter, timeToLive = :timeToLive, updatedAt = :updatedAt",
    ExpressionAttributeValues: {
      ":counter": counter,
      ":timeToLive": now + 30 * 24 * 60 * 60,
      ":updatedAt": now,
    },
    ReturnValues: "ALL_NEW"
  };

  await dynamoDb.update(params);

  return { status: true };
});