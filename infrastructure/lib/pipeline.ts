import { SecretValue, Stack, StackProps, Stage, StageProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import { InfrastructureStack } from "./infrastructure-stack";
import { CodePipeline, CodePipelineSource, ShellStep } from "aws-cdk-lib/pipelines";
import { BuildSpec, LinuxBuildImage } from "aws-cdk-lib/aws-codebuild";


class AppStage extends Stage {
  constructor(scope: Construct, id: string, props?: StageProps) {
    super(scope, id, props);
    new InfrastructureStack(this, "AppStack");
  }
}

export class ApplicationPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const source = CodePipelineSource.gitHub('phamtrantri/aws_cdk_app1', 'main', {
      authentication: SecretValue.secretsManager('todo_config', {
        jsonField: 'github_token'
      }),
    })

    const pipeline = new CodePipeline(this, 'Pipeline', {
      dockerEnabledForSynth: true,
      codeBuildDefaults: {
        buildEnvironment: {
          buildImage: LinuxBuildImage.AMAZON_LINUX_2_3
        },
        partialBuildSpec: BuildSpec.fromObject({
          phases: {
            install: {
              commands: [
                "n 16.15.1"
              ]
            }
          }
        })
      },
      synth: new ShellStep('Synth', {
        input: source,
        commands: [
          'cd webapp',
          'npm install',
          'npm run build',
          'cd ..', 
          'cd infrastructure',
          'npx cdk synth'
        ],
        primaryOutputDirectory: 'infrastructure/cdk.out'
      })
    });

    pipeline.addStage(new AppStage(this, 'Staging'));

  }
}