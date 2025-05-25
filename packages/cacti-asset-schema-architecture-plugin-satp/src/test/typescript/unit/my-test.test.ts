import jsonld from "jsonld";

describe("jsonld expand and compact", () => {
  const doc = {
    "http://schema.org/name": "Manu Sporny",
    "http://schema.org/url": { "@id": "http://manu.sporny.org/" },
    "http://schema.org/image": {
      "@id": "http://manu.sporny.org/images/manu.png",
    },
  };

  const context = {
    name: "http://schema.org/name",
    homepage: { "@id": "http://schema.org/url", "@type": "@id" },
    image: { "@id": "http://schema.org/image", "@type": "@id" },
  };

  it("expands a compacted JSON-LD document correctly", async () => {
    const compacted = {
      "@context": context,
      name: "Manu Sporny",
      homepage: "http://manu.sporny.org/",
      image: "http://manu.sporny.org/images/manu.png",
    };

    const expanded = await jsonld.expand(compacted);

    expect(expanded).toEqual([
      {
        "http://schema.org/name": [{ "@value": "Manu Sporny" }],
        "http://schema.org/url": [{ "@id": "http://manu.sporny.org/" }],
        "http://schema.org/image": [
          { "@id": "http://manu.sporny.org/images/manu.png" },
        ],
      },
    ]);
  });

  it("compacts a JSON-LD document according to a context", async () => {
    const compacted = await jsonld.compact(doc, context);

    expect(compacted).toEqual({
      "@context": context,
      name: "Manu Sporny",
      homepage: "http://manu.sporny.org/",
      image: "http://manu.sporny.org/images/manu.png",
    });
  });
});
