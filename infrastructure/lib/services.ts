import { Construct } from "constructs";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import * as iam from "aws-cdk-lib/aws-iam";
import { NodejsServiceFunction } from "./lambda";
import path = require("path");

interface AppServicesProps {
  todoTable: dynamodb.ITable;
}

export class AppServices extends Construct {
  public readonly getListTodo: NodejsFunction;
  public readonly createTodo: NodejsFunction;
  public readonly updateTodo: NodejsFunction;

  constructor(scope: Construct, id: string, props: AppServicesProps) {
    super(scope, id);

    this.getListTodo = new NodejsServiceFunction(scope, "GetListTodoService", {
      entry: path.join(__dirname, "..", "..", "services", "todo", "index.js"),
      handler: 'getListTodo',
      environment: {
        DYNAMO_DB_TABLE: props.todoTable.tableName
      }
    });
    props.todoTable.grantReadWriteData(this.getListTodo);

    this.createTodo = new NodejsServiceFunction(scope, "CreateTodoService", {
      entry: path.join(__dirname, "..", "..", "services", "todo", "index.js"),
      handler: 'createTodo',
      environment: {
        DYNAMO_DB_TABLE: props.todoTable.tableName
      }
    });
    props.todoTable.grantReadWriteData(this.createTodo);


    this.updateTodo = new NodejsServiceFunction(scope, "UpdateTodoService", {
      entry: path.join(__dirname, "..", "..", "services", "todo", "index.js"),
      handler: 'updateTodo',
      environment: {
        DYNAMO_DB_TABLE: props.todoTable.tableName
      }
    });
    props.todoTable.grantReadWriteData(this.updateTodo);

  }
}
