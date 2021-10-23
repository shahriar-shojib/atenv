import { ENV_KEY, SECTION_KEY } from './constants';

export const defineSectionMetadata = (target: object, propertyKey: string, TClass: new () => any) => {
	const oldMetadata = Reflect.getMetadata(SECTION_KEY, target);
	const newMetadata = {
		...oldMetadata,
		[propertyKey]: TClass,
	};
	Reflect.defineMetadata(SECTION_KEY, newMetadata, target);
};

export const defineEnvMetadata = (target: object, propertyKey: string, key: string) => {
	const oldMetadata = Reflect.getMetadata(ENV_KEY, target);
	const newMetadata = {
		...oldMetadata,
		[propertyKey]: key,
	};
	Reflect.defineMetadata(ENV_KEY, newMetadata, target);
};
