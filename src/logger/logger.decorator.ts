import { Inject } from '@nestjs/common';
import { CustomLogger } from './logger.service';

export function logIO() {
    const injectLogger = Inject(CustomLogger);

    return (
        target: any,
        propertyKey: string,
        propertyDescriptor: PropertyDescriptor,
    ) => {
        injectLogger(target, 'logger');

        const originalMethod = propertyDescriptor.value;
        propertyDescriptor.value = async function (...args: any[]) {
            const logger: CustomLogger = this.logger;

            logger.log({
                state: 'will',
                action: propertyKey,
                logInfo: { arguments: args }
            });

            let res;

            try {
                res = await originalMethod.apply(this, args);
            } catch (err) {
                logger.error({
                    state: 'error',
                    action: propertyKey,
                    logInfo: { error: err.message }
                })

                throw new err;
            }

            logger.log({
                state: 'did',
                action: propertyKey,
                logInfo: { funcReturn: res },
            });

            return res;
        }
    }
}