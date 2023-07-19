import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as s3Deploy from "aws-cdk-lib/aws-s3-deployment";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import { AppDatabase } from "./database";
import { AppServices } from "./services";
import { TodoAPI } from "./api";

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    const bucket = new s3.Bucket(this, "WebappBucket", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
    });

    const database = new AppDatabase(this, "Database");

    const services = new AppServices(this, 'Services', {
      todoTable: database.todoTable
    });

    new TodoAPI(this, 'TodoAPI', {
      todoService: services
    })

    const originAccessIdentity = new cloudfront.OriginAccessIdentity(
      this,
      "MyOriginAccessIdentity"
    );

    bucket.grantRead(originAccessIdentity);

    const webDistribution = new cloudfront.CloudFrontWebDistribution(
      this,
      "MyCloudFrontWebDistribution",
      {
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: bucket,
              originAccessIdentity: originAccessIdentity,
            },
            behaviors: [{ isDefaultBehavior: true }],
          },
        ],
        priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
      }
    );

    new s3Deploy.BucketDeployment(this, "DeployWebsite", {
      sources: [s3Deploy.Source.asset("../webapp/build")],
      destinationBucket: bucket,
      distribution: webDistribution,
      distributionPaths: ["/*"],
    });
  }
}
