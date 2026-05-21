export function buildPrompt({ entity, pattern, description }) {
  return `You are an SAP BTP (Business Technology Platform) expert.
Generate complete BTP configuration and boilerplate for the following:

App name     : ${entity}
Pattern      : ${pattern}
Description  : ${description}

Generate these files in exact order, each preceded by === FILENAME ===:

=== mta.yaml ===
Complete MTA deployment descriptor with:
- CAP srv module
- HANA HDI container service
- XSUAA service with scopes and role templates
- Destination service
- HTML5 repo host and runtime
- Approuter module

=== xs-security.json ===
XSUAA security descriptor with:
- App name and tenant mode
- Scopes for read and write
- Role templates
- Role collections

=== .env ===
Local development environment variables with:
- cds.requires configuration
- VCAP_SERVICES structure for local testing

=== xs-app.json ===
Approuter configuration with:
- Authentication type
- Route for CAP backend
- Route for UI5 frontend
- Session timeout

=== package.json ===
Root package.json with:
- All BTP related dependencies
- Deploy scripts for cf push
- Hybrid testing scripts

Generate production-quality configuration following SAP BTP best practices.
All files must be complete and ready to deploy — no placeholder values.`
}