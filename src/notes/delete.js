import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import {getData} from "../libs/body-parser-lib";

export const main = handler(async (event, context) => {
  const item = getData(event);

  const params = {
    TableName: process.env.tableName,
    Key: {
      noteId: item.body.noteId
    },
  };

  await dynamoDb.delete(params);

  return { status: true };
});