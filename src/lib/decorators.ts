import { Type } from 'class-transformer';
import { defineEnvMetadata, defineSectionMetadata } from './metadata';

/**
 * @example
 * ```typescript
 * class MyEnv {
 *
 *   ＠Env('PORT') // process.env.PORT
 *   port: number; // will be converted to number
 *
 * }
 * ```
 *
 * @param name env value to be set
 * @returns
 */
export const Env = (name: string): PropertyDecorator => {
	return (target: object, propertyKey: string | symbol): void => {
		defineEnvMetadata(target, propertyKey.toString(), name);
	};
};

/**
 * @example
 * ```typescript
 * class AWS {
 *   ＠Env('SECRET')
 *   secret: string;
 * }
 *
 * class MyEnv {
 *   ＠Section(() => AWS)
 *   aws: AWS; //will be an instance of AWS after parsing
 * }
 *
 *
 * ```
 *
 * @param TClass a function that returns a  Class Definition
 * @returns
 */
export const Section = <T>(TClass: () => new () => T): PropertyDecorator => {
	return (target: object, propertyKey: string | symbol): void => {
		defineSectionMetadata(target, propertyKey.toString(), TClass());
		Type(TClass)(target, propertyKey);
	};
};
