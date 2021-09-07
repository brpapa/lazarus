export function connectMongoose(): Promise<typeof mongoose>;
export function clearDatabase(): Promise<void>;
export function disconnectMongoose(): Promise<void>;
export function clearDbAndRestartCounters(): Promise<void>;
export function getContext(context: Object): {
    req: {};
    dataloaders: {};
    constructor: Function;
    toString(): string;
    toLocaleString(): string;
    valueOf(): Object;
    hasOwnProperty(v: PropertyKey): boolean;
    isPrototypeOf(v: Object): boolean;
    propertyIsEnumerable(v: PropertyKey): boolean;
};
export function sanitizeTestObject(payload: Object, keysToFreeze?: string[], ignore?: string[]): any;
export const createRows: typeof _createRows;
import mongoose from "mongoose";
import * as _createRows from "./createRows";
