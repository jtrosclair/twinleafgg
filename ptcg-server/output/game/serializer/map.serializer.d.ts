import { Serializer, SerializerContext } from './serializer.interface';
export declare class MapSerializer implements Serializer<Map<any, any>> {
    readonly types: string[];
    readonly classes: MapConstructor[];
    serialize(map: Map<any, any>): any;
    deserialize(serialized: any, context: SerializerContext): Map<any, any>;
}
