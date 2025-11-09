# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

- `npm run build` compile typescript to js
- `npm run watch` watch for changes and compile
- `npm run test` perform the jest unit tests
- `npm run test:coverage` run tests with coverage report
- `npm run ci` run all CI checks locally
- `npx cdk deploy` deploy this stack to your default AWS account/region
- `npx cdk diff` compare deployed stack with current state
- `npx cdk synth` emits the synthesized CloudFormation template

## Development Workflow

### Before committing:

```bash
npm run ci
```

This will run the same checks as the CI pipeline:

- TypeScript compilation
- Jest tests

## CI/CD

The project includes a GitHub Actions workflow (`.github/workflows/pull_request.yml`) that runs on pull requests and pushes to main/develop branches:

### Jobs:

1. **Quality Checks**: Runs on Node.js 18.x and 20.x

   - TypeScript compilation
   - Jest tests
   - Test coverage upload

2. **CDK Validation**:

   - CDK synthesis
   - CDK diff (in PR context)

3. **Security Audit**:

   - npm audit for vulnerabilities

4. **Build Summary**:
   - Aggregates results from all jobs
