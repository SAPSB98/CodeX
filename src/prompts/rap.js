export function buildPrompt({ entity, pattern, description }) {
  return `You are an SAP RAP (ABAP RESTful Application Programming) expert.
Generate a complete RAP Business Object for the following:

Entity name  : ${entity}
Pattern      : ${pattern}
Description  : ${description}

Generate these files in exact order, each preceded by === FILENAME ===:

=== Z${entity.toUpperCase()}_INTF.asddls ===
CDS interface view with:
- All relevant fields from the database table
- @AbapCatalog.viewEnhancementCategory
- @AccessControl.authorizationCheck
- @Metadata.ignorePropagatedAnnotations
- Key fields clearly marked

=== Z${entity.toUpperCase()}_CONS.asddls ===
CDS consumption view with:
- @Search annotations for searchable fields
- @UI annotations for list and object page
- @ObjectModel.semanticKey
- Value helps where needed

=== Z${entity.toUpperCase()}_BDEF.asbdef ===
Behaviour definition with:
- managed or unmanaged based on pattern
- draft enabled if pattern is draft
- standard CRUD operations
- validations and determinations declared

=== ZBP_${entity.toUpperCase()}_IMPL.abap ===
Behaviour implementation class with:
- Full ABAP class definition and implementation
- All validation methods
- All determination methods
- Proper error handling using failed, reported tables

=== Z${entity.toUpperCase()}_MAPP.asddls ===
Metadata extension with:
- @UI.lineItem annotations for list page
- @UI.identification for object page header
- @UI.facets for object page sections
- Field labels and positions

Generate production-quality ABAP code following SAP clean-core principles.
All code must be complete and runnable — no placeholder comments.`
}