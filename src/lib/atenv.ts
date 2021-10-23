import { classToClass, ClassTransformOptions } from 'class-transformer';
import { validateSync, ValidatorOptions } from 'class-validator';
import { DotenvConfigOptions } from 'dotenv';
import { ENV_KEY, SECTION_KEY } from './constants';
import { convertToType } from './convertToType';

export type Options = {
	validatorOptions?: ValidatorOptions;
	transformOptions: ClassTransformOptions;
	dotEnvOptions?: DotenvConfigOptions;
};

export type Prototype = {
	[key: string]: any;
};

/**
 *
 * This function will load environment variables from the .env file.
 * It will also validate the environment variables.
 *
 * @example
 * ```typescript
 * import { parseEnv } from 'atenv';
 * import { IsNumber, isDefined } from 'class-validator';
 *
 *
 * class MyEnv {
 *
 *   ＠Env('PORT')
 *   ＠IsNumber() // will check if the value is a number
 *   ＠IsDefined() // will check if the value is defined in .env
 *   port: number; // will be converted to number
 *
 * }
 *
 * export const myEnv = parseEnv(MyEnv); // myenv is now an instance of MyEnv with the values from .env
 *
 * ```
 *
 * @param TClass Class name you want to place your environment variables
 * @param options Options for dotenv,class-validator,class-transformat @optional
 * @returns class instance with environment variables
 */
export const parseEnv = <T>(TClass: new () => T, options?: Options) => {
	require('dotenv').config(options?.dotEnvOptions);
	const instance = new TClass() as Prototype;

	const metadata = Reflect.getMetadata(ENV_KEY, instance) as Prototype;

	for (const [key, environmentName] of Object.entries(metadata)) {
		const type = Reflect.getMetadata('design:type', instance, key);
		instance[key] = convertToType(process.env[environmentName], type);
	}

	const sectionsMetadata = Reflect.getMetadata(SECTION_KEY, instance) as Prototype;
	if (sectionsMetadata) {
		for (const [key, section] of Object.entries(sectionsMetadata)) {
			instance[key] = parseEnv(section);
		}
	}

	const converted = classToClass(instance, options?.transformOptions);
	const errors = validateSync(converted, { stopAtFirstError: true, ...options?.validatorOptions });

	if (errors.length) {
		const mappedMessages = errors
			.map(e => {
				const environmentName = Reflect.getMetadata(ENV_KEY, e.target as object)[e.property];
				return `${e}Env Key: ${environmentName}`;
			})
			.join('\n');
		throw new Error(mappedMessages);
	}
	return converted as T;
};
