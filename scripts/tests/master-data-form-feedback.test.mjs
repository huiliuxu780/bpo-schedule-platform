import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { test } from "node:test"

const submitButtonPath = "components/maintenance-submit-button.tsx"
const fieldsPath = "components/master-data-maintenance-fields.tsx"
const formsPath = "components/master-data-maintenance-forms.tsx"

test("maintenance submit button centralizes pending feedback", () => {
  assert.equal(
    existsSync(submitButtonPath),
    true,
    "shared maintenance submit button component should exist"
  )

  const source = readFileSync(submitButtonPath, "utf8")

  assert.match(source, /^"use client"/)
  assert.match(source, /useFormStatus/)
  assert.match(source, /data-slot="maintenance-submit-button"/)
  assert.match(source, /disabled={pending}/)
  assert.match(source, /pendingLabel/)
  assert.match(source, /Send/)
})

test("maintenance fields centralize required visual markers", () => {
  const source = readFileSync(fieldsPath, "utf8")

  assert.match(source, /function MaintenanceFieldLabel/)
  assert.match(source, /data-slot="maintenance-field-label"/)
  assert.match(source, /data-slot="maintenance-field-required"/)
  assert.match(source, /aria-hidden="true"/)
  assert.match(source, /required \?/)
})

test("master data maintenance forms use shared submit feedback", () => {
  const source = readFileSync(formsPath, "utf8")

  assert.match(source, /MaintenanceSubmitButton/)
  assert.match(source, /from "@\/components\/maintenance-submit-button"/)
  assert.doesNotMatch(source, /from "@\/components\/ui\/button"/)
  assert.doesNotMatch(source, /import \{ Send \}/)
  assert.doesNotMatch(source, /<Button\s+type="submit"/)
})
