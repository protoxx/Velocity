import { SchemaTypeDefinition } from 'sanity';
import { StructureResolver } from 'sanity/desk';

declare const schemaTypes: SchemaTypeDefinition[];

declare const deskStructure: StructureResolver;

export { deskStructure, schemaTypes };
