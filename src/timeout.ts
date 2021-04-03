export class TimeoutExceededError extends Error {}

export function timeout_after<TargetType>(ms_to_timout: number) {
    return function (target: TargetType, name: string, descriptor: PropertyDescriptor): PropertyDescriptor {
        const method = descriptor.value;
        descriptor.value = async function (...original_function_arguments: unknown[]) {
            return new Promise((resolve) => {
                const timeout = setTimeout(() => {
                    throw new TimeoutExceededError("Timed out");
                }, ms_to_timout);
                const result = method.apply(this, original_function_arguments);
                clearTimeout(timeout);
                resolve(result);
            }).catch((error: Error) => {
                if (error instanceof TimeoutExceededError) {
                    const message = `Function ${target}.${name} timed out after ${ms_to_timout}ms.`;
                    console.log(message);
                } else {
                    throw error;
                }
            });
        };
        return descriptor;
    };
}
