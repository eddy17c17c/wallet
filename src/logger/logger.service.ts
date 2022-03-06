import { Logger, Injectable, Scope } from '@nestjs/common';

interface ILogger {
    state: 'will' | 'did' | 'error';
    action: string;
    logInfo?: Record<string, unknown>;
}

@Injectable({ scope: Scope.TRANSIENT })
export class CustomLogger extends Logger {
    log(logObj: ILogger) {
        super.log(logObj);
    }

    error(logObj: ILogger) {
        super.error(logObj);
    }
}
