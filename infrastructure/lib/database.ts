import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class AppDatabase extends Construct {
  public readonly todoTable: dynamodb.ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const todoTable = new dynamodb.Table(this, "TodoTable", {
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      partitionKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
    });
    todoTable.addGlobalSecondaryIndex({
      indexName: "GSI1",
      partitionKey: {
        name: "SK",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "PK",
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.INCLUDE,
      nonKeyAttributes: ["Title", "Status", "CreatedDate"],
    });

    this.todoTable = todoTable;
  }
}
