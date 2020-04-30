import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const main = handler(async (event, context) => {
  const now = Math.ceil(Date.now()/1000);

  const params = {
    TableName: process.env.userAccountTable,
    Item: {
      userId: event.body.userId,
      counter: event.body.counter ? event.body.counter : 100,
      timeToLive: now + 30 * 24 * 60 * 60,
      createdAt: now,
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});