export function buildPrompt({ entity, pattern, description }) {
  return `You are an SAP CAP (Cloud Application Programming Model) expert.
Generate a complete CAP project for the following:

Entity name  : ${entity}
Pattern      : ${pattern}
Description  : ${description}

Generate these files in exact order, each preceded by === FILENAME ===:

=== db/schema.cds ===
Complete CDS data model with all fields, types, keys, associations.
Include @title and @description annotations on all fields.
Use proper CDS types: UUID, String, Integer, Decimal, Date, DateTime, Boolean.

=== srv/service.cds ===
OData V4 service definition exposing the entity.
Include @requires: 'authenticated-user'.
Add @readonly or @insertonly where appropriate.

=== srv/service-handler.js ===
CAP Node.js handler with:
- before/on/after hooks for READ, CREATE, UPDATE, DELETE
- Input validation with req.reject()
- Error handling with try/catch
- No hard-coded values

=== package.json ===
Minimal CAP package.json with @sap/cds, @sap/cds-dk, express.

=== mta.yaml ===
BTP deployment descriptor with CAP srv module and HANA HDI container.

Generate production-quality code following SAP clean-core principles.
All code must be complete and runnable — no placeholder comments.`
}