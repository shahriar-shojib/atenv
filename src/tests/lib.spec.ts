import { Transform } from 'class-transformer';
import { IsDefined } from 'class-validator';
import 'reflect-metadata';
import { parseEnv } from '../lib/atenv';
import { Env, Section } from '../lib/decorators';

describe('atEnv Main functionality', () => {
	class TestClass {
		@Env('TEST_ENV')
		public testEnv: string;
	}

	it('should create an instance of a given class', () => {
		const parsed = parseEnv(TestClass);
		expect(parsed).toBeInstanceOf(TestClass);
	});

	it('should be able to parse string env value', () => {
		const parsed = parseEnv(TestClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});
		expect(parsed.testEnv).toBe('abcd');
	});

	it('should be able to parse children classes', () => {
		class ChildClass {
			@Env('CHILD_ENV')
			childEnv: string;
		}

		class MainClass {
			@Section(() => ChildClass)
			childClass: ChildClass;
		}

		const parsed = parseEnv(MainClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});
		expect(parsed.childClass.childEnv).toBe('child env');
		expect(parsed.childClass).toBeInstanceOf(ChildClass);
	});

	it('should be able to parse boolean values', () => {
		class TestClass {
			@Env('TEST_BOOLEAN')
			public testEnv: boolean;
		}

		const parsed = parseEnv(TestClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});
		expect(parsed.testEnv).toBe(true);
		expect(typeof parsed.testEnv).toBe('boolean');
	});

	it('should be able to parse number values', () => {
		class TestClass {
			@Env('TEST_NUMBER')
			public testEnv: number;
		}

		const parsed = parseEnv(TestClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});
		expect(parsed.testEnv).toBe(123);
		expect(typeof parsed.testEnv).toBe('number');
	});

	it('should be able to parse date values', () => {
		class TestClass {
			@Env('TEST_DATE')
			public testEnv: Date;
		}

		const parsed = parseEnv(TestClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});
		expect(parsed.testEnv).toBeInstanceOf(Date);
	});

	it('should be throw validation errors if a case fails', () => {
		class TestClass {
			@Env('UNDEFINED_VALUE')
			@IsDefined()
			public testEnv: string;
		}

		expect(() => {
			parseEnv(TestClass, {
				dotEnvOptions: {
					path: '.env.test',
				},
			});
		}).toThrowError(/UNDEFINED_VALUE/);
	});

	it('should transform value if @Transform was used', () => {
		class TestClass {
			@Env('TEST_TRANSFORM')
			@Transform(({ value }) => value.toUpperCase())
			public testEnv: string;
		}

		const parsed = parseEnv(TestClass, {
			dotEnvOptions: {
				path: '.env.test',
			},
		});

		expect(parsed.testEnv).toBe('ABCD');
	});

	it('should throw errors with correct representation', () => {
		class TestClass {
			@Env('UNDEFINED_VALUE')
			@IsDefined()
			public testEnv: string;
		}

		expect(() =>
			parseEnv(TestClass, {
				dotEnvOptions: {
					path: '.env.test',
				},
			})
		).toThrowError(new Error('env key: UNDEFINED_VALUE validator: @IsDefined testEnv should not be null or undefined'));
	});
});
