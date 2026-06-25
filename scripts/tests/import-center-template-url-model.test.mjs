import assert from "node:assert/strict";
import test from "node:test";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

const {
  buildImportFieldMappingTemplateDeactivateUrl,
  buildImportFieldMappingTemplateDetailUrl,
  buildImportFieldMappingTemplateCreateUrl,
  buildImportFieldMappingTemplateNewWorkspaceHref,
  buildImportFieldMappingTemplateWorkspaceHref,
  buildImportFieldMappingTemplatesUrl,
} = jiti("../../components/import-center-model.ts");


test("import center mapping template URL builder supports all templates and file type filtering", () => {
  assert.equal(
    buildImportFieldMappingTemplatesUrl(undefined, "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates",
  );
  assert.equal(
    buildImportFieldMappingTemplatesUrl("master_data", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates?file_type=master_data",
  );
  assert.equal(
    buildImportFieldMappingTemplateCreateUrl("http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates",
  );
});

test("import center field mapping template detail URLs encode template path", () => {
  assert.equal(
    buildImportFieldMappingTemplateNewWorkspaceHref(),
    "/data-quality/field-mapping-templates/new",
  );
  assert.equal(
    buildImportFieldMappingTemplateWorkspaceHref("TPL/MD 001"),
    "/data-quality/field-mapping-templates/TPL%2FMD%20001",
  );
  assert.equal(
    buildImportFieldMappingTemplateWorkspaceHref("TPL/MD 001", {
      batchId: "BATCH/CSV 001",
    }),
    "/data-quality/field-mapping-templates/TPL%2FMD%20001?batchId=BATCH%2FCSV+001",
  );
  assert.equal(
    buildImportFieldMappingTemplateDetailUrl("TPL/MD 001", "http://127.0.0.1:8000"),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates/TPL%2FMD%20001",
  );
  assert.equal(
    buildImportFieldMappingTemplateDeactivateUrl(
      "TPL/MD 001",
      "http://127.0.0.1:8000",
    ),
    "http://127.0.0.1:8000/api/v1/import-field-mapping-templates/TPL%2FMD%20001/deactivate",
  );
});
