import { Diagnose, Discharge, EntryWithoutId, HealthCheckRating, NewBaseEntry, SickLeave } from "../types";

const isObject = (obj: unknown): obj is Record<string, unknown> => obj !== null && typeof obj === 'object';

const isString = (text: unknown): text is string => typeof text === 'string';

const parseDescription = (description: unknown): string => {
    if (!isString(description)) {
        throw new Error('Incorrect or missing description');
    }
    return description;
};

const isDate = (date: string): boolean => Boolean(Date.parse(date));

const parseDate = (date: unknown): string => {
    if (!isString(date) || !isDate(date)) {
        throw new Error('Incorrect or missing date: ' + date);
    }
    return date;
};

const parseSpecialist = (specialist: unknown): string => {
    if (!isString(specialist)) {
        throw new Error('Incorrect or missing specialist');
    }
    return specialist;
};

const parseDiagnosisCodes = (object: unknown): Array<Diagnose['code']> => {
    if (isObject(object) && 'diagnosisCodes' in object) {
        return object.diagnosisCodes as Array<Diagnose['code']>;
    }
    return [] as Array<Diagnose['code']>;
};

const isNumber = (text: unknown): text is number => typeof text === 'number';

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
    return Object.values(HealthCheckRating).includes(param);
};

const parseHealthCheckRating = (healthCheckRating: unknown): HealthCheckRating => {
    if (!isNumber(healthCheckRating) || !isHealthCheckRating(healthCheckRating)) {
        throw new Error('Incorrect or missing healthCheckRating: ' + healthCheckRating);
    }
    return healthCheckRating;
};

const parseSickLeave = (object: unknown): SickLeave => {
    if (!isObject(object) || !('startDate' in object) || !('endDate' in object)) {
        throw new Error('Incorrect or missing sickLeave data');
    }
    return {
        startDate: parseDate(object.startDate),
        endDate: parseDate(object.endDate)
    };
};

const parseEmployerName = (employerName: unknown): string => {
    if (!isString(employerName)) {
        throw new Error('Incorrect or missing employerName');
    }
    return employerName;
};

const parseCriteria = (criteria: unknown): string => {
    if (!isString(criteria)) {
        throw new Error('Incorrect or missing criteria');
    }
    return criteria;
};

const parseDischarge = (object: unknown): Discharge => {
    if (!isObject(object) || !('date' in object) || !('criteria' in object)) {
        throw new Error('Incorrect or missing discharge data');
    }
    return {
        date: parseDate(object.date),
        criteria: parseCriteria(object.criteria)
    };
};

const toNewEntry = (object: unknown): EntryWithoutId => {
    if (!isObject(object)) {
        throw new Error('Incorrect or missing data');
    }

    const baseEntry: NewBaseEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        diagnosisCodes: parseDiagnosisCodes(object)
    };

    if ('type' in object) {
        switch (object.type) {
            case 'HealthCheck':
                if ('healthCheckRating' in object) {
                    return {
                        ...baseEntry,
                        type: 'HealthCheck',
                        healthCheckRating: parseHealthCheckRating(object.healthCheckRating)
                    };
                }
                throw new Error('Incorrect data: health check rating missing');

            case 'OccupationalHealthcare':
                if ('employerName' in object) {
                    const occupationalHealthcareEntry: EntryWithoutId = {
                        ...baseEntry,
                        type: 'OccupationalHealthcare',
                        employerName: parseEmployerName(object.employerName),
                        sickLeave: 'sickLeave' in object ? parseSickLeave(object.sickLeave) : undefined
                    };
                    return occupationalHealthcareEntry;
                }
                throw new Error('Incorrect data: employer name missing');

            case 'Hospital':
                if ('discharge' in object) {
                    return {
                        ...baseEntry,
                        type: 'Hospital',
                        discharge: parseDischarge(object.discharge)
                    };
                }
                throw new Error('Incorrect data: discharge missing');
                
            default:
                throw new Error('Unknown entry type');
        }
    }
    throw new Error('Missing type field');
};

export default toNewEntry;
