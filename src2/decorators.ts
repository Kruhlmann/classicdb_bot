import { performance } from "perf_hooks";
import { ellipsis_middle } from "./string";

export function log_function_call<T>(
    _target: T,
    name: string,
    descriptor: PropertyDescriptor
): PropertyDescriptor {
    const method = descriptor.value;
    descriptor.value = async function (...arguments_: unknown[]) {
        const parameters = arguments_.map((a) => JSON.stringify(a)).join();
        const function_called_time = performance.now();
        const result = method.apply(this, arguments_);
        const function_completed_time = performance.now();
        const function_call_duration =
            Math.round((function_completed_time - function_called_time) * 100) /
            100;
        const result_string = JSON.stringify(result);
        const shortened_result_string = ellipsis_middle(35, result_string);
        const shortened_parameter_string = ellipsis_middle(35, parameters);

        console.debug(
            "Call: %s (%s) => %s (%d ms ellapsed)",
            name,
            shortened_parameter_string,
            shortened_result_string,
            function_call_duration
        );
        return result;
    };
    return descriptor;
}
