import { Construct } from "constructs";
import { AppServices } from "./services";
import * as cdk from "aws-cdk-lib";
import * as apigw from "@aws-cdk/aws-apigatewayv2-alpha";
import { CorsHttpMethod } from "@aws-cdk/aws-apigatewayv2-alpha";
import { HttpLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";

interface TodoAPIProps {
  todoService: AppServices;
}

export class TodoAPI extends Construct {
  public readonly httpApi: apigw.HttpApi;

  constructor(scope: Construct, id: string, props: TodoAPIProps) {
    super(scope, id);

    this.httpApi = new apigw.HttpApi(this, "HttpProxyApi", {
      apiName: "todo-api",
      createDefaultStage: true,
      corsPreflight: {
        allowHeaders: ['Authorization', 'Content-Type', '*'],
        allowCredentials: true,
        allowMethods: [
          CorsHttpMethod.GET,
          CorsHttpMethod.POST,
          CorsHttpMethod.DELETE,
          CorsHttpMethod.PUT,
          CorsHttpMethod.PATCH,
        ],
        allowOrigins: ["http://localhost:3000", "https://*"],
        maxAge: cdk.Duration.days(10),
      },
    });

    const getListTodoIntegration = new HttpLambdaIntegration(
      "GetListTodoIntegration",
      props.todoService.getListTodo,
      {}
    );

    const createTodoIntegration = new HttpLambdaIntegration(
      "CreateTodoIntegration",
      props.todoService.createTodo,
      {}
    );

    const updateTodoIntegration = new HttpLambdaIntegration(
      "UpdateTodoIntegration",
      props.todoService.updateTodo,
      {}
    );

    this.httpApi.addRoutes({
      path: '/todo/get-todo-list',
      methods: [apigw.HttpMethod.GET],
      integration: getListTodoIntegration
    })

    this.httpApi.addRoutes({
      path: '/todo/create',
      methods: [apigw.HttpMethod.POST],
      integration: createTodoIntegration
    })

    this.httpApi.addRoutes({
      path: '/todo/update/{id}',
      methods: [apigw.HttpMethod.PATCH],
      integration: updateTodoIntegration
    })

  }
}
