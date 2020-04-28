import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";
import {getData} from "./libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  console.log("body: ", item.body);

  const params = {
    TableName: process.env.tableName,
    // FilterExpression: "userId = :userId AND timeToLive > :now AND telomer > :telomer",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": item.body.userId,
      // ":now": item.now,
      // ":telomer": 0,
    }
  };

  const result = await dynamoDb.scan(params);

  result.Items.sort((a,b) => (a.createdAt > b.createdAt) ? -1 : ((b.createdAt > a.createdAt) ? 1 : 0));
  result.Items.forEach((item) => {
    if (item.telomer === 0 || item.timeToLive < item.now) {
      delete item.content;
      delete item.iv;
      delete item.tag;
    }

    return item;
  });

  return result.Items;
});