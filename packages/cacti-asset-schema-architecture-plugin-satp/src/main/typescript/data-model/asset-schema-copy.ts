export interface IAssetSchemaContext {
  version: {
    "@id": string;
    "@type": string;
  };
  fungibility: {
    "@id": string;
    "@type": string;
  };
  facets: {
    "@id": string;
  };
  organization_key: {
    "@id": string;
    "@context": {
      public_key: {
        "@id": string;
        "@type": string;
      };
      issued: {
        "@id": string;
        "@type": string;
      };
    };
  };
}

export interface IAssetSchema {
  "@context": IAssetSchemaContext;
  "@id": string;
}

export const assetSchema: IAssetSchema = {
  "@context": {
    version: {
      "@id": "https://example.com/schemas/v1",
      "@type": "SchemaVersion",
    },
    fungibility: {
      "@id": "https://example.com/schemas/fungibility/fungible",
      "@type": "FungibilityType",
    },
    facets: {
      "@id": "https://example.com/schemas/facets/asset-facets",
    },
    organization_key: {
      "@id": "https://example.com/organizations/org123",
      "@context": {
        public_key: {
          "@id": "https://example.com/organizations/org123/public-key",
          "@type": "PublicKey",
        },
        issued: {
          "@id": "https://example.com/organizations/org123/issued",
          "@type": "IssuedDate",
        },
      },
    },
  },
  "@id": "https://example.com/schemas/asset-schema-001",
};
