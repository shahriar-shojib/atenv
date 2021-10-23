## AtEnv is a modern replacement for parsing env on Typescript projects

[![Run Tests](https://github.com/shahriar-shojib/atenv/actions/workflows/tests.yml/badge.svg)](https://github.com/shahriar-shojib/atenv/actions/workflows/tests.yml)
[![Publish to NPM](https://github.com/shahriar-shojib/atenv/actions/workflows/publish-to-npm.yml/badge.svg)](https://github.com/shahriar-shojib/atenv/actions/workflows/publish-to-npm.yml)

### How to install

```bash
npm install atenv
```

## How to use

Declare a class which you want to parse env to

```typescript
import 'reflect-metadata'; // required
import { IsEnum }  from 'class-validator';


export enum NodeEnv = {
	DEV = 'development',
	PRODUCTION = 'production'
}

class AWS {
	@Env('AWS_SECRET')
	secret: string;

	@Env('AWS_KEY')
	key: string;
}

export class AppConfig {
	@Env('PORT')
	@IsDefined() //you can use class validator decorators here
	port: number; // gets transformed to number automatically

	// it is also possible to define child classes for ease of use
	@Section(() => AWS)
	aws: AWS;

	@Env('NODE_ENV')
	@IsEnum(NodeEnv); // throws error if not defined
	nodeEnv: NodeEnv;


	//helper getters are okay too
	get isDev() {
		return this.nodeEnv === NodeEnv.DEV;
	}
}

export const appConfig = parseEnv(AppConfig); //appConfig is now an instance of AppConfig containing values from .env

//now access your env like this

appConfig.port // number
```

> Booleans, and Numbers are automatically transformed, if you need to use custom transformation logic, you can use the `@Transform` Decorator from [class-transformer](https://github.com/typestack/class-transformer#additional-data-transformation)

## Default and optional values

it is possible to set default values like this

```typescript
export enum NodeEnv = {
	DEV = 'development',
	PRODUCTION = 'production'
}

export class AppConfig {
	@Env('NODE_ENV')
	@IsEnum(NodeEnv); // throws error if not defined
	@IsOptional() // class validator will treat this value as optional
	nodeEnv: NodeEnv = NodeEnv.DEV;
}

const myEnv = parseEnv(AppConfig)

myEnv.nodeEnv === 'development' //true
```

## Custom Env files

```typescript
export enum NodeEnv = {
	DEV = 'development',
	PRODUCTION = 'production'
}

export class AppConfig {
	@Env('NODE_ENV')
	@IsEnum(NodeEnv); // throws error if not defined
	@IsOptional() // class validator will treat this value as optional
	nodeEnv: NodeEnv = NodeEnv.DEV;
}

const myEnv = parseEnv(AppConfig, {
	dotEnvOptions: {
		path: '.env.development' // or a path to your env
	}
})
```

## Additional Options

You can parse additional options for class-validator and class-transformer

```typescript
parseEnv(YourClass, {
	transformOptions: {} // override classToclass options
	validatorOptions: {} // override validateSync options
});
```

Docs for options:

- [transformOptions](https://github.com/typestack/class-transformer/blob/develop/src/interfaces/class-transformer-options.interface.ts)
- [validatorOptions](https://github.com/typestack/class-validator#passing-options)
