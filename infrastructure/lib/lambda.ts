import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as logs from "aws-cdk-lib/aws-logs";

export class NodejsServiceFunction extends NodejsFunction {
  constructor(scope: Construct, id: string, props: NodejsFunctionProps) {
    const runtime = props.runtime ?? lambda.Runtime.NODEJS_14_X;
    const bundling = {
      externalModules: ["aws-sdk"],
    };
    const logRetention = logs.RetentionDays.ONE_DAY;
    const tracing = lambda.Tracing.ACTIVE;

    super(scope, id, {
      ...props,
      runtime,
      bundling,
      logRetention,
      tracing,
    });
  }
}
