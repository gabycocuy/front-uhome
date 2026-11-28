"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import { Button } from "@/components/ui/Button";
import { InputText } from "@/components/ui/InputText";
import {
  getPropertyTypes,
  type PropertyInput,
  type PropertyType,
} from "@/services/properties";

import styles from "./PropertyForm.module.css";

export interface PropertyFormValues {
  name: string;
  description: string;
  address: string;
  latitude: string;
  longitude: string;
  price: string;
  propertyTypeId: string;
  distanceToCampus: string;
  available: boolean;
  characteristics: string;
  contractConditions: string;
}

interface PropertyFormProps {
  initialValues?: Partial<PropertyFormValues>;
  submitLabel: string;
  loading?: boolean;
  onSubmit: (data: PropertyInput) => Promise<void>;
}

const defaultValues: PropertyFormValues = {
  name: "",
  description: "",
  address: "",
  latitude: "",
  longitude: "",
  price: "",
  propertyTypeId: "",
  distanceToCampus: "",
  available: true,
  characteristics: "",
  contractConditions: "",
};

export function PropertyForm({
  initialValues,
  submitLabel,
  loading = false,
  onSubmit,
}: PropertyFormProps) {
  const [values, setValues] = useState<PropertyFormValues>({
    ...defaultValues,
    ...initialValues,
  });

  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [errors, setErrors] = useState<
    Partial<Record<keyof PropertyFormValues, string>>
  >({});
  const [typeError, setTypeError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTypes() {
      try {
        const data = await getPropertyTypes();

        if (active) {
          setPropertyTypes(data);
        }
      } catch {
        if (active) {
          setTypeError("Could not load property types.");
        }
      }
    }

    void loadTypes();

    return () => {
      active = false;
    };
  }, []);

  function updateValue(
    field: keyof PropertyFormValues,
    value: string | boolean,
  ) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: undefined,
    }));
  }

  function validate() {
    const nextErrors: Partial<
      Record<keyof PropertyFormValues, string>
    > = {};

    if (!values.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!values.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!values.address.trim()) {
      nextErrors.address = "Address is required.";
    }

    if (!values.propertyTypeId) {
      nextErrors.propertyTypeId = "Property type is required.";
    }

    if (!values.price || Number(values.price) <= 0) {
      nextErrors.price = "Enter a valid price.";
    }

    if (
      !values.distanceToCampus ||
      Number(values.distanceToCampus) < 0
    ) {
      nextErrors.distanceToCampus =
        "Enter a valid distance.";
    }

    if (
      values.latitude &&
      (Number(values.latitude) < -90 ||
        Number(values.latitude) > 90)
    ) {
      nextErrors.latitude =
        "Latitude must be between -90 and 90.";
    }

    if (
      values.longitude &&
      (Number(values.longitude) < -180 ||
        Number(values.longitude) > 180)
    ) {
      nextErrors.longitude =
        "Longitude must be between -180 and 180.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    const characteristics = values.characteristics
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const data: PropertyInput = {
      name: values.name.trim(),
      description: values.description.trim(),
      address: values.address.trim(),
      price: Number(values.price),
      propertyTypeId: Number(values.propertyTypeId),
      distanceToCampus: Number(values.distanceToCampus),
      available: values.available,
      characteristics,
      contractConditions:
        values.contractConditions.trim() || undefined,
    };

    if (values.latitude) {
      data.latitude = Number(values.latitude);
    }

    if (values.longitude) {
      data.longitude = Number(values.longitude);
    }

    await onSubmit(data);
  }

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
    >
      <div className={styles.grid}>
        <InputText
          name="name"
          label="Property name"
          value={values.name}
          onChange={(event) =>
            updateValue("name", event.target.value)
          }
          error={errors.name}
        />

        <div className={styles.field}>
          <label
            htmlFor="propertyTypeId"
            className={styles.label}
          >
            Property type
          </label>

          <select
            id="propertyTypeId"
            value={values.propertyTypeId}
            onChange={(event) =>
              updateValue(
                "propertyTypeId",
                event.target.value,
              )
            }
            className={styles.select}
            aria-invalid={Boolean(errors.propertyTypeId)}
          >
            <option value="">Select a type</option>

            {propertyTypes.map((type) => (
              <option
                key={type.id}
                value={type.id}
              >
                {type.name}
              </option>
            ))}
          </select>

          {errors.propertyTypeId ? (
            <p className={styles.error}>
              {errors.propertyTypeId}
            </p>
          ) : null}

          {typeError ? (
            <p className={styles.error}>
              {typeError}
            </p>
          ) : null}
        </div>

        <InputText
          name="address"
          label="Address"
          value={values.address}
          onChange={(event) =>
            updateValue("address", event.target.value)
          }
          error={errors.address}
        />

        <InputText
          name="price"
          label="Monthly price"
          inputMode="numeric"
          value={values.price}
          onChange={(event) =>
            updateValue("price", event.target.value)
          }
          error={errors.price}
        />

        <InputText
          name="distanceToCampus"
          label="Distance to campus (m)"
          inputMode="numeric"
          value={values.distanceToCampus}
          onChange={(event) =>
            updateValue(
              "distanceToCampus",
              event.target.value,
            )
          }
          error={errors.distanceToCampus}
        />

        <InputText
          name="latitude"
          label="Latitude"
          inputMode="decimal"
          value={values.latitude}
          onChange={(event) =>
            updateValue("latitude", event.target.value)
          }
          error={errors.latitude}
        />

        <InputText
          name="longitude"
          label="Longitude"
          inputMode="decimal"
          value={values.longitude}
          onChange={(event) =>
            updateValue("longitude", event.target.value)
          }
          error={errors.longitude}
        />

        <InputText
          name="characteristics"
          label="Characteristics"
          placeholder="Furnished, balcony, pet friendly"
          value={values.characteristics}
          onChange={(event) =>
            updateValue(
              "characteristics",
              event.target.value,
            )
          }
        />
      </div>

      <div className={styles.field}>
        <label
          htmlFor="description"
          className={styles.label}
        >
          Description
        </label>

        <textarea
          id="description"
          value={values.description}
          onChange={(event) =>
            updateValue(
              "description",
              event.target.value,
            )
          }
          className={styles.textarea}
          rows={5}
          aria-invalid={Boolean(errors.description)}
        />

        {errors.description ? (
          <p className={styles.error}>
            {errors.description}
          </p>
        ) : null}
      </div>

      <div className={styles.field}>
        <label
          htmlFor="contractConditions"
          className={styles.label}
        >
          Contract conditions
        </label>

        <textarea
          id="contractConditions"
          value={values.contractConditions}
          onChange={(event) =>
            updateValue(
              "contractConditions",
              event.target.value,
            )
          }
          className={styles.textarea}
          rows={4}
        />
      </div>

      <label className={styles.checkbox}>
        <input
          type="checkbox"
          checked={values.available}
          onChange={(event) =>
            updateValue(
              "available",
              event.target.checked,
            )
          }
        />

        <span>Property is available</span>
      </label>

      <div className={styles.actions}>
        <Button
          type="submit"
          loading={loading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}