import json

from lfx.custom.custom_component.component import Component
from lfx.inputs.inputs import DataInput, MultilineInput
from lfx.io import Output
from lfx.schema.data import Data


class APIContractValidator(Component):
    display_name = "API Contract Validator"
    description = (
        "Validates an API response against a JSON Schema contract. "
        "Connect the output of an API Request component to API Response, "
        "paste your JSON Schema into the text area, and get a structured validation report."
    )
    icon = "ShieldCheck"
    name = "APIContractValidator"

    inputs = [
        DataInput(
            name="api_response",
            display_name="API Response",
            info="Connect the API Request component output here.",
        ),
        MultilineInput(
            name="json_schema",
            display_name="JSON Schema",
            info="Paste the JSON Schema that the API response must conform to.",
            value='{\n  "type": "object",\n  "required": []\n}',
        ),
    ]

    outputs = [
        Output(
            name="report",
            display_name="Validation Report",
            method="build_report",
        ),
    ]

    def _normalize_response(self):
        """Extract the actual response data from whatever the API Request component sends."""
        raw = self.api_response

        # Data objects have a .data attribute
        if hasattr(raw, "data"):
            data = raw.data
        elif isinstance(raw, dict):
            data = raw
        elif hasattr(raw, "text"):
            data = json.loads(raw.text)
        elif isinstance(raw, str):
            data = json.loads(raw)
        else:
            data = raw

        # Langflow's API Request component wraps the response body under 'result'
        if isinstance(data, dict) and "result" in data:
            return data["result"]

        return data

    def _run_validation(self, instance, schema_dict):
        """Validate `instance` against `schema_dict`. Returns (passed, errors)."""
        try:
            from jsonschema import Draft7Validator
        except ImportError:
            return (False, ["jsonschema library is not installed. Install it with: pip install jsonschema"])

        try:
            validator = Draft7Validator(schema_dict)
            errors = []
            for error in validator.iter_errors(instance):
                path = (
                    "/".join(str(p) for p in error.absolute_path)
                    if error.absolute_path
                    else "root"
                )
                errors.append(f"{path}: {error.message}")
            return len(errors) == 0, errors
        except Exception as e:
            return False, [f"Schema validation error: {e}"]

    def build_report(self) -> Data:
        # 1. Parse the incoming JSON Schema
        try:
            schema = json.loads(self.json_schema)
        except json.JSONDecodeError as e:
            report = {
                "overall_passed": False,
                "total": 1,
                "passed_count": 0,
                "failed_count": 1,
                "results": [
                    {
                        "name": "Schema Parse",
                        "passed": False,
                        "errors": [f"Invalid JSON Schema: {e}"],
                    }
                ],
            }
            self.status = json.dumps(report, indent=2)
            return Data(data=report)

        # 2. Normalize the API response
        try:
            response_data = self._normalize_response()
        except Exception as e:
            report = {
                "overall_passed": False,
                "total": 1,
                "passed_count": 0,
                "failed_count": 1,
                "results": [
                    {
                        "name": "Response Parse",
                        "passed": False,
                        "errors": [f"Cannot parse API response: {e}"],
                    }
                ],
            }
            self.status = json.dumps(report, indent=2)
            return Data(data=report)

        # 3. Validate the entire response against the schema in one shot.
        #    Schema's `items` keyword already handles validating individual elements.
        passed, errors = self._run_validation(response_data, schema)
        results = [
            {
                "name": "API Contract Validation",
                "passed": passed,
                "errors": errors,
            }
        ]

        total = 1
        passed_count = 1 if passed else 0
        report = {
            "overall_passed": passed_count == total,
            "total": total,
            "passed_count": passed_count,
            "failed_count": total - passed_count,
            "results": results,
        }

        self.status = json.dumps(report, indent=2)
        return Data(data=report)
