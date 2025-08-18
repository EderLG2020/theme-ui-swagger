// src/interfaces/swagger.interface.ts

export interface OpenApiDocument {
  openapi: string; // versión, ej: "3.0.1"
  info: OpenApiInfo;
  servers?: OpenApiServer[];
  paths: Record<string, Record<string, OpenApiOperation>>;
  components?: OpenApiComponents;
  security?: OpenApiSecurityRequirement[];
  tags?: OpenApiTag[];
  externalDocs?: OpenApiExternalDocs;
}

export interface OpenApiInfo {
  title: string;
  description?: string;
  termsOfService?: string;
  contact?: {
    name?: string;
    url?: string;
    email?: string;
  };
  license?: {
    name: string;
    url?: string;
  };
  version: string;
}

export interface OpenApiServer {
  url: string;
  description?: string;
  variables?: Record<string, OpenApiServerVariable>;
}

export interface OpenApiServerVariable {
  enum?: string[];
  default: string;
  description?: string;
}

export interface OpenApiTag {
  name: string;
  description?: string;
  externalDocs?: OpenApiExternalDocs;
}

export interface OpenApiExternalDocs {
  description?: string;
  url: string;
}

export interface OpenApiOperation {
  tags?: string[];
  summary?: string;
  description?: string;
  externalDocs?: OpenApiExternalDocs;
  operationId?: string;
  parameters?: OpenApiParameter[];
  requestBody?: OpenApiRequestBody;
  responses: Record<string, OpenApiResponse>;
  callbacks?: Record<string, any>; // puede ser complejo, opcional
  deprecated?: boolean;
  security?: OpenApiSecurityRequirement[];
  servers?: OpenApiServer[];
}

export interface OpenApiParameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  allowEmptyValue?: boolean;
  schema?: OpenApiSchema;
  example?: any;
  examples?: Record<string, any>;
}

export interface OpenApiRequestBody {
  description?: string;
  required?: boolean;
  content: Record<string, OpenApiMediaType>;
}

export interface OpenApiResponse {
  description: string;
  headers?: Record<string, OpenApiHeader>;
  content?: Record<string, OpenApiMediaType>;
  links?: Record<string, any>;
}

export interface OpenApiHeader {
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: OpenApiSchema;
}

export interface OpenApiMediaType {
  schema?: OpenApiSchema;
  example?: any;
  examples?: Record<string, any>;
  encoding?: Record<string, any>;
}

export interface OpenApiComponents {
  schemas?: Record<string, OpenApiSchema>;
  responses?: Record<string, OpenApiResponse>;
  parameters?: Record<string, OpenApiParameter>;
  requestBodies?: Record<string, OpenApiRequestBody>;
  headers?: Record<string, OpenApiHeader>;
  securitySchemes?: Record<string, OpenApiSecurityScheme>;
  links?: Record<string, any>;
  callbacks?: Record<string, any>;
}

export interface OpenApiSchema {
  type?: string;
  format?: string;
  enum?: any[];
  items?: OpenApiSchema;
  properties?: Record<string, OpenApiSchema>;
  required?: string[];
  description?: string;
  additionalProperties?: boolean | OpenApiSchema;
  allOf?: OpenApiSchema[];
  oneOf?: OpenApiSchema[];
  anyOf?: OpenApiSchema[];
  nullable?: boolean;
  default?: any;
  example?: any;
  title?: string;
}

export interface OpenApiSecurityScheme {
  type: string;
  description?: string;
  name?: string;
  in?: "query" | "header" | "cookie";
  scheme?: string;
  bearerFormat?: string;
  flows?: any;
  openIdConnectUrl?: string;
}

export interface OpenApiSecurityRequirement {
  [name: string]: string[];
}
