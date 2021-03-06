import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';
import { ElasticsearchLoggerOptions } from './ElasticsearchLoggerOptions';
import * as os from 'os';
@Injectable()
export class ElasticsearchLoggerService {

    private readonly client: Client;

    public constructor(@Inject('CONFIG_OPTIONS') private readonly options: ElasticsearchLoggerOptions) {

        this.client = new Client(options.elasticsearchClientOptions);

    }

    /**
     * Primary log message handler.
     *
     * @param {string} level
     * @param message
     */
    public log(level: string, message: any, indice?: string): void {

        this.client.index({

            index: indice? indice:this.options.index,
            body: {

                date: new Date(),
                hostname: os.hostname(),
                level,
                body: message

            }

        });

        if (this.options.stdout) {

            console.log(`[${ this.options.name }] ${ JSON.stringify(message) }`);

        }

    }

    public raw(message: any, indice?: string): void {

        this.client.index({

            index: indice? indice:this.options.index,
            body: message

        });

        if (this.options.stdout) {

            console.log(`[${ this.options.name }] ${ JSON.stringify(message) }`);

        }

    }

    public info(message: any, indice?: string): void {

        this.log('info', message, indice);

    }

    public error(message: any, indice?: string): void {

        this.log('error', message, indice);

    }

    public debug(message: any, indice?: string): void {

        this.log('debug', message, indice);

    }

    public warning(message: any, indice?: string): void {

        this.log('warning', message, indice);

    }

    public trace(message: any, indice?: string): void {

        this.log('trace', message, indice);

    }

    public search() {

        this.client.search({

            index: 'mlfabric-logs-*',
            body: {}

        });

    }

}
