# cloudformation-yml-merger
The merger to merge the multiple template files for the AWS Cloudformation into one template file. 

- Automatically merge all the Cloudformation template yml files into one big yml file.
- The AWSTemplateFormatVersion will be located at the beginning of the generated yml file. 
- For SAM(Serverless Application Model), the Transform will follow the AWSTemplateFormatVersion if the Transform exist. 
- The blank lines will be trimed automatically.
- All yml comments will be removed

## Example

Let's assume a folder A contains multiple yaml files as below:

```
A  
|- a.yaml
|- B - b.yaml
|- C - c.yml
```

```
# a.yaml
AWSTemplateFormatVersion: 
  '2010-09-09'
Transform: AWS::Serverless-2016-10-31
```

```
# b.yaml
Description:
  "description"
  
Outputs:
  Test:
    value: "sample value"

Resources:  
  SampleBucket: #S3 
    Type: AWS::S3::Bucket
    Properties:
      AccessControl: PublicRead
```

```
# c.yml
Resources:
  APIGLambdaFunction: #Lambda 
    Type: AWS::Serverless::Function
    Properties:
      Handler: sample/sample.handler
```

The merge results would be as follows. All the comments and blank lines will be deleted and all the resources will be located in one Resources property. 

```
AWSTemplateFormatVersion: '2010-09-09'
Transform: 'AWS::Serverless-2016-10-31'
Resources:
  SampleBucket: 
    Type: 'AWS::S3::Bucket'
    Properties:
      AccessControl: PublicRead  
  APIGLambdaFunction:
    Type: 'AWS::Serverless::Function'
    Properties:
      Handler: sample/sample.handler
Description: description
Outputs:
  Test:
    value: sample value
```

## How to install 

```
$ npm install -g cloudformation-yml-merger
```

## How to use in CLI

Merge multiple yml template files into one big yml file to deploy to your AWS account.

```bash
$ cloudformation-yml-merger -i absolute-path-to-folder-containing-yml-files -o target-yml-file-name
```

- absolute-path-to-folder-containing-yml-files: the absolute path to the folder contains multiple yml files and sub folders to be merged. An error happens if it's not provided, it doesn't exist, it's not an absolute path, it doesn't contain any yml file, or any yml file doesn't contain the AWSTemplateFormatVersion.
- target-yml-file-name: the absolute path of the target file to be generated. An error happens if it's not provided or not an absolute path. 

## How to use in node.js

```javascript
const merger = require('cloudformation-yml-merger');

...

try {
  merger.merge(absolute-path-to-folder-containing-yml-files, target-yml-file-name);\
} catch (err) {
  console.log('failed to merge the yml files', err);
}
```