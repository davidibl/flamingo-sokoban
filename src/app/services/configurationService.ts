import { Injectable } from '@angular/core';

@Injectable()
export class ConfigurationService {

    private _configuration: Object;

    public constructor() {
    }

    public addConfiguration(configuration: Object) {
        this._configuration = configuration;
    }

    public getConfigValue<T>(configPath: string, defaultValue?: T): T {
        const value = this.getObjectProperty(configPath, this._configuration);
        if (!value) {
            return defaultValue;
        }
        return value;
    }

    private getObjectProperty<T>(propertyPath: string, item: Object) {
        if (!item) {
            return null;
        }

        if (!propertyPath) {
            return item;
        }

        if (propertyPath.indexOf('.') < 0) {
            return item[propertyPath];
        }

        return <T>propertyPath.split('.')
            .reduce((previousValue, param) => previousValue && previousValue[param], item);
    }

}
