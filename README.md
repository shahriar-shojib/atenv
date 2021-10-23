## AtEnv is a modern replacement for parsing env on Typescript projects

### How to install

```bash
npm install atenv
```

## How to use

Declare a class which you want to parse env to

```ts
class AWS {
	@Env('AWS_SECRET')
	secret: string;

	@Env('AWS_KEY')
	key: string;
}

export class AppConfig {
	@Env('PORT')
	@IsNumber()
	port: number; // gets transformed to number automatically

	// it is also possible to define child classes for ease of use
	@Section(() => AWS)
	aws: AWS;
}

export const appConfig = parseEnv(AppConfig); //appConfig will now have values from your env
```
